import { TweetID } from '../tweet';

export { ClipboardWindows, setupClipboardWindows } from './windows';

export interface TrashboxRecord {
  timestamp: number;
  tweetIDs: TweetID[];
}
