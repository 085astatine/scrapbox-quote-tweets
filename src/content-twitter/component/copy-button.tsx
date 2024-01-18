import {
  FloatingArrow,
  arrow,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react';
import classNames from 'classnames';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import browser from 'webextension-polyfill';
import CloseIcon from '~/icon/bootstrap/x.svg';
import ScrapboxIcon from '~/icon/scrapbox.svg';
import { Fade } from '~/lib/component/transition';
import { createLogger } from '~/lib/logger';
import {
  SaveTweetRequestMessage,
  SaveTweetResponseMessage,
} from '~/lib/message';
import { toTweetIDKey } from '~/lib/storage/tweet-id-key';
import { TweetID } from '~/lib/tweet/tweet';
import { parseTweet } from '../lib/parse-tweet';
import { State, actions } from '../store';

type TooltipType = 'notification' | 'error';

interface TooltipMessage {
  type: TooltipType;
  message: string;
}

export interface CopyButtonProps {
  tweetID: TweetID;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ tweetID }) => {
  // logger
  const logger = createLogger({ prefix: `[Tweet ID: ${tweetID}] ` });
  // ref
  const ref = React.useRef<HTMLDivElement>(null);
  // redux
  const selector = React.useCallback(
    (state: State) => state[toTweetIDKey(tweetID)],
    [tweetID],
  );
  const buttonState = useSelector(selector);
  const dispatch = useDispatch();
  // floting
  const arrowRef = React.useRef(null);
  const { refs, floatingStyles, context } = useFloating({
    placement: 'top',
    middleware: [offset(10), shift(), arrow({ element: arrowRef })],
  });
  // tooltip
  const [showTooltip, setShowTooltip] = React.useState(false);
  const tooltipMessage: TooltipMessage | null =
    buttonState.state === 'success' ?
      { type: 'notification', message: 'Copied' }
    : buttonState.state === 'failure' ?
      { type: 'error', message: buttonState.message }
    : null;
  // click: copy button
  const onClick = async (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    // set state
    dispatch(actions.update({ tweetID, state: { state: 'in-progress' } }));
    // parse tweet
    if (!ref?.current) {
      logger.warn('reference to DOM is null');
      return;
    }
    const tweet = await parseTweet(
      tweetID,
      ref.current,
      Math.trunc(Date.now() / 1000),
      logger,
    ).catch((error) => {
      logger.warn('failed to parse tweet', error);
      dispatch(
        actions.update({
          tweetID,
          state: { state: 'failure', message: error.message },
        }),
      );
      // show error message with tooltip
      setShowTooltip(true);
      return null;
    });
    logger.info('tweet', tweet);
    if (tweet === null) {
      return;
    }
    // send message to background
    logger.info('save request');
    const request: SaveTweetRequestMessage = {
      type: 'SaveTweet/Request',
      tweet,
    };
    const response: SaveTweetResponseMessage =
      await browser.runtime.sendMessage(request);
    logger.debug('response', response);
    if (response?.type === 'SaveTweet/Response') {
      if (response.ok) {
        dispatch(actions.update({ tweetID, state: { state: 'success' } }));
      } else {
        dispatch(
          actions.update({
            tweetID,
            state: { state: 'failure', message: response.error },
          }),
        );
      }
    }
    // show result with tooltip
    setShowTooltip(true);
  };
  return (
    <div className="copy-button" ref={ref}>
      <div
        className="button"
        role="button"
        tabIndex={0}
        onClick={onClick}
        ref={refs.setReference}>
        <div
          className={classNames({
            'circle-inactive': ['none', 'error'].includes(buttonState.state),
            'circle-in-progress': buttonState.state === 'in-progress',
            'circle-active': buttonState.state === 'success',
          })}
        />
        <ScrapboxIcon
          className="logo"
          viewBox="-29 0 172 172"
          width={undefined}
          height={undefined}
        />
      </div>
      <Fade
        nodeRef={refs.floating}
        in={showTooltip}
        duration={200}
        mountOnEnter
        unmountOnExit
        onEntered={() => {
          if (tooltipMessage?.type === 'notification') {
            setTimeout(() => setShowTooltip(false), 2000);
          }
        }}
        target={
          <div
            className="tooltip"
            ref={refs.setFloating}
            style={floatingStyles}>
            <TooltipBody
              message={tooltipMessage?.message ?? ''}
              {...(tooltipMessage?.type === 'error' ?
                { onClose: () => setShowTooltip(false) }
              : {})}
            />
            <FloatingArrow className="arrow" ref={arrowRef} context={context} />
          </div>
        }
      />
    </div>
  );
};

interface TooltipBodyProps {
  message: string;
  onClose?: () => void;
}

const TooltipBody: React.FC<TooltipBodyProps> = ({
  message,
  onClose = null,
}) => {
  if (onClose === null) {
    return <>{message}</>;
  }
  return (
    <div className="body">
      <CloseIcon
        className="close-button"
        onClick={onClose}
        role="button"
        tabIndex={0}
        width={undefined}
        height={undefined}
      />
      <span>{message}</span>
    </div>
  );
};
