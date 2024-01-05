import React from 'react';
import { createRoot } from 'react-dom/client';
import { initializeStoreWithStorage, store } from '~/app/store';
import { Root } from './component/root';
import './index.scss';

const root = document.getElementById('root');
if (root !== null) {
  const reactRoot = createRoot(root);
  reactRoot.render(<Root store={store} />);
}

// initialize store with data loaded from storage
initializeStoreWithStorage();
