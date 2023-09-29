import React from 'react';
import { createRoot } from 'react-dom/client';
import '../style/options.scss';
import { Root } from './component/root';

const root = document.getElementById('root');
if (root !== null) {
  const reactRoot = createRoot(root);
  reactRoot.render(<Root />);
}
