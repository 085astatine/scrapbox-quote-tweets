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
  decoded_url: string;
  title?: string;
}

export interface TweetEntityHashtag {
  type: 'hashtag';
  text: string;
  tag: string;
  hashmoji?: string;
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

export interface CardLink {
  url: string;
  expanded_url: string;
  decoded_url: string;
  title?: string;
}

export interface CardSingle {
  type: 'single';
  link?: CardLink;
  media_url: string;
}

export interface CardCarousel {
  type: 'carousel';
  link?: CardLink;
  media_urls: string[];
}

export type Card = CardSingle | CardCarousel;

export interface Tweet {
  id: TweetID;
  created_at: number;
  author: User;
  text: TweetEntity[];
  card?: Card;
  media?: Media[];
}
