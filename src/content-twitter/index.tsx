import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { mutationRecordInfo } from '~/lib/dom';
import { logger } from '~/lib/logger';
import {
  StorageListenerArguments,
  addStorageListener,
  createStorageListener,
} from '~/lib/storage/listener';
import { savedTweetIDs } from '~/lib/storage/tweet';
import { ScrapboxButton } from './component/scrapbox-button';
import './index.scss';
import { insertReactRoot } from './lib/insert-react-root';
import { actions, store } from './store';
import { ScrapboxButtonUpdater } from './store/tweet';

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
      insertReactRoot(node, new URL(document.URL), logger).forEach(
        ({ tweetID, reactRoot }) => {
          // update store
          store.dispatch(actions.tweet.touch(tweetID));
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
      actions.tweet.updateButton(
        tweetIDs.map((tweetID) => ({ tweetID, button: { state: 'success' } })),
      ),
    );
  });
});

// storage listener
const storageListener = createStorageListener(
  (args: StorageListenerArguments) => {
    const buttonUpdaters: ScrapboxButtonUpdater[] = [];
    // added tweets
    if (args.tweet?.added?.length) {
      buttonUpdaters.push(
        ...args.tweet.added.map((tweet) => ({
          tweetID: tweet.id,
          button: { state: 'success' as const },
        })),
      );
    }
    // deleted tweets
    if (args.tweet?.deleted?.length) {
      buttonUpdaters.push(
        ...args.tweet.deleted.map((tweet) => ({
          tweetID: tweet.id,
          button: { state: 'none' as const },
        })),
      );
    }
    // update state
    if (buttonUpdaters.length) {
      store.dispatch(actions.tweet.updateButton(buttonUpdaters));
    }
  },
  logger,
);
addStorageListener(storageListener);
