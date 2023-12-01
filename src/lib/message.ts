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

export interface SaveTweetRequestMessage {
  type: 'SaveTweet/Request';
  tweet: Tweet;
}

export interface SaveTweetResponseSuccessMessage {
  type: 'SaveTweet/Response';
  ok: true;
  tweetID: TweetID;
}

export interface SaveTweetResponseFailureMessage {
  type: 'SaveTweet/Response';
  ok: false;
  tweetID: TweetID;
  error: string;
}

export type SaveTweetResponseMessage =
  | SaveTweetResponseSuccessMessage
  | SaveTweetResponseFailureMessage;

export interface SaveTweetReportMessage {
  type: 'SaveTweet/Report';
  tweetID: TweetID;
}

export interface SettingsDownloadStorageMessage {
  type: 'Settings/DownloadStorage';
}
