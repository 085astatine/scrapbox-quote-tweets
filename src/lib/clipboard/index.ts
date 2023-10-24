import { Tweet, TweetID } from '../tweet';

export { ClipboardWindows, setupClipboardWindows } from './windows';

export interface TrashboxElement {
  timestamp: number;
  tweets: Tweet[];
}

export interface TrashboxRecord {
  timestamp: number;
  tweetIDs: TweetID[];
}
