import { TweetV2LookupResult, TwitterApi } from 'twitter-api-v2';
import { logger } from './logger';
import { parseTweets } from './parse-tweets';
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

  // request tweets
  const requestTweets = async (tweetIDs: TweetID[]): Promise<void> =>
    requestTweetsLookup(tweetIDs)
      .then((response) => parseTweetLookupResult(tweetIDs, response))
      .then(saveTweetsToStorage)
      .then((tweets) =>
        listeners.forEach((listener) =>
          listener.onRequestTweetsSuccess?.(tweets)
        )
      );
  return {
    setup,
    addListener,
    removeListener,
    requestTweets,
  } as const;
};
