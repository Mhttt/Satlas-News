import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { BlobServiceClient } from '@azure/storage-blob';
import { getRepository } from 'typeorm';
import { NewsArticle } from '../database/entities/NewsArticle.entity';
import makeid from '../helpers/randomString';
import SatlasRoute from '../helpers/SatlasRoute';

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<any> {
  const {
    formData,
    articleURL,
  }: {
    formData: Partial<NewsArticle> & {
      images: {
        blockid: string;
        type: string;
        name: string;
        base64: string;
      }[];
    };
    articleURL: string;
  } = req.body;

  if (!(formData && articleURL)) {
    return {
      status: 400,
      body: {
        message: 'You must fill out all fields',
      },
    };
  }

  const repo = getRepository(NewsArticle);

  const exists = await repo.findOne({
    url: articleURL.trim().toLowerCase(),
  });

  if (!exists) {
    return {
      status: 404,
      body: {
        message: 'Post with that ID not found',
      },
    };
  }

  if (formData.title && formData.title !== exists.title) {
    exists.title = formData.title;
  }

  if (
    formData.jsonRepresentation &&
    formData.jsonRepresentation !== exists.jsonRepresentation
  ) {
    // new json reprsentation... Upload the images

    const uploadedImages: string[] = [];
    const parsedJSON: {
      time: number;
      blocks: { id: string; type: string; data: any }[];
    } = JSON.parse(formData.jsonRepresentation);

    if (formData.images.length > 0) {
      // There are images. Upload
      const blobServiceClient = BlobServiceClient.fromConnectionString(
        process.env.AZURE_STORAGE_CONNECTION_STRING!
      );

      const containerClient =
        blobServiceClient.getContainerClient('postimages');

      for (const img of formData.images) {
        const imageName = `${img.blockid}-${makeid(5)}-${img.name}`.replace(
          /[^a-zA-Z0-9.-]/g,
          ''
        ); // Replace special characters beacuse Azure doesn't allow it

        const blockBlobClient = containerClient.getBlockBlobClient(imageName);
        const rawBase64 = img.base64.split(',')[1];
        const imgBuffer = await Buffer.from(rawBase64, 'base64');
        const uploadResponse = await blockBlobClient.upload(
          imgBuffer,
          imgBuffer.length,
          {
            blobHTTPHeaders: { blobContentType: img.type },
          }
        );

        if (uploadResponse.requestId) {
          const imageURL = `https://satlasnewsimages.blob.core.windows.net/postimages/${imageName}`;
          parsedJSON.blocks[
            parsedJSON.blocks.findIndex((v, i) => v.id === img.blockid)
          ].data.imageURL = imageURL;

          uploadedImages.push(imageURL);
        }
      }
    }

    if (uploadedImages.length > 0) {
      exists.previewImage = uploadedImages[0];
    }

    exists.jsonRepresentation = JSON.stringify(parsedJSON);
  }
  if (
    formData.shortdescription &&
    formData.shortdescription !== exists.shortdescription
  ) {
    exists.shortdescription = formData.shortdescription;
  }

  if (formData.tags && formData.tags !== exists.tags) {
    exists.tags = formData.tags;
  }

  if (formData.lat && formData.lat !== exists.lat) {
    exists.lat = formData.lat;
  }

  if (formData.lon && formData.lon !== exists.lon) {
    exists.lon = formData.lon;
  }

  if (formData.icon && formData.icon !== exists.icon) {
    exists.icon = formData.icon;
  }

  await repo.save(exists);

  return {
    status: 200,
    body: {
      message: 'Successfully updated',
    },
  };
};

export default SatlasRoute(httpTrigger, ['PUT']);
