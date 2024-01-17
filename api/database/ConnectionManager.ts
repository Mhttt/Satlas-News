import { createConnection, getRepository } from 'typeorm';
import { MediaArticle } from './entities/MediaArticle.entity';
import { NewsArticle } from './entities/NewsArticle.entity';
import { Tag } from './entities/Tag.entity';
import { MediaArticles } from './seeds/MediaArticle';
import { NewsArticles } from './seeds/NewsArticle';
import { Tags } from './seeds/Tag';

/**
 * This is a util class that helps us manage our
 * connection, without having to do this manually
 * in each file.
 *
 * It is also responsible for seeding the database.
 */

const ConnectionManager = {
  getConnection: async () => {
    if (global.connection) {
      return global.connection;
    }

    global.connection = await createConnection({
      type: 'postgres',
      url: process.env.TYPE_ORM_CONNECTION_STRING,
      entities: [MediaArticle, NewsArticle, Tag],
      migrations: [],
      synchronize: false,
      logging: false,
      ssl:
        process.env.NODE_ENV === 'production'
          ? {
              ca: process.env.SSL_CERT,
            }
          : false,
    });

    // we only want to seed locally for dev
    if (process.env.NODE_ENV && process.env.NODE_ENV === 'development') {
      await getRepository(Tag).save(Tags);
      await getRepository(MediaArticle).save(MediaArticles);
      await getRepository(NewsArticle).save(NewsArticles);
    }

    return global.connection;
  },
};

export default ConnectionManager;
