import React from 'react';
import browser from 'webextension-polyfill';

export interface CopyProps {
  tweetID: bigint | null;
}

export const Copy: React.FC<CopyProps> = (props) => {
  const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    alert(`tweet ID: ${props.tweetID}`);
    // send message to background
    browser.runtime.sendMessage({
      type: 'tweet_copy_request',
      tweetID: `${props.tweetID}`,
    });
  };
  return (
    <div onClick={onClick}>
      <button className="copy-button">Copy</button>
    </div>
  );
};
