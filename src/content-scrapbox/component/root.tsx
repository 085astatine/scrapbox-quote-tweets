import React from 'react';
import browser from 'webextension-polyfill';
import TwitterIcon from '../../icon/twitter.svg';

export const Root = () => {
  const onClick = async () => {
    browser.runtime.sendMessage({ type: 'Clipboard/OpenRequest' });
  };
  return (
    <div className="tool-btn" role="button" onClick={onClick}>
      <TwitterIcon className="kamon" />
    </div>
  );
};
