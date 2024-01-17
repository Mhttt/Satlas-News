import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { getRepository, Repository } from 'typeorm';
import { NewsArticle } from '../database/entities/NewsArticle.entity';
import { Tag } from '../database/entities/Tag.entity';
import SatlasRoute from '../helpers/SatlasRoute';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<any> {
  const repo = getRepository(Tag);
  const { id }: { id?: number } = req.params;

  if (!id) {
    return {
      status: 400,
      body: {
        message: 'Missing required ID field in URL',
      },
    };
  }

  const exists = await repo.findOne({id});  

  if (!exists) {
   return {
      status: 404,
      body: {
        message: 'Tag not found',
      },
    };
  }

  const query = getRepository(NewsArticle)
    .createQueryBuilder('article')
    .leftJoinAndSelect('article.tags', 'tags')
    .where(`tags.id = ${id}`);

  const articles = await query.getMany();

  if (articles.length) {

    console.log(articles);
    return {
        status: 405,
        body: {
          message: 'Tag is already bound to articles. You need to remove them from the articles before deleting it.',
          articles: articles.map(article => ({title: article.title, id: article.id}))
        }
    }
  }

  await repo.delete({id});

  return {
    status: 200,
    body: {
      message: 'Tag deleted',
    }
  };
};

export default SatlasRoute(httpTrigger, ['DELETE']);
