import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import browser from 'webextension-polyfill';
import { CopyButton } from './content-twitter/component/copy-button';
import { touchAction, updateAction } from './content-twitter/state';
import { store } from './content-twitter/store';
import { showMutationRecord } from './lib/dom';
import { findTweets } from './lib/find-tweets';
import { loggerProvider } from './lib/logger';
import { TweetCopyResponseMessage, URLChangedMessage } from './lib/message';
import './style/content-twitter.scss';

const logger = loggerProvider.getCategory('content-twitter');

logger.info('content script');

// observer
const observerCallback = (records: MutationRecord[]): void => {
  logger.info('mutation observer callback');
  records.forEach((record) => {
    // show record
    showMutationRecord(record, logger);
    // tweet nodes
    record.addedNodes.forEach((node) => {
      findTweets(node, document.URL, logger).forEach((tweet) => {
        // update store
        store.dispatch(touchAction([tweet.tweetID]));
        // render by React
        const reactRoot = createRoot(tweet.reactRoot);
        reactRoot.render(
          <Provider store={store}>
            <CopyButton tweetID={tweet.tweetID} />
          </Provider>
        );
      });
    });
  });
};

// observe body
const observer = new MutationObserver(observerCallback);

window.addEventListener('DOMContentLoaded', () => {
  logger.info('window DOMContentLoaded event');
  const options = {
    subtree: true,
    childList: true,
  };
  observer.observe(document.body, options);
});

// onMessage listener
type Message = URLChangedMessage | TweetCopyResponseMessage;

const onMessageListener = (message: Message) => {
  switch (message.type) {
    case 'url_changed':
      logger.info('url changged');
      break;
    case 'tweet_copy_response': {
      const state = message.ok
        ? { state: 'success' as const }
        : { state: 'failure' as const, message: message.message };
      store.dispatch(updateAction({ tweetIDs: [message.tweetID], state }));
      break;
    }
    default: {
      const _: never = message;
      logger.error(`unexpected message "${message}"`);
      return _;
    }
  }
};
browser.runtime.onMessage.addListener(onMessageListener);
