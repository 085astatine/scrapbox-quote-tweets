import {
  ApiPartialResponseError,
  ApiRequestError,
  ApiResponseError,
  TweetV2LookupResult,
  TwitterApi,
} from 'twitter-api-v2';
import { JSONSchemaValidationError } from '../validate-json/jsonschema-validation-error';
import { logger } from './logger';
import { ParseTweetError, parseTweets } from './parse-tweets';
import { storage } from './storage';
import { Tweet, TweetID } from './tweet';

export interface TwitterAPIClientListener {
  onRequestTweetsSuccess?: (tweets: Tweet[]) => Promise<void>;
  onRequestTweetsFailure?: (
    tweetIDs: TweetID[],
    message: string
  ) => Promise<void>;
}

export const twitterAPIClient = () => {
  // client
  let client = new TwitterApi().v2.readOnly;
  // listener
  const listeners: TwitterAPIClientListener[] = [];

  // setup client
  const setup = async (): Promise<void> => {
    const config = { compression: 'identity' } as const;
    // load bearer token
    const bearerToken = await storage.auth.bearerToken.load();
    if (bearerToken !== null) {
      client = new TwitterApi(bearerToken, config).v2.readOnly;
    }
  };

  // add listener
  const addListener = (listener: TwitterAPIClientListener): void => {
    listeners.push(listener);
  };

  // remove listener
  const removeListener = (listener: TwitterAPIClientListener): void => {
    const index = listeners.lastIndexOf(listener);
    if (index === -1) {
      listeners.splice(index, 1);
    }
  };

  // request tweets
  const requestTweetsLookup = async (
    tweetIDs: TweetID[]
  ): Promise<TweetV2LookupResult> => {
    const result = await client.tweets(tweetIDs, {
      expansions: [
        'attachments.media_keys',
        'author_id',
        'referenced_tweets.id',
        'referenced_tweets.id.author_id',
      ],
      'media.fields': 'url',
      'tweet.fields': ['created_at', 'entities'],
      'user.fields': ['name', 'username'],
    });
    logger.debug(`[${tweetIDs.join(', ')}] API request result`, result);
    return Promise.resolve(result);
  };
  // parse tweets
  const parseTweetLookupResult = async (
    tweetIDs: TweetID[],
    response: TweetV2LookupResult
  ): Promise<Tweet[]> => {
    const tweets = parseTweets(response);
    logger.debug(`[${tweetIDs.join(', ')}] parse result`, tweets);
    return Promise.resolve(tweets);
  };
  // save tweets
  const saveTweetsToStorage = async (tweets: Tweet[]): Promise<Tweet[]> => {
    await storage.tweets.save(tweets);
    return Promise.resolve(tweets);
  };
  // error massage when requesting tweets
  const requestTweetsErrorMessage = (
    tweetIDs: TweetID[],
    error: unknown
  ): string => {
    // Twitter API Error
    if (
      error instanceof ApiRequestError ||
      error instanceof ApiResponseError ||
      error instanceof ApiPartialResponseError
    ) {
      logger.error(`[${tweetIDs.join(',')}] failed in Twitter API`, error);
      return `Twitter API Error: ${error.type}`;
    }
    // Parse Error
    if (error instanceof ParseTweetError) {
      logger.error(`[${tweetIDs.join(',')}] failed in parse`, error);
      return 'Failed to Parse Tweet';
    }
    // Validation Error
    if (error instanceof JSONSchemaValidationError) {
      logger.error(
        `[${tweetIDs.join(',')}] Failed in JSON Schema validation`,
        error
      );
      return 'Validation Error';
    }
    logger.error(`[${tweetIDs.join(',')}] unknown error`, error);
    return 'Unknown Error';
  };

  // request tweets
  const requestTweets = async (tweetIDs: TweetID[]): Promise<void> =>
    requestTweetsLookup(tweetIDs)
      .then((response) => parseTweetLookupResult(tweetIDs, response))
      .then(saveTweetsToStorage)
      .then((tweets) =>
        listeners.forEach((listener) =>
          listener.onRequestTweetsSuccess?.(tweets)
        )
      )
      .catch((error) =>
        listeners.forEach((listener) =>
          listener.onRequestTweetsFailure?.(
            tweetIDs,
            requestTweetsErrorMessage(tweetIDs, error)
          )
        )
      );
  return {
    setup,
    addListener,
    removeListener,
    requestTweets,
  } as const;
};
