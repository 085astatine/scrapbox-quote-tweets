import React from 'react';
import { createRoot } from 'react-dom/client';
import browser from 'webextension-polyfill';
import { Copy } from './component/copy';
import { showMutationRecord } from './lib/dom';
import { findTweets } from './lib/find-tweets';
import { loggerProvider } from './lib/logger';
import { Message } from './lib/message';

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
        reactRoot.render(<Copy tweetID={tweet.tweetID} />);
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

// message: url changed
const urlChangedListener = (message: Message) => {
  if (message.type == 'url_changed') {
    logger.info('url changged');
  }
};
browser.runtime.onMessage.addListener(urlChangedListener);
