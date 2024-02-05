import browser from 'webextension-polyfill';
import { deletedTweetIDsListJSONSchema } from '~/jsonschema/deleted-tweets';
import { JSONSchemaValidationError } from '~/validate-json/error';
import validateDeletedTweetIDsList from '~/validate-json/validate-deleted-tweet-ids-list';
import { DeletedTweetIDs, DeletedTweets, Tweet, TweetID } from '../tweet/types';
import { deleteTweets, loadTweets, savedTweetIDs } from './tweet';

const keyTrashbox = 'trashbox';

export const loadTweetsNotInTrashbox = async (): Promise<Tweet[]> => {
  // IDs of tweet in trashbox
  const tweetIDsInTrashbox = (await loadDeletedTweetIDsList())
    .map((element) => element.tweetIDs)
    .flat();
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
  const newElement: DeletedTweetIDs = {
    deleted_at: deletedAt,
    tweetIDs: tweets.map((tweet) => tweet.id).sort(),
  };
  const elements = await loadDeletedTweetIDsList();
  elements.push(newElement);
  elements.sort(sortDeletedTweetIDs);
  browser.storage.local.set({ [keyTrashbox]: elements });
};

export const loadTrashbox = async (): Promise<DeletedTweets[]> => {
  // load IDs of tweet in trashbox
  const deletedTweetIDsList = await loadDeletedTweetIDsList();
  // load tweets in trashbox
  const tweetIDs = deletedTweetIDsList
    .map((element) => element.tweetIDs)
    .flat();
  const tweets = await loadTweets(tweetIDs);
  // elements
  return deletedTweetIDsList.map(({ deleted_at: deletedAt, tweetIDs }) => ({
    deleted_at: deletedAt,
    tweets: tweetIDs.reduce<Tweet[]>((result, id) => {
      const tweet = tweets.find((tweet) => tweet.id === id);
      if (tweet !== undefined) {
        result.push(tweet);
      }
      return result;
    }, []),
  }));
};

export const restoreTweetsFromTrashbox = async (
  tweetIDs: TweetID[],
): Promise<void> => {
  // delete from trashbox
  const result = (await loadDeletedTweetIDsList()).reduce<DeletedTweetIDs[]>(
    (result, element) => {
      // delete selected tweet IDs
      element.tweetIDs = element.tweetIDs.filter(
        (id) => !tweetIDs.includes(id),
      );
      if (element.tweetIDs.length > 0) {
        result.push(element);
      }
      return result;
    },
    [],
  );
  await browser.storage.local.set({ [keyTrashbox]: result });
};

export const deleteTweetsFromTrashbox = async (
  tweetIDs: TweetID[],
): Promise<void> => {
  // delete from trashbox
  await restoreTweetsFromTrashbox(tweetIDs);
  // delete from storage
  await deleteTweets(tweetIDs);
};

export const clearTrashbox = async (): Promise<void> => {
  await browser.storage.local.remove(keyTrashbox);
};

const loadDeletedTweetIDsList = async (): Promise<DeletedTweetIDs[]> => {
  const deletedTweetIDsList = await browser.storage.local
    .get(keyTrashbox)
    .then((record) => record[keyTrashbox]);
  if (deletedTweetIDsList === undefined) {
    return [];
  }
  if (!validateDeletedTweetIDsList(deletedTweetIDsList)) {
    throw new JSONSchemaValidationError(
      deletedTweetIDsListJSONSchema,
      deletedTweetIDsList,
      validateDeletedTweetIDsList.errors ?? [],
    );
  }
  return deletedTweetIDsList;
};

const sortDeletedTweetIDs = (
  lhs: DeletedTweetIDs,
  rhs: DeletedTweetIDs,
): number => {
  return rhs.deleted_at - lhs.deleted_at;
};
