import makeid from '../../helpers/randomString';
import { MediaArticle } from '../entities/MediaArticle.entity';

export const MediaArticles: MediaArticle[] = [
  {
    category: 'flood',
    lat: 55.882519,
    lon: 12.198778,
    preview: 'A flood has happened in northen Copenhagen!',
    title: 'Catastrophic Flood!',
    url: `catastrophic-flood@${makeid(5)}`.toLowerCase(),
  },
  {
    category: 'tornado',
    lat: 55.661411,
    lon: 12.592203,
    preview: 'A big tornado is raging in Aarhus!',
    title: 'Catastrophic Tornado!',
    url: `catastrophic-flood@${makeid(5)}`.toLowerCase(),
  },
  {
    category: 'fire',
    lat: 55.102519,
    lon: 12.108778,
    preview: 'A fire has happened in northen Copenhagen!',
    title: 'Catastrophic Fire!',
    url: `catastrophic-flood@${makeid(5)}`.toLowerCase(),
  },
];
