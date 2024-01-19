import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import browser from 'webextension-polyfill';
import { mutationRecordInfo } from '~/lib/dom';
import { logger } from '~/lib/logger';
import { SaveTweetReportMessage } from '~/lib/message';
import { savedTweetIDs } from '~/lib/storage/tweet';
import { ScrapboxButton } from './component/scrapbox-button';
import './index.scss';
import { insertReactRoot } from './lib/insert-react-root';
import { actions, store } from './store';

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
      insertReactRoot(node, document.URL, logger).forEach(
        ({ tweetID, reactRoot }) => {
          // update store
          store.dispatch(actions.touch(tweetID));
          // render by React
          const root = createRoot(reactRoot);
          root.render(
            <Provider store={store}>
              <ScrapboxButton tweetID={tweetID} />
            </Provider>,
          );
        },
      );
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
  savedTweetIDs().then((tweetIDs) => {
    logger.debug('Saved Tweet IDs', tweetIDs);
    store.dispatch(
      actions.update(
        tweetIDs.map((tweetID) => ({ tweetID, state: { state: 'success' } })),
      ),
    );
  });
});

// onMessage listener
type Message = SaveTweetReportMessage;

const onMessageListener = (message: Message) => {
  logger.debug('on message', message);
  switch (message.type) {
    case 'SaveTweet/Report':
      store.dispatch(
        actions.update({
          tweetID: message.tweetID,
          state: { state: 'success' },
        }),
      );
      break;
    default: {
      const _: never = message.type;
      logger.error(`unexpected message "${message}"`);
      return _;
    }
  }
};
browser.runtime.onMessage.addListener(onMessageListener);
