import { Tweet, TweetID } from './tweet';

export interface DeletedTweets {
  timestamp: number;
  tweets: Tweet[];
}

export interface DeletedTweetIDs {
  timestamp: number;
  tweetIDs: TweetID[];
}
