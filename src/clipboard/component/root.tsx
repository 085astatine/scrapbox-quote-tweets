import React from 'react';
import { App } from '~/app';

export const Root: React.FC = () => {
  return (
    <div className="scrapbox-copy-tweets">
      <Header />
      <App />
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
