import makeid from '../../helpers/randomString';
import { NewsArticle } from '../entities/NewsArticle.entity';
import { Tags } from './Tag';

export const NewsArticles: NewsArticle[] = [
  {
    previewImage:
      'https://images.pexels.com/photos/87651/earth-blue-planet-globe-planet-87651.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    shortdescription: 'The world is amazing',
    tags: [Tags[0]],
    title: 'The amazing world',
    url: `the-amazing-world@${makeid(5)}`.toLowerCase(),
    jsonRepresentation:
      '{"time":1653295851950,"blocks":[{"id":"9Lwi4IYMWa","type":"header","data":{"text":"TEST ARTICLE FROM SEED","level":3}},{"id":"SWQHqkHacq","type":"paragraph","data":{"text":"This is a test article from the local seed","alignment":"left"}}],"version":"2.24.2"}',
    lat: 56.3261,
    lon: 10.5683,
    icon: 'Fire',
  },

  {
    previewImage:
      'https://images.pexels.com/photos/87651/earth-blue-planet-globe-planet-87651.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    shortdescription: 'Just another Newsarticle',
    tags: [Tags[1]],
    title: 'Another Newsarticle',
    url: `another-newsarticle@${makeid(5)}`.toLowerCase(),
    jsonRepresentation:
      '{"time":1653295851950,"blocks":[{"id":"9Lwi4IYMWa","type":"header","data":{"text":"TEST ARTICLE FROM SEED","level":3}},{"id":"SWQHqkHacq","type":"paragraph","data":{"text":"This is a test article from the local seed","alignment":"left"}}],"version":"2.24.2"}',
    lat: 55.65953483574625,
    lon: 12.590981254051707,
    icon: 'Flood',
  },
];
