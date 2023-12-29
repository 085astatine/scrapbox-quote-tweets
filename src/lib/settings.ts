import { defaultTimezone } from './datetime';
import { DeletedTweetsSort, TweetSort } from './tweet/sort-tweets';

export const hostnames = ['twitter.com', 'x.com'] as const;

export type Hostname = (typeof hostnames)[number];

export interface Settings {
  hostname: Hostname;
  timezone: string;
  tweetSort: TweetSort;
  deletedTweetsSort: DeletedTweetsSort;
}

export const defaultSettings = (): Settings => {
  return {
    hostname: 'twitter.com',
    timezone: defaultTimezone(),
    tweetSort: {
      key: 'created_time',
      order: 'desc',
    },
    deletedTweetsSort: {
      key: 'deleted_time',
      order: 'desc',
    },
  };
};

export const baseURL = (hostname: string): string => {
  return `https://${hostname}`;
};
