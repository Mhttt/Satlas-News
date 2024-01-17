import httpTrigger from '../mediaarticles/index';
import { Context, HttpRequest } from '@azure/functions';
import * as typeorm_functions from 'typeorm/globals';
import ConnectionManager from '../database/ConnectionManager';
import { MediaArticle } from '../database/entities/MediaArticle.entity';

describe('Media Articles test', () => {
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
       find: jest.fn().mockImplementation(() => undefined),
       save: jest.fn().mockImplementation(),
       count: jest.fn().mockReturnValue(10),
       create: jest.fn().mockImplementation(() => {}),
       createQueryBuilder: jest.fn(() => ({
         offset: jest.fn().mockReturnThis(),
         limit: jest.fn().mockReturnThis(),
         where: jest.fn().mockReturnThis(),
         orderBy: jest.fn().mockReturnThis(),
         getManyAndCount: jest.fn().mockReturnValueOnce([[], 10]),
       })),
     };
    });
  });

  beforeEach(async () => {});

  it('Get all Media Articles', async () => {
    // Arrange
    req.method = 'GET';
    req.url = 'http://localhost:7071/api/MediaArticles';

    // Action
    await httpTrigger(context, req);

    // Assert
    expect(context.res).toBeDefined();
    expect(context.res!.status).toBe(200);
  });

  it('Get 3 Media Articles', async () => {
    // Arrange
    req.method = 'GET';
    req.url = 'http://localhost:7071/api/MediaArticles';
    req.query = { amount: '3' }

    // Action
    await httpTrigger(context, req);

    // Assert
    expect(context.res).toBeDefined();
    expect(context.res!.status).toBe(200);
  });

  it('Get all Media Articles with all sort types', async () => {
    // Arrange
    req.method = 'GET';
    req.url = 'http://localhost:7071/api/MediaArticles';

    for (const type of ['alphasc', 'alphdesc', 'dateasc', 'datedesc']) {
      req.query = {sortby: type}

      // Action
      await httpTrigger(context, req);

      // Assert
      expect(context.res).toBeDefined();
      expect(context.res!.status).toBe(200);
    }
  });

  it('Get Media Articles with Tornado in title', async () => {
    // Arrange
    req.method = 'GET';
    req.url = 'http://localhost:7071/api/MediaArticles';
    req.query = { search: 'Tornado' }

    // Action
    await httpTrigger(context, req);

    // Assert
    expect(context.res).toBeDefined();
    expect(context.res!.status).toBe(200);
  });

   it('Get Media Articles wwhere category is tornado', async () => {
     // Arrange
     req.method = 'GET';
     req.url = 'http://localhost:7071/api/MediaArticles?category=tornado';
     req.query = { category: 'tornado' }

     // Action
     await httpTrigger(context, req);

     // Assert
     expect(context.res).toBeDefined();
     expect(context.res!.status).toBe(200);
   });

   it('Get Media Articles where category is tornado, fire or flood', async () => {
     // Arrange
     req.method = 'GET';
     req.url = 'http://localhost:7071/api/MediaArticles?category=tornado,fire,flood';
     req.query = { category: 'tornado,fire,flood' }

     // Action
     await httpTrigger(context, req);

     // Assert
     expect(context.res).toBeDefined();
     expect(context.res!.status).toBe(200);
   });

  it('Post does not exist', async () => {
    // Arrange
    req.method = 'POST';
    req.body = {
      title: 'The new Article',
      url: 'https://www.dr.dk/',
      lat: 60,
      lon: 55,
      category: 'Flood',
      preview: 'Huge flood in North Sealand',
    } as Partial<MediaArticle>;

    // Mock that the post was already found
    jest.spyOn(typeorm_functions, 'getRepository').mockImplementation(() => {
      const original = jest.requireActual('typeorm');
      return {
        ...original,
        findOne: jest.fn().mockReturnValue(undefined ),
        create: jest.fn().mockReturnValue({}),
        save: jest.fn().mockImplementation(),
      };
    });

    // Action
    await httpTrigger(context, req);

    // Assertion
    expect(context.res).toBeDefined();
    expect(context.res!.status).toBe(200);
    expect(context.res!.body.message).toBe('New media article was created succesfully');
  });


  it('Post already exists', async () => {
    // Arrange
    req.method = 'POST';
    req.body = {
      title: 'The new Article',
      url: 'https://www.dr.dk/',
      lat: 60,
      lon: 55,
      category: 'Flood',
      preview: 'Huge flood in North Sealand',
    } as Partial<MediaArticle>;

    // Mock that the post was already found
    jest.spyOn(typeorm_functions, 'getRepository').mockImplementation(() => {
      const original = jest.requireActual('typeorm');
      return {
        ...original,
        findOne: jest.fn().mockReturnValue({ found: true }),
        save: jest.fn().mockImplementation(),
      };
    });
    // Action
    await httpTrigger(context, req);

    // Assertion
    expect(context.res).toBeDefined();
    expect(context.res!.status).toBe(400);
    expect(context.res!.body.message).toBe('This media article already exists');
  });

});
