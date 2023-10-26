import React from 'react';
import { Button } from 'react-bootstrap';
import browser from 'webextension-polyfill';
import { App, Store } from '~/app';

export interface RootProps {
  store: Store;
}

export const Root: React.FC<RootProps> = ({ store }: RootProps) => {
  const close = () => {
    browser.runtime.sendMessage({ type: 'Clipboard/CloseRequest' });
  };
  return (
    <div>
      <h1>Clipboard</h1>
      <div>
        <App store={store} />
      </div>
      <Button onClick={close}>Close</Button>
    </div>
  );
};
