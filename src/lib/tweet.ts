export interface User {
  id: string;
  name: string;
  username: string;
}

export interface TweetEntityText {
  type: 'text';
  text: string;
}

export interface TweetEntityURL {
  type: 'url';
  text: string;
  url: string;
  display_url: string;
  title?: string;
  description?: string;
}

export interface TweetEntityMedia {
  type: 'media';
  text: string;
  media_type: 'animated_gif' | 'photo' | 'video' | string;
  url: string;
}

export interface TweetEntityHashtag {
  type: 'hashtag';
  text: string;
  tag: string;
}

export interface TweetEntityCashtag {
  type: 'cashtag';
  text: string;
  tag: string;
}

export type TweetEntity =
  | TweetEntityText
  | TweetEntityURL
  | TweetEntityMedia
  | TweetEntityHashtag
  | TweetEntityCashtag;

export interface Tweet {
  id: string;
  timestamp: number;
  author: User;
  text: TweetEntity[];
}
