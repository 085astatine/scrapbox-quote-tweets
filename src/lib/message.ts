import { TweetID } from './tweet';

export interface ClipboardOpenRequestMessage {
  type: 'Clipboard/OpenRequest';
}

export interface ClipboardCloseRequestMessage {
  type: 'Clipboard/CloseRequest';
}

export interface TweetCopyRequestMessage {
  type: 'TweetCopy/Request';
  tweetID: TweetID;
}

export interface TweetCopySuccessMessage {
  type: 'TweetCopy/Response';
  ok: true;
  tweetIDs: TweetID[];
}

export interface TweetCopyFailureMessage {
  type: 'TweetCopy/Response';
  ok: false;
  tweetIDs: TweetID[];
  message: string;
}

export type TweetCopyResponseMessage =
  | TweetCopySuccessMessage
  | TweetCopyFailureMessage;
