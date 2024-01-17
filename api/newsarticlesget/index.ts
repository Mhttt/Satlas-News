import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { getRepository, Repository } from 'typeorm';
import { NewsArticle } from '../database/entities/NewsArticle.entity';
import SatlasRoute from "../helpers/SatlasRoute";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<any> {
  const repo: Repository<NewsArticle> = getRepository(NewsArticle);

  if (req.method === 'GET') {
    let query = repo.createQueryBuilder('article');
    query.leftJoinAndSelect('article.tags', 'tags');

    // Search for articles with a similar title
    if (req.query.search) {
      // ILIKE is case INsensitive LIKE
      query.where('title ILIKE :search', { search: `%${req.query.search}%` });

      // Limit the amount of articles to return
      if (req.query.maxAmountOfResults) {
        query.limit(parseInt(req.query.maxAmountOfResults));
      }
    }

    // Get a specific article
    if (req.query.article) {
      query.where('article.url = :url', { url: req.query.article });
    }

    // Get all articles from these categories
    if (req.query.tags) {
      let tags = req.query.tags.toLowerCase().split(',');
      query.where('tags.name IN (:...tags)', {
        tags,
      });
    }

    if(req.query.sortby) {
      let sortMethod = req.query.sortby;

      if(sortMethod === 'alphasc'){
        query.orderBy('article.title', 'ASC')
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

    // Pagination
    let skipAmount = 0;

    if (req.query.amount) {
      if (req.query.skip) {
        skipAmount = parseInt(req.query.skip);
      }

      query.skip(skipAmount);
      query.take(parseInt(req.query.amount));
    }

    const [response, totalAmount] = await query.getManyAndCount();

    return {
      status: 200,
      body: {
        totalAmount,
        articles: response,
      },
    };
  }
};

export default SatlasRoute(httpTrigger, ['GET']);
