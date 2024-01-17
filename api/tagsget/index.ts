import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { getRepository, Repository } from 'typeorm';
import { Tag } from '../database/entities/Tag.entity';
import SatlasRoute from '../helpers/SatlasRoute';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<any> {
  const repo: Repository<Tag> = getRepository(Tag);

  return {
    status: 200,
    body: {
      tags: await repo.find({})
    }
  };
};

export default SatlasRoute(httpTrigger, ['GET']);
