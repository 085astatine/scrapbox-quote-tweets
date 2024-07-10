import React from 'react';
import { App } from '~/app';
import type { Store } from '~/app/store';

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
  return (
    <div className="header">
      <div className="title">Scrapbox Copy Tweets</div>
    </div>
  );
};
