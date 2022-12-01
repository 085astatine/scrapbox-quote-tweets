import React from 'react';
import { createRoot } from 'react-dom/client';
import browser from 'webextension-polyfill';
import { CopyButton } from './content-twitter/component/copy-button';
import { showMutationRecord } from './lib/dom';
import { findTweets } from './lib/find-tweets';
import { loggerProvider } from './lib/logger';
import { URLChangedMessage } from './lib/message';
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
        // render by React
        const reactRoot = createRoot(tweet.reactRoot);
        reactRoot.render(<CopyButton tweetID={tweet.tweetID} />);
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
type Message = URLChangedMessage;

const onMessageListener = (message: Message) => {
  switch (message.type) {
    case 'url_changed':
      logger.info('url changged');
      break;
    default: {
      const _: never = message.type;
      logger.error(`unexpected message type "${message.type}"`);
      return _;
    }
  }
};
browser.runtime.onMessage.addListener(onMessageListener);
