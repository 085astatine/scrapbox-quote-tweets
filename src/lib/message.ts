import { TweetID } from './tweet';

export interface URLChangedMessage {
  type: 'URL/Changed';
}

export interface TweetCopyRequestMessage {
  type: 'TweetCopy/Request';
  tweetID: TweetID;
}

export interface TweetCopySuccessMessage {
  type: 'TweetCopy/Response';
  tweetID: TweetID;
  ok: true;
}

export interface TweetCopyFailureMessage {
  type: 'TweetCopy/Response';
  tweetID: TweetID;
  ok: false;
  message: string;
}

export type TweetCopyResponseMessage =
  | TweetCopySuccessMessage
  | TweetCopyFailureMessage;
