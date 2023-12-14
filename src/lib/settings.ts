import { DeletedTweetsSort, TweetSort } from '~/lib/tweet/sort-tweets';

export type Hostname = 'twitter.com' | 'x.com';

export interface Settings {
  hostname: Hostname;
  tweetSort: TweetSort;
  deletedTweetsSort: DeletedTweetsSort;
}

export const defaultSettings = {
  hostname: 'twitter.com',
  tweetSort: {
    key: 'created_time',
    order: 'desc',
  },
  deletedTweetsSort: {
    key: 'deleted_time',
    order: 'desc',
  },
} as const satisfies Settings;

export const baseURL = (hostname: string): string => {
  return `https://${hostname}`;
};
