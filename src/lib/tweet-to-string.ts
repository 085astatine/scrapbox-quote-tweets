import { logger } from './logger';
import { Tweet } from './tweet';
import { TweetTemplate, parseTweetTemplate } from './tweet-template';

export const tweetToString = (
  tweet: Tweet,
  template: TweetTemplate
): string => {
  logger.debug('tweet to string', tweet, parseTweetTemplate(template));
  return '';
};
