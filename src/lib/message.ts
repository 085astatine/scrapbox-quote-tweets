export interface URLChangedMessage {
  type: 'url_changed';
}

export interface TweetCopyRequestMessage {
  type: 'tweet_copy_request';
  tweetID: string;
}

export interface TweetCopySuccessMessage {
  type: 'tweet_copy_response';
  tweetID: string;
  ok: true;
}

export interface TweetCopyFailureMessage {
  type: 'tweet_copy_response';
  tweetID: string;
  ok: false;
  message: string;
}

export type TweetCopyResponseMessage =
  | TweetCopySuccessMessage
  | TweetCopyFailureMessage;
