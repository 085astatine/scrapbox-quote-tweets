import 'error-polyfill';
import { TweetV2LookupResult, TwitterApi } from 'twitter-api-v2';
import browser from 'webextension-polyfill';
import { loggerProvider } from './lib/logger';
import { Message } from './lib/message';

const logger = loggerProvider.getCategory('background');

logger.info('background script');

// URL Changed
const urlChangedListener = async (
  tabID: number,
  changeInfo: browser.Tabs.OnUpdatedChangeInfoType,
  tab: browser.Tabs.Tab
) => {
  logger.debug(`tab ID: ${tabID}, URL: ${tab.url}`, changeInfo);
  if ('url' in changeInfo) {
    const tabID = tab?.id ?? browser.tabs.TAB_ID_NONE;
    logger.info(`send URL changed message to tab ${tabID}`);
    browser.tabs.sendMessage(tabID, { type: 'url_changed' });
  }
};

browser.tabs.onUpdated.addListener(urlChangedListener);

// Twitter API Client
const createTwitterApiClient = () => {
  const bearerToken = process.env.BEARER_TOKEN;
  if (bearerToken === undefined) {
    return null;
  }
  return new TwitterApi(bearerToken, { compression: 'identity' }).v2.readOnly;
};

const twitterApiClient = createTwitterApiClient();

// Tweet Copy Request
const tweetCopyRequestListener = (message: Message) => {
  if (message.type === 'tweet_copy_request') {
    logger.info(`tweet copy request: ${message.tweetID}`);
    if (twitterApiClient !== null) {
      twitterApiClient
        .tweets(`${message.tweetID}`)
        .then((result: TweetV2LookupResult) => console.log(result));
    }
  }
};

browser.runtime.onMessage.addListener(tweetCopyRequestListener);
