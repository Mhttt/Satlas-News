import { Context, HttpRequest } from '@azure/functions';
import ConnectionManager from '../../database/ConnectionManager';
import * as typeorm_functions from 'typeorm/globals';
import httpTrigger from '../../newsarticlesget';

describe('News articles test', () => {
  let context: Context;
  let req: HttpRequest;

  beforeAll(async () => {
    const mock = jest.fn();

    context = { log: mock } as unknown as Context;
    req = {
      query: {},
      body: {},
      method: 'GET',
      headers: {},
      params: {},
      url: '',
    };

    // mock the connection
    jest.spyOn(ConnectionManager, 'getConnection').mockImplementation();

    // Mock everything related to database really
    jest.spyOn(typeorm_functions, 'getRepository').mockImplementation(() => {
      const original = jest.requireActual('typeorm');
      return {
        ...original,
        findOne: mock.mockImplementation(() => undefined),
        find: mock.mockImplementation(() => undefined),
        save: mock.mockImplementation(),
        count: mock.mockReturnValue(10),
        createQueryBuilder: mock.mockImplementation(() => ({
          offset: mock.mockImplementation(() => {}),
          limit: mock.mockImplementation(() => {}),
          leftJoinAndSelect: mock.mockImplementation(() => {}),
          orderBy: mock.mockImplementation(() => {}),
          where: mock.mockImplementation(() => {}),
          skip: mock.mockImplementation(() => {}),
          take: mock.mockImplementation(() => {}),
          getManyAndCount: mock.mockImplementation(() => [[], 10]),
        })),
      };
    });
  });



  beforeEach(async () => {});

  it('Get all news articles', async () => {

    // Arrange
    req.url = 'http://localhost:7071/api/newsarticles';

    // Action
    await httpTrigger(context, req);

    // Assert
    expect(context.res).toBeDefined();
    expect(context.res!.status).toBe(200);
    expect(context.res!.body.totalAmount).toBeDefined();
    expect(context.res!.body.totalAmount).toBe(10);
  });

  it('Get 5 news articles', async () => {
    // Arrange
    req.url = 'http://localhost:7071/api/newsarticles';
    req.query = { amount: '5', skip: '5' }

    // Action
    await httpTrigger(context, req);

    // Assert
    expect(context.res).toBeDefined();
    expect(context.res!.status).toBe(200);
    expect(context.res!.body.totalAmount).toBeDefined();
    expect(context.res!.body.totalAmount).toBe(10);
  });

  it('Get 3 news articles, when skipping the first 5', async () => {
    // Arrange
    req.url = 'http://localhost:7071/api/newsarticles';
    req.query = { amount: '3', skip: '5' }

    // Action
    await httpTrigger(context, req);

    // Assert
    expect(context.res).toBeDefined();
    expect(context.res!.status).toBe(200);
    expect(context.res!.body.totalAmount).toBeDefined();
    expect(context.res!.body.totalAmount).toBe(10);
  });

  it('Get news articles where tag and icon is flood', async () => {
    // Arrange
    req.url = 'http://localhost:7071/api/newsarticles';
    req.query = { tags: 'flood' }

    // Action
    await httpTrigger(context, req);

    // Assert
    expect(context.res).toBeDefined();
    expect(context.res!.status).toBe(200);
    expect(context.res!.body.totalAmount).toBeDefined();
    expect(context.res!.body.totalAmount).toBe(10);
  });

  it('Get news articles where tags is flood, fire or tornado', async () => {
    // Arrange
    req.url = 'http://localhost:7071/api/newsarticles';
    req.query = { tags: 'flood,fire,tornado' }

    // Action
    await httpTrigger(context, req);

    // Assert
    expect(context.res).toBeDefined();
    expect(context.res!.status).toBe(200);
    expect(context.res!.body.totalAmount).toBeDefined();
    expect(context.res!.body.totalAmount).toBe(10);
  });

   it('Get news articles sorted from A-Z', async () => {
     // Arrange
     req.url = `http://localhost:7071/api/newsarticles`;

     for (const type of ['alphasc', 'alphdesc', 'dateasc', 'datedesc']) {
       req.query = { sortby: type }

       // Action
       await httpTrigger(context, req);

       // Assert
       expect(context.res).toBeDefined();
       expect(context.res!.status).toBe(200);
       expect(context.res!.body.totalAmount).toBeDefined();
       expect(context.res!.body.totalAmount).toBe(10);
     }
   })
});
