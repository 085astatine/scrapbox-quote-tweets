import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  storageListener as appStorageListener,
  initializeStoreWithStorage,
  store,
} from '~/app/store';
import { getElement, mutationRecordInfo } from '~/lib/dom';
import { logger } from '~/lib/logger';
import {
  addStorageListener,
  createStorageListener,
} from '~/lib/storage/listener';
import { Root } from './component/root';
import './index.scss';

logger.info('content scrapbox');

// DOM Content Loaded Event
window.addEventListener('DOMContentLoaded', () => {
  logger.debug('window DomContentLoaded event');
  // mutation observer
  mutationObserver.observe(document.body, {
    subtree: true,
    childList: true,
  });
});

// mutation observer
const observerCallback = (records: MutationRecord[]): void => {
  logger.debug('mutation records', records.map(mutationRecordInfo));
  records.forEach((record) => {
    record.addedNodes.forEach((node) => {
      const pageMenuNode = getElement('.//div[@class="page-menu"]', node);
      if (pageMenuNode === null) {
        return;
      }
      const rootDiv = createReactRoot(pageMenuNode);
      if (rootDiv === null) {
        return;
      }
      const reactRoot = createRoot(rootDiv);
      reactRoot.render(<Root store={store} />);
      // initialize store with data loaded from storage
      initializeStoreWithStorage();
    });
  });
};
const mutationObserver = new MutationObserver(observerCallback);

// create React root
const createReactRoot = (element: Element): Element | null => {
  // check if root already exists
  if (getElement('./div[@id="scrapbox-copy-tweets"]', element) !== null) {
    logger.info('<div id="scrapbox-copy-tweets" /> already exists');
    return null;
  }
  // find random jump button
  const random = getElement('./a[i[@class="kamon kamon-switch"]]', element);
  // crate <div class="scrapbox-copy-tweets" />
  logger.info('create <div id="scrapbox-copy-tweets" />');
  const root = element.insertBefore(document.createElement('div'), random);
  root.id = 'scrapbox-copy-tweets';
  root.classList.add('dropdown');
  return root;
};

// storage listener
const storageListener = createStorageListener(appStorageListener, logger);
addStorageListener(storageListener);
