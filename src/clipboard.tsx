import React from 'react';
import { createRoot } from 'react-dom/client';
import { Root } from './clipboard/component/root';
import './style/clipboard.scss';

const root = document.getElementById('root');
if (root !== null) {
  const reactRoot = createRoot(root);
  reactRoot.render(<Root />);
}
