import React from 'react';
import { createRoot } from 'react-dom/client';
import { Root } from './popup/component/root';
import './style/popup.scss';

const root = document.getElementById('root');
if (root !== null) {
  const reactRoot = createRoot(root);
  reactRoot.render(<Root />);
}
