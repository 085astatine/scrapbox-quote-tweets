import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import browser from 'webextension-polyfill';
import { mutationRecordInfo } from '@lib/dom';
import { logger } from '@lib/logger';
import { TweetCopyResponseMessage } from '@lib/message';
import { storage } from '@lib/storage';
import '../style/content-twitter.scss';
import { CopyButton } from './component/copy-button';
import { findTweets } from './lib/find-tweets';
import { touchAction, updateAction } from './state';
import { store } from './store';

logger.info('content script');

// observer
const observerCallback = (records: MutationRecord[]): void => {
  logger.debug(
    'Mutation Records',
    records.map((record) => mutationRecordInfo(record)),
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
          </Provider>,
        );
      });
    });
  });
};

// observe body
const observer = new MutationObserver(observerCallback);

window.addEventListener('DOMContentLoaded', () => {
  logger.info('window DOMContentLoaded event');
  // Mutation Observer
  const options = {
    subtree: true,
    childList: true,
  };
  observer.observe(document.body, options);
  // Load saved TweetIDs from storage
  storage.tweets.savedIDs().then((tweetIDs) => {
    logger.debug('Saved tweet IDs', tweetIDs);
    store.dispatch(
      updateAction({
        tweetIDs,
        state: { state: 'success' },
      }),
    );
  });
});

// onMessage listener
type Message = TweetCopyResponseMessage;

const onMessageListener = (message: Message) => {
  logger.debug('on message', message);
  switch (message.type) {
    case 'TweetCopy/Response': {
      if (message.ok) {
        store.dispatch(
          updateAction({
            tweetIDs: message.tweetIDs,
            state: { state: 'success' },
          }),
        );
      } else {
        store.dispatch(
          updateAction({
            tweetIDs: message.tweetIDs,
            state: {
              state: 'failure',
              message: message.message,
            },
          }),
        );
      }
      break;
    }
    default: {
      const _: never = message.type;
      logger.error(`unexpected message "${message}"`);
      return _;
    }
  }
};
browser.runtime.onMessage.addListener(onMessageListener);
