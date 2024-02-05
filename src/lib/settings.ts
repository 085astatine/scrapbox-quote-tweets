import { defaultTimezone } from './datetime';
import { DeletedTweetsSort, TweetSort } from './tweet/types';

export const hostnames = ['twitter.com', 'x.com'] as const;

export type Hostname = (typeof hostnames)[number];

export interface Settings {
  hostname: Hostname;
  timezone: string;
  datetimeFormat: string;
  tweetSort: TweetSort;
  deletedTweetsSort: DeletedTweetsSort;
}

export const defaultSettings = (): Settings => {
  return {
    hostname: 'twitter.com',
    timezone: defaultTimezone(),
    datetimeFormat: 'YYYY/MM/DD HH:mm:ss',
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

export const isHostname = (value: string): value is Hostname => {
  return (hostnames as ReadonlyArray<string>).includes(value);
};
