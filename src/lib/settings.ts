import { DeletedTweetsSort, TweetSort } from '~/lib/tweet/sort-tweets';

export type Hostname = 'twitter.com' | 'x.com';

export interface Settings {
  hostname: Hostname;
  tweetSort: TweetSort;
  deletedTweetsSort: DeletedTweetsSort;
}

export const baseURL = (hostname: string): string => {
  return `https://${hostname}`;
};
