import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import browser from 'webextension-polyfill';
import { mutationRecordInfo } from '~/lib/dom';
import { logger } from '~/lib/logger';
import { loadSettings } from '~/lib/storage/settings';
import { savedTweetIDs } from '~/lib/storage/tweet';
import { ScrapboxButton } from './component/scrapbox-button';
import './index.scss';
import { insertReactRoot } from './lib/insert-react-root';
import { actions, storageListener, store } from './store';

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
});

// initialize store
const initializeStore = async (): Promise<void> => {
  // tweet
  const tweetIDs = await savedTweetIDs();
  logger.debug('Saved Tweet IDs', tweetIDs);
  store.dispatch(
    actions.tweet.updateButton(
      tweetIDs.map((tweetID) => ({ tweetID, button: { state: 'success' } })),
    ),
  );
  // settings
  const settings = await loadSettings();
  logger.debug('Settings', settings);
  store.dispatch(actions.settings.update(settings.scrapboxIcon));
};
initializeStore();

// storage listener
browser.storage.local.onChanged.addListener(storageListener);
