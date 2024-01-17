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
    icon,
    jsonRepresentation,
    lat,
    lon,
    shortdescription,
    title,
    images,
  }: Partial<NewsArticle> & {
    images: {
      blockid: string;
      type: string;
      name: string;
      base64: string;
    }[];
  } = req.body;

  if (
    !(
      icon &&
      jsonRepresentation &&
      lat !== undefined &&
      lon !== undefined &&
      shortdescription &&
      title &&
      images
    )
  ) {
    return {
      status: 400,
      body: {
        message: 'You must fill out all fields',
      },
    };
  }

  const newsArticleRepo = getRepository(NewsArticle);

  const urlForPost = title
    .trim()
    .replace(/[^\w\s]/gi, '')
    .replaceAll(' ', '-')
    .toLowerCase();

  const exists = await newsArticleRepo.findOne({ url: urlForPost });

  if (exists) {
    return {
      status: 400,
      body: {
        message: 'Post with that title already exists',
      },
    };
  }

  // Create a new article
  const newArticle = new NewsArticle();
  const uploadedImages: string[] = [];
  const parsedJSON: {
    time: number;
    blocks: { id: string; type: string; data: any }[];
  } = JSON.parse(jsonRepresentation);

  // Upload the images.

  if (images.length > 0) {
    // There are images. Upload
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING!
    );

    const containerClient = blobServiceClient.getContainerClient('postimages');

    for (const img of images) {
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

  newArticle.title = title;
  newArticle.shortdescription = shortdescription;
  newArticle.jsonRepresentation = JSON.stringify(parsedJSON);
  newArticle.tags = req.body.tags;
  newArticle.url = `${urlForPost}@${makeid(5)}`.toLowerCase(); // tmp
  newArticle.lat = lat;
  newArticle.lon = lon;
  newArticle.icon = icon;
  if (uploadedImages.length > 0) {
    newArticle.previewImage = uploadedImages[0];
  }
  await newsArticleRepo.save(newArticle);

  return {
    status: 200,
    body: {
      message: 'Successfully posted',
      article: newArticle,
    },
  };
};

export default SatlasRoute(httpTrigger, ['POST']);
