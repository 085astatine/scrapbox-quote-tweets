export interface TweetEntityText {
  type: 'text';
  text: string;
}

export interface TweetEntityURL {
  type: 'url';
  text: string;
}

export type TweetEntity = TweetEntityText | TweetEntityURL;

export interface Tweet {
  id: string;
  timestamp: number;
  text: TweetEntity[];
}
