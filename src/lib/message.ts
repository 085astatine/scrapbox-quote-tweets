import { TweetID } from './tweet';

export interface ClipboardOpenRequestMessage {
  type: 'Clipboard/OpenRequest';
}

export interface ClipboardCloseRequestMessage {
  type: 'Clipboard/CloseRequest';
}

export interface ClipboardCloseAllRequestMessage {
  type: 'Clipboard/CloseAllRequest';
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

export interface ExpandTCoURLRequestMessage {
  type: 'ExpandTCoURL/Request';
  shortURL: string;
}

export interface ExpandTCoURLSuccessMessage {
  type: 'ExpandTCoURL/Response';
  ok: true;
  shortURL: string;
  expandedURL: string;
  title?: string;
}

export interface ExpandTCoURLFailureMessage {
  type: 'ExpandTCoURL/Response';
  ok: false;
  shortURL: string;
}

export type ExpandTCoURLResponseMessage =
  | ExpandTCoURLSuccessMessage
  | ExpandTCoURLFailureMessage;
