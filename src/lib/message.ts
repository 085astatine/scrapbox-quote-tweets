import { TweetID } from './tweet';

export interface URLChangedMessage {
  type: 'url_changed';
}

export interface TweetCopyRequestMessage {
  type: 'tweet_copy_request';
  tweetID: TweetID;
}

export interface TweetCopySuccessMessage {
  type: 'tweet_copy_response';
  tweetID: TweetID;
  ok: true;
}

export interface TweetCopyFailureMessage {
  type: 'tweet_copy_response';
  tweetID: TweetID;
  ok: false;
  message: string;
}

export type TweetCopyResponseMessage =
  | TweetCopySuccessMessage
  | TweetCopyFailureMessage;
