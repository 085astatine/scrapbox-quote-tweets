export type TweetID = string;

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
  decoded_url: string;
  title?: string;
  description?: string;
}

export interface TweetEntityMedia {
  type: 'media';
  text: string;
  media_key: string;
  media_type: 'animated_gif' | 'photo' | 'video' | string;
  url?: string;
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
  user: User;
}

export interface TweetEntityAnnotation {
  type: 'annotation';
  text: string;
  probability: number;
  annotation_type: string;
  normalized_text: string;
}

export type TweetEntity =
  | TweetEntityText
  | TweetEntityURL
  | TweetEntityMedia
  | TweetEntityHashtag
  | TweetEntityCashtag
  | TweetEntityMention;

export interface ReferencedTweet {
  type: 'retweeted' | 'quoted' | 'replied_to';
  id: TweetID;
}

export interface Tweet {
  id: TweetID;
  timestamp: number;
  author: User;
  text: TweetEntity[];
  annotations?: TweetEntityAnnotation[];
  referenced_tweets?: ReferencedTweet[];
}
