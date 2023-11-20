import React from 'react';
import browser from 'webextension-polyfill';
import { App, Store } from '~/app';
import CloseIcon from '~/icon/bootstrap/x.svg';

export interface RootProps {
  store: Store;
}

export const Root: React.FC<RootProps> = ({ store }: RootProps) => {
  return (
    <div className="scrapbox-copy-tweets">
      <Header />
      <App store={store} />
    </div>
  );
};

const Header: React.FC = () => {
  const close = () => {
    browser.runtime.sendMessage({ type: 'Clipboard/CloseRequest' });
  };
  return (
    <div className="header">
      <div className="title">Scrapbox Copy Tweets</div>
      <div className="close btn btn-danger" onClick={close}>
        <CloseIcon className="icon" width={undefined} height={undefined} />
      </div>
    </div>
  );
};
