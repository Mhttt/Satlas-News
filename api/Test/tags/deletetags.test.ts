import { Context, HttpRequest, HttpRequestParams } from '@azure/functions';
import * as typeorm_functions from 'typeorm/globals';
import ConnectionManager from '../../database/ConnectionManager';
import { Tag } from '../../database/entities/Tag.entity';
import httpTrigger from '../../tagsdelete/index';


describe('Create Delete test', () => {
  let context: Context;
  let req: HttpRequest;

  beforeAll(async () => {
    context = { log: jest.fn() } as unknown as Context;
    req = {
      query: {},
      body: {},
      method: 'DELETE',
      headers: {},
      params: {},
      url: '',
    };

    // mock the connection
    jest.spyOn(ConnectionManager, 'getConnection').mockImplementation();

    // Mock everything related to database really
    jest.spyOn(typeorm_functions, 'getRepository').mockImplementation((repo) => {      
      const original = jest.requireActual('typeorm');

      return {
        ...original,
        findOne: jest.fn().mockImplementation(() => undefined),
        delete: jest.fn().mockImplementation(),
        createQueryBuilder: jest.fn().mockImplementation(() => ({
          leftJoinAndSelect: jest.fn().mockImplementation(() => {}),
          where: jest.fn().mockImplementation(() => {}),
          getMany: jest.fn().mockImplementation(() => [[], 10]),
        })),
      };
    });
  });

  beforeEach(async () => {});

  it('Deleting a post that does not exist returns 404', async () => {
    // Arrange
    req.params = {
      id: 2,
    } as unknown as HttpRequestParams;

    // Action
    await httpTrigger(context, req);

    // Assertion
    expect(context.res).toBeDefined();
    expect(context.res!.status).toBe(404);
    expect(context.res!.body.message).toBe('Tag not found');
  });

  it('Deleting a post with no ID param returns 400', async () => {
    // Arrange
    req.params = {} as unknown as HttpRequestParams;

    // Action
    await httpTrigger(context, req);

    // Assertion
    expect(context.res).toBeDefined();
    expect(context.res!.status).toBe(400);
    expect(context.res!.body.message).toBe('Missing required ID field in URL');
  });
});
