import { logger } from './logger';
import { Tweet } from './tweet';

export const tweetToString = (tweet: Tweet, template: string): string => {
  logger.debug('tweet to string', tweet, template);
  return '';
};

type TweetField =
  | 'tweet.id'
  | 'tweet.timestamp'
  | 'user.id'
  | 'user.name'
  | 'user.username';

const tweetFields: readonly TweetField[] = [
  'tweet.id',
  'tweet.timestamp',
  'user.id',
  'user.name',
  'user.username',
];
