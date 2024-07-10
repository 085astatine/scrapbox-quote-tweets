import equal from 'fast-deep-equal';
import browser from 'webextension-polyfill';
import {
  trashboxSortJSONSchema,
  tweetSortJSONSchema,
} from '~/jsonschema/tweet-sort';
import type { TrashboxSort } from '~/lib/trashbox';
import type { TweetSort } from '~/lib/tweet/types';
import { JSONSchemaValidationError } from '~/validate-json/error';
import validateTrashboxSort from '~/validate-json/validate-trashbox-sort';
import validateTweetSort from '~/validate-json/validate-tweet-sort';
import { logger } from './logger';

// tweet sort
const keyTweetSort = 'tweetSort' as const;

export const saveTweetSort = async (value: TweetSort): Promise<void> => {
  logger.debug('save tweet-sort', value);
  // JSONSchema validation
  if (!validateTweetSort(value)) {
    throw new JSONSchemaValidationError(
      tweetSortJSONSchema,
      value,
      validateTweetSort.errors ?? [],
    );
  }
  // set to storage
  await browser.storage.local.set({ [keyTweetSort]: value });
};

export const loadTweetSort = async (): Promise<TweetSort | null> => {
  logger.debug('load tweet-sort');
  // load from storage
  const value = await browser.storage.local
    .get(keyTweetSort)
    .then((record) => record[keyTweetSort]);
  if (value === undefined) {
    return null;
  }
  // JSONSchema validation
  if (!validateTweetSort(value)) {
    throw new JSONSchemaValidationError(
      tweetSortJSONSchema,
      value,
      validateTweetSort.errors ?? [],
    );
  }
  return value;
};

// trashbox sort
const keyTrashboxSort = 'trashboxSort' as const;

export const saveTrashboxSort = async (value: TrashboxSort): Promise<void> => {
  logger.debug('save trashbox-sort', value);
  // JSONSchema validation
  if (!validateTrashboxSort(value)) {
    throw new JSONSchemaValidationError(
      trashboxSortJSONSchema,
      value,
      validateTrashboxSort.errors ?? [],
    );
  }
  // set to storage
  await browser.storage.local.set({ [keyTrashboxSort]: value });
};

export const loadTrashboxSort = async (): Promise<TrashboxSort | null> => {
  logger.debug('load trashbox-sort');
  // load from storage
  const value = await browser.storage.local
    .get(keyTrashboxSort)
    .then((record) => record[keyTrashboxSort]);
  if (value === undefined) {
    return null;
  }
  // JSONSchema validation
  if (!validateTrashboxSort(value)) {
    throw new JSONSchemaValidationError(
      trashboxSortJSONSchema,
      value,
      validateTrashboxSort.errors ?? [],
    );
  }
  return value;
};

// storage listener
export type OnChangedTweetSort = {
  tweetSort?: TweetSort;
  trashboxSort?: TrashboxSort;
};

export const onChangedTweetSort = (
  changes: browser.Storage.StorageAreaOnChangedChangesType,
): OnChangedTweetSort => {
  const result: OnChangedTweetSort = {};
  // tweetSort
  const tweetSortChange = changes[keyTweetSort];
  if (
    tweetSortChange?.newValue !== undefined &&
    !equal(tweetSortChange.oldValue, tweetSortChange.newValue)
  ) {
    result[keyTweetSort] = tweetSortChange.newValue;
  }
  // trashboxSort
  const trashboxSortChange = changes[keyTrashboxSort];
  if (
    trashboxSortChange?.newValue !== undefined &&
    !equal(trashboxSortChange.oldValue, trashboxSortChange.newValue)
  ) {
    result[keyTrashboxSort] = trashboxSortChange.newValue;
  }
  return result;
};
