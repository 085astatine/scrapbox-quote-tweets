import React from 'react';
import browser from 'webextension-polyfill';
import ScrapboxIcon from './logo/scrapbox.svg';

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
    <div className="copy-button" role="button" tabIndex={0} onClick={onClick}>
      <div className="icon">
        <ScrapboxIcon
          viewBox="0 0 200 200"
          height={undefined}
          width={undefined}
        />
      </div>
    </div>
  );
};
