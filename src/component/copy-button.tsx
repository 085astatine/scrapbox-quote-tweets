import React from 'react';
import { usePopper } from 'react-popper';
import browser from 'webextension-polyfill';
import { TweetCopyResponseMessage } from '../lib/message';
import ScrapboxIcon from './logo/scrapbox.svg';

export interface CopyButtonProps {
  tweetID: bigint | null;
}

export const CopyButton: React.FC<CopyButtonProps> = (props) => {
  // poper element
  const [referenceElement, setReferenceElement] =
    React.useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] =
    React.useState<HTMLDivElement | null>(null);
  const [arrowElement, setArrowElement] = React.useState<HTMLDivElement | null>(
    null
  );
  // state
  const [isCopied, setIsCopied] = React.useState(false);
  // popper
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [{ name: 'arrow', options: { element: arrowElement } }],
  });
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
        ref={setReferenceElement}>
        <div className={isCopied ? 'circle-active' : 'circle-inactive'} />
        <ScrapboxIcon
          className="logo"
          viewBox="-29 0 172 172"
          width={undefined}
          height={undefined}
        />
      </div>
      <div ref={setPopperElement} style={styles.popper} {...attributes.popper}>
        Popper Element
        <div ref={setArrowElement} style={styles.arrow} />
      </div>
    </div>
  );
};
