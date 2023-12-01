import React from 'react';
import { createRoot } from 'react-dom/client';
import { actions, store } from '~/app/store';
import { loadTrashbox, loadTweetsNotInTrashbox } from '~/lib/storage/trashbox';
import { Root } from './component/root';
import './index.scss';

const root = document.getElementById('root');
if (root !== null) {
  const reactRoot = createRoot(root);
  reactRoot.render(<Root store={store} />);
}

const initialize = async (): Promise<void> => {
  const initializer = {
    tweets: await loadTweetsNotInTrashbox(),
    trashbox: await loadTrashbox(),
  };
  store.dispatch(actions.initialize(initializer));
};
initialize();
