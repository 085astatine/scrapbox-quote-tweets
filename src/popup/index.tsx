import React from 'react';
import { createRoot } from 'react-dom/client';
import { Root } from './component/root';
import './index.scss';

const root = document.getElementById('root');
if (root !== null) {
  const reactRoot = createRoot(root);
  reactRoot.render(<Root />);
}
