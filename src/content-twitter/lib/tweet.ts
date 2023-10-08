export type TweetID = string;

export interface User {
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
  short_url: string;
  expanded_url: string;
  title?: string;
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

export interface TweetEntityMention {
  type: 'mention';
  text: string;
  username: string;
}

export type TweetEntity =
  | TweetEntityText
  | TweetEntityURL
  | TweetEntityHashtag
  | TweetEntityCashtag
  | TweetEntityMention;

export interface MediaPhoto {
  type: 'photo';
  url: string;
}

export interface MediaVideo {
  type: 'video';
  thumbnail: string;
}

export type Media = MediaPhoto | MediaVideo;

export interface Card {
  link_url: string;
  image_url: string;
}

export interface Tweet {
  id: TweetID;
  timestamp: number;
  author: User;
  text: TweetEntity[];
  card?: Card;
  media?: Media[];
}
