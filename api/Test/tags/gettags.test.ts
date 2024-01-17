import { Context, HttpRequest } from '@azure/functions';
import ConnectionManager from '../../database/ConnectionManager';
import * as typeorm_functions from 'typeorm/globals';
import httpTrigger from '../../tagsget/index';

describe('News articles test', () => {
  let context: Context;
  let req: HttpRequest;

  beforeAll(async () => {
    context = { log: jest.fn() } as unknown as Context;
    req = {
      query: {},
      body: {},
      method: 'GET',
      headers: {},
      params: {},
      url: 'http://localhost:7071/api/tags',
    };

    // mock the connection
    jest.spyOn(ConnectionManager, 'getConnection').mockImplementation();

    // Mock everything related to database really
    jest.spyOn(typeorm_functions, 'getRepository').mockImplementation(() => {
      const original = jest.requireActual('typeorm');
      return {
        ...original,
        find: jest.fn().mockReturnValue([]),
      };
    });
  });

  beforeEach(async () => {});

  it('Get an empty list when no tags have been added', async () => {
    // Action
    await httpTrigger(context, req);

    // Assert
    expect(context.res).toBeDefined();
    expect(context.res!.status).toBe(200);
    expect(context.res!.body.tags).toBeDefined();
    expect(context.res!.body.tags).toStrictEqual([]);
  });

  it('Get two tags when two tags are present in the DB', async () => {
    jest.spyOn(typeorm_functions, 'getRepository').mockImplementation(() => {
      const original = jest.requireActual('typeorm');
      return {
        ...original,
        find: jest.fn().mockReturnValue([
          {
            id: 1,
            name: "tornado",
            icon: "Tornado",
          },
          {
            id: 2,
            name: "flood",
            icon: "Waves",
          },
        ]),
      };
    });


    // Action
    await httpTrigger(context, req);

    // Assert
    expect(context.res).toBeDefined();
    expect(context.res!.status).toBe(200);
    expect(context.res!.body.tags).toBeDefined();
    expect(context.res!.body.tags).toStrictEqual(
      [
        {
          id: 1,
          name: "tornado",
          icon: "Tornado",
        },
        {
          id: 2,
          name: "flood",
          icon: "Waves",
        }
      ]
    );
  });
});
