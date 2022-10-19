import React from 'react';
import browser from 'webextension-polyfill';
import { TweetCopyResponseMessage } from '../lib/message';
import ScrapboxIcon from './logo/scrapbox.svg';

export interface CopyButtonProps {
  tweetID: bigint | null;
}

export const CopyButton: React.FC<CopyButtonProps> = (props) => {
  // state
  const [isCopied, setIsCopied] = React.useState(false);
  // click
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
          setIsCopied(message.ok);
        }
      });
  };
  return (
    <div className="copy-button" role="button" tabIndex={0} onClick={onClick}>
      <div className="button">
        <div className={isCopied ? 'circle-active' : 'circle-inactive'} />
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
