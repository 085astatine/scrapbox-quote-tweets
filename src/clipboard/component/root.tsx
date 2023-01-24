import React from 'react';
import { Button } from 'react-bootstrap';
import browser from 'webextension-polyfill';

export const Root: React.FC = () => {
  const close = () => {
    browser.runtime.sendMessage({ type: 'Clipboard/CloseRequest' });
  };
  return (
    <div>
      <h1>Clipboard</h1>
      <Button onClick={close}>Close</Button>
    </div>
  );
};
