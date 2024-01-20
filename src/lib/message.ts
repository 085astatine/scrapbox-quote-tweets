import { Tweet, TweetID } from './tweet/tweet';

export interface ClipboardOpenRequestMessage {
  type: 'Clipboard/OpenRequest';
}

export interface ClipboardCloseRequestMessage {
  type: 'Clipboard/CloseRequest';
}

export interface ClipboardCloseAllRequestMessage {
  type: 'Clipboard/CloseAllRequest';
}

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

export interface ForwardToOffscreenMessage<Message> {
  type: 'Forward/ToOffscreen';
  message: Message;
}

export interface TweetSaveRequestMessage {
  type: 'Tweet/SaveRequest';
  tweet: Tweet;
}

export interface TweetSaveResponseSuccessMessage {
  type: 'Tweet/SaveResponse';
  ok: true;
  tweetID: TweetID;
}

export interface TweetSaveResponseFailureMessage {
  type: 'Tweet/SaveResponse';
  ok: false;
  tweetID: TweetID;
  error: string;
}

export type TweetSaveResponseMessage =
  | TweetSaveResponseSuccessMessage
  | TweetSaveResponseFailureMessage;

export interface TweetSaveReportMessage {
  type: 'Tweet/SaveReport';
  tweetID: TweetID;
}

export interface SettingsDownloadStorageMessage {
  type: 'Settings/DownloadStorage';
}
