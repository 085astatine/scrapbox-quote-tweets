import type { Settings } from '../settings';
import type { TrashboxSort } from '../trashbox';
import type { DeletedTweetID, Tweet, TweetSort } from '../tweet/types';
import type { TweetIDKey } from './tweet-id-key';

export type Storage = {
  settings?: Settings;
  trashbox?: DeletedTweetID[];
  tweetSort?: TweetSort;
  trashboxSort?: TrashboxSort;
} & {
  [key in TweetIDKey]?: Tweet;
};
