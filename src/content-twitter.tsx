import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import browser from 'webextension-polyfill';
import { CopyButton } from './content-twitter/component/copy-button';
import { touchAction, updateAction } from './content-twitter/state';
import { store } from './content-twitter/store';
import { mutationRecordInfo } from './lib/dom';
import { findTweets } from './lib/find-tweets';
import { logger } from './lib/logger';
import { TweetCopyResponseMessage, URLChangedMessage } from './lib/message';
import './style/content-twitter.scss';

logger.info('content script');

// observer
const observerCallback = (records: MutationRecord[]): void => {
  logger.debug(
    'Mutation Records',
    records.map((record) => mutationRecordInfo(record))
  );
  records.forEach((record) => {
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
  logger.debug('on message', message);
  switch (message.type) {
    case 'URL/Changed':
      break;
    case 'TweetCopy/Response': {
      if (message.ok) {
        store.dispatch(
          updateAction({
            tweetIDs: message.tweetIDs,
            state: { state: 'success' },
          })
        );
      } else {
        store.dispatch(
          updateAction({
            tweetIDs: [message.tweetID],
            state: {
              state: 'failure',
              message: message.message,
            },
          })
        );
      }
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
