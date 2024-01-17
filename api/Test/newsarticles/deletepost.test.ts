import httpTrigger from '../../newsarticlesdelete';
import { Context, HttpRequest, HttpRequestParams } from '@azure/functions';
import * as typeorm_functions from 'typeorm/globals';
import ConnectionManager from '../../database/ConnectionManager';
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
    await jest.spyOn(ConnectionManager, 'getConnection').mockImplementation();

    // Mock everything related to database really
    jest.spyOn(typeorm_functions, 'getRepository').mockImplementation(() => {
      const original = jest.requireActual('typeorm');
      return {
        ...original,
        findOne: jest.fn().mockImplementation(() => undefined),
        save: jest.fn().mockImplementation(),
      };
    });
  });

  beforeEach(async () => {});

  it('Deleting a post that does not exist returns 404', async () => {
    // Arrange
    req.method = 'DELETE';
    req.params = {
      id: 2,
    } as unknown as HttpRequestParams;

    // Action
    await httpTrigger(context, req);

    // Assertion
    expect(context.res).toBeDefined();
    expect(context.res!.status).toBe(404);
    expect(context.res!.body.message).toBe('Article not found');
  });

  it('Deleting a post with no ID param returns 400', async () => {
    // Arrange
    req.method = 'DELETE';
    req.params = {} as unknown as HttpRequestParams;

    // Action
    await httpTrigger(context, req);

    // Assertion
    expect(context.res).toBeDefined();
    expect(context.res!.status).toBe(400);
    expect(context.res!.body.message).toBe('Missing required ID field in body');
  });

  it('Deleting a post actually deletes it', async () => {
    // Arrange
    req.method = 'DELETE';
    req.params = {
      id: 1,
    } as unknown as HttpRequestParams;

    // Mock DB
    jest.spyOn(typeorm_functions, 'getRepository').mockImplementation(() => {
      const original = jest.requireActual('typeorm');
      return {
        ...original,
        findOne: jest.fn().mockReturnValue({ found: true }),
        save: jest.fn().mockImplementation(),
        delete: jest.fn().mockImplementation(),
      };
    });

    // Action
    await httpTrigger(context, req);

    // Assertion
    expect(context.res).toBeDefined();
    expect(context.res!.status).toBe(200);
    expect(context.res!.body.message).toBe('Article deleted');
  });
});
