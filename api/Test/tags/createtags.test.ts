import { Context, HttpRequest } from '@azure/functions';
import ConnectionManager from '../../database/ConnectionManager';
import * as typeorm_functions from 'typeorm/globals';
import httpTrigger from '../../tagspost/index';

describe('News articles test', () => {
  let context: Context;
  let req: HttpRequest;

  beforeAll(async () => {
    context = { log: jest.fn() } as unknown as Context;
    req = {
      query: {},
      body: {},
      method: 'POST',
      headers: {},
      params: {},
      url: 'http://localhost:7071/api/tags',
    };

    jest.spyOn(ConnectionManager, 'getConnection').mockImplementation();
  });

  beforeEach(async () => {});

  it('Sending request with invalid method returns 400', async () => {

    await httpTrigger(context, Object.assign({method: 'GET', req}));

    expect(context.res).toBeDefined();
    expect(context.res!.status).toBe(400);
    expect(context.res!.body.message).toBe('Method not allowed');
  });

  it('Creating a tag with no body returns 400', async () => {
    await httpTrigger(context, req);

    expect(context.res).toBeDefined();
    expect(context.res!.status).toBe(400);
    expect(context.res!.body.message).toBe('You must fill out all fields');
  });

  it('Creating a tag that already exists returns 400', async () => {
    jest.spyOn(typeorm_functions, 'getRepository').mockImplementation(() => {
      const original = jest.requireActual('typeorm');
      return {
        ...original,
        findOne: jest.fn().mockReturnValue({found: true}),
      };
    });

    req.body = {
      name: "tornado",
      icon: "Tornado"
    }

    await httpTrigger(context, req);

    expect(context.res).toBeDefined();
    expect(context.res!.status).toBe(400);
    expect(context.res!.body.message).toBe('Tag already exists with that name and icon');
  });

  it('Creating a tag that does not exist returns 200 and the tag', async () => {
    jest.spyOn(typeorm_functions, 'getRepository').mockImplementation(() => {
      const original = jest.requireActual('typeorm');
      return {
        ...original,
        findOne: jest.fn().mockReturnValue(null),
        save: jest.fn().mockReturnValue({
          id: 1,
          name: "tornado",
          icon: "Tornado"
        })
      };
    });

    req.body = {
      name: "tornado",
      icon: "Tornado"
    }

    await httpTrigger(context, req);

    expect(context.res).toBeDefined();
    expect(context.res!.status).toBe(200);
    expect(context.res!.body.message).toBe('Successfully created tag');
    expect(context.res!.body.tag!).toStrictEqual({
      id: 1,
      name: "tornado",
      icon: "Tornado"
    });
  });
});
