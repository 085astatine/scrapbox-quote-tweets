import { deletedTweetIDSortFunction } from './sort-tweets';
import { DeletedTweetID, DeletedTweetIDs } from './types';

export const group = (tweets: DeletedTweetID[]): DeletedTweetIDs[] => {
  // sort by deleted_at from oldest to newest
  return [...tweets]
    .sort(deletedTweetIDSortFunction({ key: 'deleted_time', order: 'asc' }))
    .reduce<DeletedTweetIDs[]>((result, tweet) => {
      const last = result[result.length - 1];
      if (last?.deleted_at === tweet.deleted_at) {
        last.tweetIDs.push(tweet.tweet_id);
      } else {
        result.push({
          deleted_at: tweet.deleted_at,
          tweetIDs: [tweet.tweet_id],
        });
      }
      return result;
    }, []);
};

export const ungroup = (tweets: DeletedTweetIDs): DeletedTweetID[] => {
  return tweets.tweetIDs.map((tweetID) => ({
    deleted_at: tweets.deleted_at,
    tweet_id: tweetID,
  }));
};
