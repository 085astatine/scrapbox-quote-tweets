import React from 'react';
import { createRoot } from 'react-dom/client';
import { Root } from './options/component/root';
import './style/options.scss';

const root = document.getElementById('root');
if (root !== null) {
  const reactRoot = createRoot(root);
  reactRoot.render(<Root />);
}
