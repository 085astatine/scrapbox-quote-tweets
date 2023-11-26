import browser from 'webextension-polyfill';
import { deletedTweetIDsListJSONSchema } from '~/jsonschema/deleted-tweets';
import { JSONSchemaValidationError } from '~/validate-json/error';
import validateDeletedTweetIDsList from '~/validate-json/validate-deleted-tweet-ids-list';
import { DeletedTweetIDs, DeletedTweets, Tweet, TweetID } from '../tweet';
import { loadTweets as loadSavedTweets, savedTweetIDs } from './tweet';

const keyTrashbox = 'clipboard/trashbox';

export const loadTweets = async (): Promise<Tweet[]> => {
  // tweet IDs of tweets in trashbox
  const tweetIDsInTrashbox = (await loadTrashboxRecords()).reduce<TweetID[]>(
    (tweetIDs, record) => {
      tweetIDs.concat(record.tweetIDs);
      return tweetIDs;
    },
    [],
  );
  // tweet IDs of tweets in tweets
  const tweetIDsInTweets = (await savedTweetIDs()).filter(
    (id) => !tweetIDsInTrashbox.includes(id),
  );
  return await loadSavedTweets(tweetIDsInTweets);
};

export const moveToTrashbox = async (
  tweets: Tweet[],
  timestamp: number,
): Promise<void> => {
  const record: DeletedTweetIDs = {
    timestamp,
    tweetIDs: tweets.map((tweet) => tweet.id).sort(),
  };
  const records = await loadTrashboxRecords();
  records.push(record);
  records.sort(sortRecords);
  browser.storage.local.set({ [keyTrashbox]: records });
};

export const loadTrashbox = async (): Promise<DeletedTweets[]> => {
  // load records
  const records = await loadTrashboxRecords();
  // load tweets
  const tweetIDs = records.reduce<TweetID[]>((tweetIDs, record) => {
    tweetIDs.concat(record.tweetIDs);
    return tweetIDs;
  }, []);
  const tweets = await loadSavedTweets(tweetIDs);
  // elements
  return records.map(({ timestamp, tweetIDs }) => ({
    timestamp,
    tweets: tweets.filter((tweet) => tweetIDs.includes(tweet.id)),
  }));
};

export const deleteTrashbox = async (
  record: DeletedTweetIDs,
): Promise<void> => {
  const records = (await loadTrashboxRecords()).reduce<DeletedTweetIDs[]>(
    (previous, current) => {
      if (current.timestamp !== record.timestamp) {
        previous.push(current);
      } else {
        current.tweetIDs = current.tweetIDs.filter(
          (id) => !record.tweetIDs.includes(id),
        );
        if (current.tweetIDs) {
          previous.push(current);
        }
      }
      return previous;
    },
    [],
  );
  records.sort(sortRecords);
  await browser.storage.local.set({ [keyTrashbox]: records });
};

export const clearTrashbox = async (): Promise<void> => {
  await browser.storage.local.remove(keyTrashbox);
};

const loadTrashboxRecords = async (): Promise<DeletedTweetIDs[]> => {
  const records = await browser.storage.local
    .get(keyTrashbox)
    .then((record) => record[keyTrashbox] ?? []);
  if (!validateDeletedTweetIDsList(records)) {
    throw new JSONSchemaValidationError(
      deletedTweetIDsListJSONSchema,
      records,
      validateDeletedTweetIDsList.errors ?? [],
    );
  }
  return records;
};

const sortRecords = (lhs: DeletedTweetIDs, rhs: DeletedTweetIDs): number => {
  return rhs.timestamp - lhs.timestamp;
};
