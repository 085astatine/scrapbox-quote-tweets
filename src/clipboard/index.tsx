import React from 'react';
import { createRoot } from 'react-dom/client';
import '../style/clipboard.scss';
import { Root } from './component/root';

const root = document.getElementById('root');
if (root !== null) {
  const reactRoot = createRoot(root);
  reactRoot.render(<Root />);
}
