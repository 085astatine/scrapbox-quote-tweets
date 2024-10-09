export type TweetID = string;

export type User = {
  name: string;
  username: string;
};

export type TweetEntityText = {
  type: 'text';
  text: string;
};

export type TweetEntityURL = {
  type: 'url';
  text: string;
  short_url: string;
  expanded_url: string;
  decoded_url: string;
  title?: string;
};

export type TweetEntityHashtag = {
  type: 'hashtag';
  text: string;
  tag: string;
  hashmoji?: string;
};

export type TweetEntityCashtag = {
  type: 'cashtag';
  text: string;
  tag: string;
};

export type TweetEntityMention = {
  type: 'mention';
  text: string;
  username: string;
};

export type TweetEntity =
  | TweetEntityText
  | TweetEntityURL
  | TweetEntityHashtag
  | TweetEntityCashtag
  | TweetEntityMention;

export type MediaPhoto = {
  type: 'photo';
  url: string;
};

export type MediaVideo = {
  type: 'video';
  thumbnail: string;
};

export type Media = MediaPhoto | MediaVideo;

export type Tweet = {
  id: TweetID;
  created_at: number;
  saved_at: number;
  author: User;
  text: TweetEntity[];
  media?: Media[];
};

export type DeletedTweetID = {
  deleted_at: number;
  tweet_id: TweetID;
};

export type DeletedTweet = {
  deleted_at: number;
  tweet: Tweet;
};

export type TweetSortKey = 'created_time' | 'saved_time' | 'username';
export type DeletedTweetIDSortKey = 'deleted_time' | 'tweet_id';
export type DeletedTweetSortKey = 'deleted_time' | TweetSortKey;
export type SortOrder = 'asc' | 'desc';

export type TweetSort = {
  key: TweetSortKey;
  order: SortOrder;
};

export type DeletedTweetIDSort = {
  key: DeletedTweetIDSortKey;
  order: SortOrder;
};

export type DeletedTweetSort = {
  key: DeletedTweetSortKey;
  order: SortOrder;
};
