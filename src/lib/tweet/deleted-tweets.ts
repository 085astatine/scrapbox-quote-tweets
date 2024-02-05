import { Tweet, TweetID } from './types';

export interface DeletedTweets {
  deleted_at: number;
  tweets: Tweet[];
}

export interface DeletedTweetID {
  deleted_at: number;
  tweet_id: TweetID;
}

export interface DeletedTweetIDs {
  deleted_at: number;
  tweetIDs: TweetID[];
}
