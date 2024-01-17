import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { getRepository, Repository } from 'typeorm';
import { Tag } from '../database/entities/Tag.entity';
import SatlasRoute from "../helpers/SatlasRoute";

const httpTrigger: AzureFunction = async function (context: Context,req: HttpRequest): Promise<any> {
  let { name, icon }: Partial<Tag> = req.body;

  if (!name || !icon) {
    return {
      status: 400,
      body: {
        message: 'You must fill out all fields',
      },
    };
  }

  name = name.toLowerCase();

  const repo: Repository<Tag> = getRepository(Tag);

  let tag = await repo.findOne({ name, icon })

  if (tag) {
    return {
      status: 400,
      body: {
        message: 'Tag already exists with that name and icon',
      }
    };

  }

  tag = await repo.save({ name, icon });

  return {
    status: 200,
    body: {
      message: 'Successfully created tag',
      tag,
    }
  };
};

export default SatlasRoute(httpTrigger, ['POST']);
