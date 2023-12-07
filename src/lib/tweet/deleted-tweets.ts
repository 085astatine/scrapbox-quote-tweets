import { Tweet, TweetID } from './tweet';

export interface DeletedTweets {
  deleted_at: number;
  tweets: Tweet[];
}

export interface DeletedTweetIDs {
  deleted_at: number;
  tweetIDs: TweetID[];
}
