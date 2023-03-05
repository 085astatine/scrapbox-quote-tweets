import { logger } from './logger';
import { Tweet } from './tweet';

export const tweetToString = (tweet: Tweet, template: string): string => {
  logger.debug('tweet to string', tweet, template);
  return '';
};
