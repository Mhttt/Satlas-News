import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { getRepository } from 'typeorm';
import { NewsArticle } from '../database/entities/NewsArticle.entity';
import SatlasRoute from "../helpers/SatlasRoute";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<any> {
  const repo = getRepository(NewsArticle);
  const { id }: { id?: number } = req.params;

  if (!id) {
    return  {
      status: 400,
      body: {
        message: 'Missing required ID field in body',
      },
    };
  }

  const exists = await repo.findOne({id});

  if (!exists) {
   return  {
      status: 404,
      body: {
        message: 'Article not found',
      },
    };
  }
  await repo.delete({id});

  return  {
    status: 200,
    body: {
      message: 'Article deleted',
    }
  };
};

export default SatlasRoute(httpTrigger, ['DELETE']);
