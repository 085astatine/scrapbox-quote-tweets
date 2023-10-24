import browser from 'webextension-polyfill';
import { trashboxRecordsJSONSchema } from '~/jsonschema/clipboard';
import { tweetIDsJSONSchema } from '~/jsonschema/tweet';
import { JSONSchemaValidationError } from '~/validate-json/error';
import validateTrashboxRecords from '~/validate-json/validate-trashbox-records';
import validateTweetIDs from '~/validate-json/validate-tweet-ids';
import { TrashboxElement, TrashboxRecord } from '../clipboard';
import { Tweet, TweetID } from '../tweet';
import { loadTweets as loadSavedTweets, saveTweet } from './tweet';

const keyTweets = 'clipboard/tweets';
const keyTrashbox = 'clipboard/trashbox';

export const addTweet = async (tweet: Tweet): Promise<void> => {
  await saveTweet(tweet);
  const tweetIDs = await loadTweetIDs();
  tweetIDs.push(tweet.id);
  await browser.storage.local.set({ [keyTweets]: tweetIDs.sort() });
};

export const loadTweets = async (): Promise<Tweet[]> => {
  const tweetIDs = await loadTweetIDs();
  return await loadSavedTweets(tweetIDs);
};

export const moveToTrashbox = async (tweets: Tweet[]): Promise<void> => {
  const record: TrashboxRecord = {
    timestamp: Math.trunc(Date.now() / 1000),
    tweetIDs: tweets.map((tweet) => tweet.id).sort(),
  };
  // remove from clipboard/tweets
  const tweetIDs = await loadTweetIDs();
  await browser.storage.local.set({
    [keyTweets]: tweetIDs.filter((id) => !record.tweetIDs.includes(id)).sort(),
  });
  // add to clipboard/trashbox
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

const loadTweetIDs = async (): Promise<TweetID[]> => {
  const tweetIDs = await browser.storage.local
    .get(keyTweets)
    .then((record) => record[keyTweets] ?? []);
  if (!validateTweetIDs(tweetIDs)) {
    throw new JSONSchemaValidationError(
      tweetIDsJSONSchema,
      tweetIDs,
      validateTweetIDs.errors ?? [],
    );
  }
  return tweetIDs;
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
