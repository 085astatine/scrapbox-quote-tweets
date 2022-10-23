import { arrow, offset, shift, useFloating } from '@floating-ui/react-dom';
import classNames from 'classnames';
import React from 'react';
import browser from 'webextension-polyfill';
import { TweetCopyResponseMessage } from '../lib/message';
import ScrapboxIcon from './logo/scrapbox.svg';

type TooltipVisibility = 'none' | 'fade-in' | 'visible' | 'fade-out';

export interface CopyButtonProps {
  tweetID: bigint | null;
}

export const CopyButton: React.FC<CopyButtonProps> = (props) => {
  // state
  const [isCopied, setIsCopied] = React.useState(false);
  const [tooltipVisibility, setTooltipVisibility] =
    React.useState<TooltipVisibility>('none');
  // floting
  const arrowRef = React.useRef(null);
  const {
    x,
    y,
    reference,
    floating,
    strategy,
    middlewareData: { arrow: { x: arrowX, y: arrowY } = {} },
  } = useFloating({
    placement: 'top',
    middleware: [offset(10), shift(), arrow({ element: arrowRef })],
  });
  // effect: tooltip visibility
  React.useEffect(() => {
    switch (tooltipVisibility) {
      case 'none':
        break;
      case 'fade-in': {
        const timeoutID = setTimeout(
          () => setTooltipVisibility('visible'),
          200
        );
        return () => clearTimeout(timeoutID);
      }
      case 'visible': {
        const timeoutID = setTimeout(
          () => setTooltipVisibility('fade-out'),
          2000
        );
        return () => clearTimeout(timeoutID);
      }
      case 'fade-out': {
        const timeoutID = setTimeout(() => setTooltipVisibility('none'), 200);
        return () => clearTimeout(timeoutID);
      }
      default: {
        const _: never = tooltipVisibility;
        return _;
      }
    }
  }, [tooltipVisibility]);
  // click
  const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    // alert(`tweet ID: ${props.tweetID}`);
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
          setTooltipVisibility('fade-in');
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
      {tooltipVisibility !== 'none' ? (
        <div
          className={classNames('tooltip', {
            'fade-in': tooltipVisibility === 'fade-in',
            'fade-out': tooltipVisibility === 'fade-out',
          })}
          ref={floating}
          style={{ position: strategy, top: y ?? 0, left: x ?? 0 }}>
          Tooltip
          <div
            className="arrow"
            ref={arrowRef}
            style={{
              position: strategy,
              top: arrowY !== null ? `${arrowY}px` : '',
              left: arrowX !== null ? `${arrowX}px` : '',
            }}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
