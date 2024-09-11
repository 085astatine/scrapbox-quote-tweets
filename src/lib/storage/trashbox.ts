import equal from 'fast-deep-equal';
import browser from 'webextension-polyfill';
import { deletedTweetIDsJSONSchema } from '~/jsonschema/deleted-tweet-id';
import { JSONSchemaValidationError } from '~/validate-json/error';
import validateDeletedTweetIDs from '~/validate-json/validate-deleted-tweet-ids';
import { deletedTweetIDSortFunction } from '../tweet/sort-tweets';
import type {
  DeletedTweet,
  DeletedTweetID,
  Tweet,
  TweetID,
} from '../tweet/types';
import { logger } from './logger';
import { deleteTweets, loadTweets, savedTweetIDs } from './tweet';

const keyTrashbox = 'trashbox';

// load & save
export const loadTweetsNotInTrashbox = async (): Promise<Tweet[]> => {
  logger.debug('load tweets that are not in trashbox');
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
  logger.debug('add tweets to trashbox', { tweets, deletedAt });
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
  logger.debug('load tweets that are in trashbox');
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
  logger.debug('delete tweets from trashbox', tweetIDs);
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
  logger.debug('clear trashbox');
  await browser.storage.local.remove(keyTrashbox);
};

const loadDeletedTweetIDs = async (): Promise<DeletedTweetID[]> => {
  const deletedTweetIDs = await browser.storage.local
    .get(keyTrashbox)
    .then((record) => record[keyTrashbox]);
  if (deletedTweetIDs === undefined) {
    return [];
  }
  // JSONSchema validation
  assertIsDeletedTweetIDs(deletedTweetIDs);
  return deletedTweetIDs;
};

// storage listener
export type OnChangedTrashbox = {
  trashbox?: {
    added?: DeletedTweetID[];
    deleted?: DeletedTweetID[];
    updated?: DeletedTweetID[];
  };
};

export const onChangedTrashbox = (
  changes: browser.Storage.StorageAreaOnChangedChangesType,
): OnChangedTrashbox => {
  const trashbox = parseChanges(
    toDeletedTweetIDs(changes[keyTrashbox]?.oldValue),
    toDeletedTweetIDs(changes[keyTrashbox]?.newValue),
  );
  return {
    ...(Object.keys(trashbox).length > 0 && { trashbox }),
  };
};

const parseChanges = (
  oldValue: DeletedTweetID[],
  newValue: DeletedTweetID[],
): NonNullable<OnChangedTrashbox['trashbox']> => {
  if (oldValue.length === 0) {
    if (newValue.length === 0) {
      return {};
    } else {
      return { added: newValue };
    }
  } else if (newValue.length === 0) {
    return { deleted: oldValue };
  }
  // join on TweetID
  const changes: Map<
    TweetID,
    { before?: DeletedTweetID; after?: DeletedTweetID }
  > = new Map(oldValue.map((before) => [before.tweet_id, { before }]));
  newValue.forEach((after) => {
    const change = changes.get(after.tweet_id);
    if (change !== undefined) {
      change.after = after;
    } else {
      changes.set(after.tweet_id, { after });
    }
  });
  // categorize added/deleted/updated
  const added: DeletedTweetID[] = [];
  const deleted: DeletedTweetID[] = [];
  const updated: DeletedTweetID[] = [];
  changes.forEach(({ before, after }, id) => {
    if (before === undefined) {
      if (after !== undefined) {
        added.push(after);
      }
    } else {
      if (after === undefined) {
        deleted.push(before);
      } else if (!equal(before, after)) {
        updated.push(after);
      }
    }
  });
  return {
    ...(added.length > 0 && { added }),
    ...(deleted.length > 0 && { deleted }),
    ...(updated.length > 0 && { updated }),
  };
};

// type guard
function assertIsDeletedTweetIDs(
  value: unknown,
): asserts value is DeletedTweetID[] {
  if (!validateDeletedTweetIDs(value)) {
    throw new JSONSchemaValidationError(
      deletedTweetIDsJSONSchema,
      value,
      validateDeletedTweetIDs.errors ?? [],
    );
  }
}

const toDeletedTweetIDs = (value: unknown): DeletedTweetID[] => {
  if (value === undefined) {
    return [];
  }
  try {
    assertIsDeletedTweetIDs(value);
    return value;
  } catch {
    return [];
  }
};
