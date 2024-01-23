import browser from 'webextension-polyfill';
import { Logger } from '../logger';
import { TweetID } from '../tweet/tweet';
import { isTweetIDKey, toTweetID } from './tweet-id-key';

export interface StorageListener {
  onTweetAdded?: (tweetIDs: TweetID[]) => void;
  onTweetDeleted?: (tweetIDs: TweetID[]) => void;
  onTweetUpdated?: (tweetIDs: TweetID[]) => void;
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
    // tweets
    const addedTweetIDs: TweetID[] = [];
    const deletedTweetIDs: TweetID[] = [];
    const updatedTweetIDs: TweetID[] = [];
    for (const key of keys) {
      // tweet
      if (isTweetIDKey(key)) {
        const tweetID = toTweetID(key);
        if (changes[key].oldValue === undefined) {
          addedTweetIDs.push(tweetID);
        } else if (changes[key].newValue === undefined) {
          deletedTweetIDs.push(tweetID);
        } else {
          updatedTweetIDs.push(tweetID);
        }
      }
    }
    logger?.debug('diff', { addedTweetIDs, deletedTweetIDs, updatedTweetIDs });
    // execute callbacks
    addedTweetIDs.length > 0 && onTweetAdded?.(addedTweetIDs);
    deletedTweetIDs.length > 0 && onTweetDeleted?.(deletedTweetIDs);
    updatedTweetIDs.length > 0 && onTweetUpdated?.(updatedTweetIDs);
  };
};

export const addStorageListener = (listener: OnChangedListener): void => {
  browser.storage.local.onChanged.addListener(listener);
};
