import React from 'react';
import { createRoot } from 'react-dom/client';
import browser from 'webextension-polyfill';
import {
  initializeStoreWithStorage,
  storageListener,
  store,
} from '~/app/store';
import { Root } from './component/root';
import './index.scss';

const root = document.getElementById('root');
if (root !== null) {
  const reactRoot = createRoot(root);
  reactRoot.render(<Root store={store} />);
}

// initialize store with data loaded from storage
initializeStoreWithStorage();

// storage listener
browser.storage.local.onChanged.addListener(storageListener);
