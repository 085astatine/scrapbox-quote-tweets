import browser from 'webextension-polyfill';
import { trashboxRecordsJSONSchema } from '~/jsonschema/clipboard';
import { JSONSchemaValidationError } from '~/validate-json/error';
import validateTrashboxRecords from '~/validate-json/validate-trashbox-records';
import { TrashboxElement, TrashboxRecord } from '../clipboard';
import { Tweet, TweetID } from '../tweet';
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
  const record: TrashboxRecord = {
    timestamp,
    tweetIDs: tweets.map((tweet) => tweet.id).sort(),
  };
  const records = await loadTrashboxRecords();
  records.push(record);
  records.sort(sortRecords);
  browser.storage.local.set({ [keyTrashbox]: records });
};

export const loadTrashbox = async (): Promise<TrashboxElement[]> => {
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

export const deleteTrashbox = async (record: TrashboxRecord): Promise<void> => {
  const records = (await loadTrashboxRecords()).reduce<TrashboxRecord[]>(
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

const loadTrashboxRecords = async (): Promise<TrashboxRecord[]> => {
  const records = await browser.storage.local
    .get(keyTrashbox)
    .then((record) => record[keyTrashbox] ?? []);
  if (!validateTrashboxRecords(records)) {
    throw new JSONSchemaValidationError(
      trashboxRecordsJSONSchema,
      records,
      validateTrashboxRecords.errors ?? [],
    );
  }
  return records;
};

const sortRecords = (lhs: TrashboxRecord, rhs: TrashboxRecord): number => {
  return rhs.timestamp - lhs.timestamp;
};
