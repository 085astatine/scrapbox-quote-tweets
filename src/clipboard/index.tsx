import React from 'react';
import { createRoot } from 'react-dom/client';
import { initializeAction, store } from '~/app/store';
import { storage } from '~/lib/storage';
import { Root } from './component/root';
import './index.scss';

const root = document.getElementById('root');
if (root !== null) {
  const reactRoot = createRoot(root);
  reactRoot.render(<Root store={store} />);
}

const initialize = async (): Promise<void> => {
  const initializer = {
    tweets: await storage.clipboard.tweets.load(),
    trashbox: await storage.clipboard.trashbox.load(),
  };
  store.dispatch(initializeAction(initializer));
};
initialize();
