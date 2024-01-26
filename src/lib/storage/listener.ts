import browser from 'webextension-polyfill';
import { Logger } from '../logger';
import { Tweet, TweetID } from '../tweet/tweet';
import { isTweetIDKey, toTweetID } from './tweet-id-key';

type OnChangedListener = (
  changes: browser.Storage.StorageAreaOnChangedChangesType,
) => void;

export interface UpdatedTweet {
  id: TweetID;
  before: Tweet;
  after: Tweet;
}

export interface StorageChanges {
  addedTweets: Tweet[];
  deletedTweets: Tweet[];
  updatedTweets: UpdatedTweet[];
}

export const createStorageListener = (
  listener: (changes: StorageChanges) => void,
  logger?: Logger,
): OnChangedListener => {
  return (changes: browser.Storage.StorageAreaOnChangedChangesType) => {
    logger?.debug('Storage changes', changes);
    // diff
    const diff: StorageChanges = {
      addedTweets: [],
      deletedTweets: [],
      updatedTweets: [],
    };
    for (const [key, value] of Object.entries(changes)) {
      // tweet
      if (isTweetIDKey(key)) {
        const tweetID = toTweetID(key);
        if (value.oldValue === undefined) {
          diff.addedTweets.push(value.newValue);
        } else if (value.newValue === undefined) {
          diff.deletedTweets.push(value.oldValue);
        } else {
          diff.updatedTweets.push({
            id: tweetID,
            before: value.oldValue,
            after: value.newValue,
          });
        }
      }
    }
    logger?.debug('diff', diff);
    // execute listener
    listener(diff);
  };
};

export const addStorageListener = (listener: OnChangedListener): void => {
  browser.storage.local.onChanged.addListener(listener);
};
