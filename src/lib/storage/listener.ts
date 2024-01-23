import browser from 'webextension-polyfill';
import { Logger } from '../logger';
import { TweetID } from '../tweet/tweet';
import { isTweetIDKey, toTweetID } from './tweet-id-key';

export interface StorageListener {
  onTweetAdded?: (tweetID: TweetID) => void;
  onTweetDeleted?: (tweetID: TweetID) => void;
  onTweetUpdated?: (tweetID: TweetID) => void;
  logger?: Logger;
}

type OnChangedListener = (
  changes: browser.Storage.StorageAreaOnChangedChangesType,
) => void;

export const createStorageListener = ({
  onTweetAdded,
  onTweetDeleted,
  onTweetUpdated,
  logger,
}: StorageListener): OnChangedListener => {
  return (changes: browser.Storage.StorageAreaOnChangedChangesType) => {
    logger?.debug('Storage changes', changes);
    const keys = Object.keys(changes);
    for (const key of keys) {
      // tweet
      if (isTweetIDKey(key)) {
        const tweetID = toTweetID(key);
        if (changes[key].oldValue === undefined) {
          logger?.debug('Tweet is added to storage', {
            tweetID,
            new: changes[key].newValue,
          });
          onTweetAdded?.(tweetID);
        } else if (changes[key].newValue === undefined) {
          logger?.debug('Tweet is deleted from storage', {
            tweetID,
            old: changes[key].oldValue,
          });
          onTweetDeleted?.(tweetID);
        } else {
          logger?.debug('Tweet is updated in storagae', {
            tweetID,
            old: changes[key].oldValue,
            new: changes[key].newValue,
          });
          onTweetUpdated?.(tweetID);
        }
      }
    }
  };
};

export const addStorageListener = (listener: OnChangedListener): void => {
  browser.storage.local.onChanged.addListener(listener);
};
