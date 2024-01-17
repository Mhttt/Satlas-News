import httpTrigger from '../../newsarticlespost';
import { Context, HttpRequest } from '@azure/functions';
import * as typeorm_functions from 'typeorm/globals';
import ConnectionManager from '../../database/ConnectionManager';
import { NewsArticle } from '../../database/entities/NewsArticle.entity';

describe('Create Post test', () => {
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
        save: jest.fn().mockReturnValue({ id: 2 }),
      };
    });
  });

  beforeEach(async () => {});

  it('Creates a post returns 200', async () => {
    // Arrange
    req.method = 'POST';
    req.body = {
      icon: 'Tornado',
      jsonRepresentation: '{}',
      lat: 4,
      lon: 4,
      shortdescription: 'short description',
      tags: [],
      title: 'test',
      images: [],
    } as Partial<NewsArticle>;

    // Action
    await httpTrigger(context, req);
    // Assertion
    expect(context.res).toBeDefined();
    expect(context.res!.status).toBe(200);
    expect(context.res!.body.message).toBe('Successfully posted');
  });

  it('Creates a post returns 400', async () => {
    // Arrange
    req.method = 'POST';
    req.body = {
      icon: 'flood',
      jsonRepresentation: '{}',
      lat: 4,
      lon: 4,
      shortdescription: 'short description',
      tags: [],
    } as Partial<NewsArticle>;

    // Action
    await httpTrigger(context, req);

    // Assertion
    expect(context.res).toBeDefined();
    expect(context.res!.status).toBe(400);
    expect(context.res!.body.message).toBe('You must fill out all fields');
  });

  it('Create post with GET', async () => {
    // Arrange
    req.method = 'GET';

    // Action
    await httpTrigger(context, req);

    // Assertion
    expect(context.res).toBeDefined();
    expect(context.res!.status).toBe(400);
    expect(context.res!.body.message).toBe('Method not allowed');
  });

  it('Post already exists', async () => {
    // Arrange
    req.method = 'POST';
    req.body = {
      icon: 'flood',
      jsonRepresentation: '{}',
      lat: 4,
      lon: 4,
      shortdescription: 'short description',
      tags: [],
      title: 'test',
      images: [],
    } as Partial<NewsArticle>;

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
    expect(context.res!.body.message).toBe(
      'Post with that title already exists'
    );
  });
});
