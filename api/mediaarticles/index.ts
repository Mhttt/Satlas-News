import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { getRepository, Repository } from 'typeorm';
import { MediaArticle } from '../database/entities/MediaArticle.entity';
import SatlasRoute from "../helpers/SatlasRoute";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<any> {
  const repo: Repository<MediaArticle> = getRepository(MediaArticle);

  // Get all or specify with amount query
  if (req.method === 'GET') {
    let query = repo.createQueryBuilder('article');

    if (req.query.search) {
      query.where('title ILIKE :search', { search: `%${req.query.search}%` });
    }

    if (req.query.category) {
      let categories = req.query.category.toLowerCase().split(',');
      query.where('article.category IN (:...categories)', {
        categories,
      });
    }

    if (req.query.sortby) {
      let sortMethod = req.query.sortby;

      if (sortMethod === 'alphasc') {
        query.orderBy('article.title', 'ASC');
      }
      else if (sortMethod === 'alphdesc') {
        query.orderBy('article.title', 'DESC');
      }
      else if (sortMethod === 'dateasc') {
        query.orderBy('article.timestamp', 'ASC');
      }
      else if (sortMethod === 'datedesc') {
        query.orderBy('article.timestamp', 'DESC');
      }
    }

    const [response] = await query.getManyAndCount();

    return { status: 200, body: response };
  }
  else if (req.method === 'POST') {
    const { title, url, lat, lon, preview, category }: Partial<MediaArticle> =
      req.body;

    if (title && url && lat && lon && preview && category) {
      const exists = await repo.findOne({ url: url });

      if (exists) {
        return  {
          status: 400,
          body: {
            message: 'This media article already exists',
          },
        };
      }

      const newArticle = await repo.create({ title, url, lat, lon, preview, category });
      await repo.save(newArticle);

      return  {
        status: 200,
        body: {
          message: 'New media article was created succesfully',
        },
      };
    }
  }
};

export default SatlasRoute(httpTrigger, ['GET', 'POST']);
