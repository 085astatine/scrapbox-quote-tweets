import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  storageListener as appStorageListener,
  initializeStoreWithStorage,
  store,
} from '~/app/store';
import { logger } from '~/lib/logger';
import {
  addStorageListener,
  createStorageListener,
} from '~/lib/storage/listener';
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
const storageListener = createStorageListener(appStorageListener, logger);
addStorageListener(storageListener);
