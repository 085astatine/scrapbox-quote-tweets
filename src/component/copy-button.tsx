import { useFloating } from '@floating-ui/react-dom';
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
  // floting
  const { x, y, reference, floating, strategy } = useFloating();
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
          if (!message.ok) {
            console.log(message.message);
          }
        }
      });
  };
  return (
    <div className="copy-button">
      <div
        className="button"
        role="button"
        tabIndex={0}
        onClick={onClick}
        ref={reference}>
        <div className={isCopied ? 'circle-active' : 'circle-inactive'} />
        <ScrapboxIcon
          className="logo"
          viewBox="-29 0 172 172"
          width={undefined}
          height={undefined}
        />
      </div>
      <div
        ref={floating}
        style={{ position: strategy, top: y ?? 0, left: x ?? 0 }}>
        Tooltip
      </div>
    </div>
  );
};
