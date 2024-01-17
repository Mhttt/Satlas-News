import httpTrigger from '../../newsarticleput';
import { Context, HttpRequest } from '@azure/functions';
import * as typeorm_functions from 'typeorm/globals';
import ConnectionManager from '../../database/ConnectionManager';
import { NewsArticle } from '../../database/entities/NewsArticle.entity';

describe('Update posts test', () => {
  let context: Context;
  let req: HttpRequest;

  beforeAll(async () => {
    context = { log: jest.fn() } as unknown as Context;
    req = {
      query: {},
      body: {},
      method: 'PUT',
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
        findOne: jest.fn().mockReturnValue({
          found: true,
        }),
        save: jest.fn().mockImplementation(),
      };
    });
  });

  beforeEach(async () => {});

  it('Update a post returns 200', async () => {
    // Arrange
    req.body = {
      formData: {
        title: 'THIS IS UPDATEED POST',
        shortdescription: 'THIS IA  NEW DESCRIPTION',
        image: 'http://updated.com',
        tags: 'lets,update',
        content: 'This is my new content',
      },
      articleURL: 'this-is-post-url@random-string',
    } as Partial<NewsArticle>;

    // Action
    await httpTrigger(context, req);

    // Assertion
    expect(context.res).toBeDefined();
    expect(context.res!.status).toBe(200);
    expect(context.res!.body.message).toBe('Successfully updated');
  });

  it('Update post returns 400', async () => {
    // Arrange
    req.body = {
      title: 'The new post',
      shortdescription: 'This is a short description',
      image: 'http://google.com',
      tags: [],
    } as Partial<NewsArticle>;

    // Action
    await httpTrigger(context, req);

    // Assertion
    expect(context.res).toBeDefined();
    expect(context.res!.status).toBe(400);
    expect(context.res!.body.message).toBe('You must fill out all fields');
  });

  it('Post does not exists', async () => {
    // Arrange
    req.body = {
      formData: {
        title: 'THIS IS UPDATEED POST',
        shortdescription: 'THIS IA  NEW DESCRIPTION',
        image: 'http://updated.com',
        tags: 'lets,update',
        content: 'This is my new content',
      },
      articleURL: 'this-is-post-url@random-string',
    } as Partial<NewsArticle>;

    // Mock that the post was already found
    jest.spyOn(typeorm_functions, 'getRepository').mockImplementation(() => {
      const original = jest.requireActual('typeorm');
      return {
        ...original,
        findOne: jest.fn().mockImplementation(),
        save: jest.fn().mockImplementation(),
      };
    });
    // Action
    await httpTrigger(context, req);

    // Assertion
    expect(context.res).toBeDefined();
    expect(context.res!.status).toBe(404);
    expect(context.res!.body.message).toBe('Post with that ID not found');
  });
});
