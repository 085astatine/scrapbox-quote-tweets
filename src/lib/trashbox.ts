import { DeletedTweet, DeletedTweetID, SortOrder } from './tweet/types';

export interface TrashboxSort {
  key: 'deleted_time';
  order: SortOrder;
}

export const deletedTimes = (
  tweets: DeletedTweet[] | DeletedTweetID[],
  order: SortOrder,
): number[] => {
  const compareFunction: (lhs: number, rhs: number) => number =
    order === 'asc' ? (lhs, rhs) => lhs - rhs : (lhs, rhs) => rhs - lhs;
  return tweets
    .map((tweet) => tweet.deleted_at)
    .sort(compareFunction)
    .reduce<number[]>((times, time) => {
      if (times[times.length - 1] !== time) {
        times.push(time);
      }
      return times;
    }, []);
};
