import React from 'react';
import browser from 'webextension-polyfill';
import { TweetCopyResponseMessage } from '../lib/message';
import ScrapboxIcon from './logo/scrapbox.svg';

export interface CopyProps {
  tweetID: bigint | null;
}

export const Copy: React.FC<CopyProps> = (props) => {
  const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    alert(`tweet ID: ${props.tweetID}`);
    // send message to background
    browser.runtime
      .sendMessage({
        type: 'tweet_copy_request',
        tweetID: `${props.tweetID}`,
      })
      .then((message: TweetCopyResponseMessage) => {
        if (message.type === 'tweet_copy_response') {
          console.log(message);
        }
      });
  };
  return (
    <div className="copy-button" role="button" tabIndex={0} onClick={onClick}>
      <div className="button">
        <div className="circle" />
        <ScrapboxIcon
          className="logo"
          viewBox="-29 0 172 172"
          width={undefined}
          height={undefined}
        />
      </div>
    </div>
  );
};
