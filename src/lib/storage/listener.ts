import browser from 'webextension-polyfill';
import { Logger } from '../logger';
import { Tweet, TweetID } from '../tweet/types';
import { isTweetIDKey, toTweetID } from './tweet-id-key';

type OnChangedListener = (
  changes: browser.Storage.StorageAreaOnChangedChangesType,
) => void;

export interface UpdatedTweet {
  id: TweetID;
  before: Tweet;
  after: Tweet;
}

export interface TweetChanges {
  added?: Tweet[];
  deleted?: Tweet[];
  updated?: UpdatedTweet[];
}

export interface StorageListenerArguments {
  tweet?: TweetChanges;
}

export const createStorageListener = (
  listener: (args: StorageListenerArguments) => void,
  logger?: Logger,
): OnChangedListener => {
  return (changes: browser.Storage.StorageAreaOnChangedChangesType) => {
    logger?.debug('Storage changes', changes);
    // diff
    const addedTweets: Tweet[] = [];
    const deletedTweets: Tweet[] = [];
    const updatedTweets: UpdatedTweet[] = [];
    for (const [key, value] of Object.entries(changes)) {
      // tweet
      if (isTweetIDKey(key)) {
        const tweetID = toTweetID(key);
        if (value.oldValue === undefined) {
          addedTweets.push(value.newValue);
        } else if (value.newValue === undefined) {
          deletedTweets.push(value.oldValue);
        } else {
          updatedTweets.push({
            id: tweetID,
            before: value.oldValue,
            after: value.newValue,
          });
        }
      }
    }
    // listener arguments
    const tweetChanges: TweetChanges = {
      ...(addedTweets.length > 0 && { added: addedTweets }),
      ...(deletedTweets.length > 0 && { deleted: deletedTweets }),
      ...(updatedTweets.length > 0 && { updated: updatedTweets }),
    };
    const listenerArgs: StorageListenerArguments = {
      ...(Object.keys(tweetChanges).length > 0 && { tweet: tweetChanges }),
    };
    logger?.debug('listener arguments', listenerArgs);
    // execute listener
    listener(listenerArgs);
  };
};

export const addStorageListener = (listener: OnChangedListener): void => {
  browser.storage.local.onChanged.addListener(listener);
};
