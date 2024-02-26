import browser from 'webextension-polyfill';
import { deletedTweetIDsJSONSchema } from '~/jsonschema/deleted-tweet-id';
import { JSONSchemaValidationError } from '~/validate-json/error';
import validateDeletedTweetIDs from '~/validate-json/validate-deleted-tweet-ids';
import { deletedTweetIDSortFunction } from '../tweet/sort-tweets';
import { DeletedTweet, DeletedTweetID, Tweet, TweetID } from '../tweet/types';
import { deleteTweets, loadTweets, savedTweetIDs } from './tweet';

const keyTrashbox = 'trashbox';

export const loadTweetsNotInTrashbox = async (): Promise<Tweet[]> => {
  // IDs of tweet in trashbox
  const tweetIDsInTrashbox = (await loadDeletedTweetIDs()).map(
    (element) => element.tweet_id,
  );
  // IDs of tweet not in trashbox;
  const tweetIDsNotInTrashbox = (await savedTweetIDs()).filter(
    (id) => !tweetIDsInTrashbox.includes(id),
  );
  return await loadTweets(tweetIDsNotInTrashbox);
};

export const addTweetsToTrashbox = async (
  tweets: Tweet[],
  deletedAt: number,
): Promise<void> => {
  const deletedTweetIDs = await loadDeletedTweetIDs();
  deletedTweetIDs.push(
    ...tweets.map((tweet) => ({
      deleted_at: deletedAt,
      tweet_id: tweet.id,
    })),
  );
  // sort from oldest to newest
  deletedTweetIDs.sort(
    deletedTweetIDSortFunction({ key: 'deleted_time', order: 'asc' }),
  );
  browser.storage.local.set({ [keyTrashbox]: deletedTweetIDs });
};

export const loadTrashbox = async (): Promise<DeletedTweet[]> => {
  // load IDs of tweet in trashbox
  const deletedTweetIDs = await loadDeletedTweetIDs();
  // load tweets in trashbox
  const tweets = await loadTweets(
    deletedTweetIDs.map((tweet) => tweet.tweet_id),
  );
  // join
  return deletedTweetIDs.reduce<DeletedTweet[]>(
    (deletedTweets, deletedTweet) => {
      const tweet = tweets.find((tweet) => tweet.id === deletedTweet.tweet_id);
      if (tweet !== undefined) {
        deletedTweets.push({ deleted_at: deletedTweet.deleted_at, tweet });
      }
      return deletedTweets;
    },
    [],
  );
};

export const restoreTweetsFromTrashbox = async (
  tweetIDs: TweetID[],
): Promise<void> => {
  // delete from trashbox
  await browser.storage.local.set({
    [keyTrashbox]: (await loadDeletedTweetIDs()).filter(
      (tweet) => !tweetIDs.includes(tweet.tweet_id),
    ),
  });
};

export const deleteTweetsFromTrashbox = async (
  tweetIDs: TweetID[],
): Promise<void> => {
  // delete from storage
  await deleteTweets(tweetIDs);
  // delete from trashbox
  await restoreTweetsFromTrashbox(tweetIDs);
};

export const clearTrashbox = async (): Promise<void> => {
  await browser.storage.local.remove(keyTrashbox);
};

const loadDeletedTweetIDs = async (): Promise<DeletedTweetID[]> => {
  const deletedTweetIDs = await browser.storage.local
    .get(keyTrashbox)
    .then((record) => record[keyTrashbox]);
  if (deletedTweetIDs === undefined) {
    return [];
  }
  if (!validateDeletedTweetIDs(deletedTweetIDs)) {
    throw new JSONSchemaValidationError(
      deletedTweetIDsJSONSchema,
      deletedTweetIDs,
      validateDeletedTweetIDs.errors ?? [],
    );
  }
  return deletedTweetIDs;
};
