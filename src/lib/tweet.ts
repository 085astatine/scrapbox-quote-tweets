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

export type TweetEntity = TweetEntityText | TweetEntityURL | TweetEntityMedia;

export interface Tweet {
  id: string;
  timestamp: number;
  text: TweetEntity[];
}
