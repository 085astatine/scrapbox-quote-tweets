import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { storage } from '~/lib/storage';
import { Root } from './component/root';
import './index.scss';
import { initializeAction, store } from './store';

const root = document.getElementById('root');
if (root !== null) {
  const reactRoot = createRoot(root);
  reactRoot.render(
    <Provider store={store}>
      <Root />
    </Provider>,
  );
}

const initialize = async (): Promise<void> => {
  const initializer = {
    tweets: await storage.clipboard.tweets.load(),
    trashbox: await storage.clipboard.trashbox.load(),
  };
  store.dispatch(initializeAction(initializer));
};
initialize();
