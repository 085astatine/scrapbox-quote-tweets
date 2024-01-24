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
import { Logger, createLogger } from '~/lib/logger';
import {
  TweetSaveRequestMessage,
  TweetSaveResponseMessage,
} from '~/lib/message';
import {
  deleteTweet as deleteTweetFromStorage,
  savedTweetIDs,
} from '~/lib/storage/tweet';
import { toTweetIDKey } from '~/lib/storage/tweet-id-key';
import { Tweet, TweetID } from '~/lib/tweet/tweet';
import { parseTweet } from '../lib/parse-tweet';
import { State, actions } from '../store';

type TooltipType = 'notification' | 'error';

interface TooltipMessage {
  type: TooltipType;
  message: string;
  onClosed?: () => void;
}

export interface ScrapboxButtonProps {
  tweetID: TweetID;
}

export const ScrapboxButton: React.FC<ScrapboxButtonProps> = ({ tweetID }) => {
  // logger
  const logger = createLogger({ prefix: `[Tweet ID: ${tweetID}] ` });
  // reference for parsing this tweet
  const tweetRef = React.useRef(null);
  // redux
  const selector = React.useCallback(
    (state: State) => state[toTweetIDKey(tweetID)],
    [tweetID],
  );
  const buttonState = useSelector(selector);
  const dispatch = useDispatch();
  // floting-ui
  const arrowRef = React.useRef(null);
  const { refs, floatingStyles, context } = useFloating({
    placement: 'top',
    middleware: [offset(10), shift(), arrow({ element: arrowRef })],
  });
  // tooltip
  const [showTooltip, setShowTooltip] = React.useState(false);
  const [tooltipMessage, setTooltipMessage] =
    React.useState<TooltipMessage | null>(null);
  // click: add tweet
  const onClickAddTweet = async () => {
    // change to in-progress
    dispatch(actions.update({ tweetID, state: { state: 'in-progress' } }));
    // add tweet
    const result = await addTweet(tweetID, tweetRef.current, logger);
    if (result.ok) {
      dispatch(actions.update({ tweetID, state: { state: 'success' } }));
      setTooltipMessage({ type: 'notification', message: 'Copied' });
    } else {
      dispatch(
        actions.update({
          tweetID,
          state: { state: 'failure', message: result.error },
        }),
      );
      setTooltipMessage({
        type: 'error',
        message: `Failed: ${result.error}`,
        onClosed: () =>
          dispatch(actions.update({ tweetID, state: { state: 'none' } })),
      });
    }
    // show result with tooltip
    setShowTooltip(true);
  };
  // click: delete tweet
  const onClickDeleteTweet = async () => {
    // change to in-progress
    dispatch(actions.update({ tweetID, state: { state: 'in-progress' } }));
    // delete tweet
    const result = await deleteTweet(tweetID, logger);
    if (result.ok) {
      setTooltipMessage({ type: 'notification', message: 'Deleted' });
    } else {
      setTooltipMessage({
        type: 'error',
        message: `Failed: ${result.error}`,
        onClosed: () =>
          dispatch(actions.update({ tweetID, state: { state: 'success' } })),
      });
    }
    // show result with tooltip
    setShowTooltip(true);
  };
  // click
  const onClick = async (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    switch (buttonState.state) {
      case 'none':
        await onClickAddTweet();
        break;
      case 'success':
        await onClickDeleteTweet();
        break;
    }
  };
  return (
    <div className="scrapbox-button" ref={tweetRef}>
      <div
        className="button"
        role="button"
        tabIndex={0}
        onClick={onClick}
        ref={refs.setReference}>
        <div
          className={classNames({
            'circle-inactive': ['none', 'failure'].includes(buttonState.state),
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
        in={showTooltip && tooltipMessage !== null}
        duration={200}
        mountOnEnter
        unmountOnExit
        onEntered={() => {
          if (tooltipMessage?.type === 'notification') {
            setTimeout(() => setShowTooltip(false), 2000);
          }
        }}
        onExited={() => {
          setTooltipMessage(null);
          tooltipMessage?.onClosed?.();
        }}
        target={
          tooltipMessage !== null && (
            <div
              className="tooltip"
              ref={refs.setFloating}
              style={floatingStyles}>
              <TooltipBody
                message={tooltipMessage.message}
                {...(tooltipMessage.type === 'error' ?
                  { onClose: () => setShowTooltip(false) }
                : {})}
              />
              <FloatingArrow
                className="arrow"
                ref={arrowRef}
                context={context}
              />
            </div>
          )
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

interface AddTweetSuccess {
  ok: true;
  tweet: Tweet;
}

interface AddTweetFailure {
  ok: false;
  error: string;
}

type AddTweetResult = AddTweetSuccess | AddTweetFailure;

const addTweet = async (
  tweetID: TweetID,
  element: HTMLElement | null,
  logger: Logger,
): Promise<AddTweetResult> => {
  // check if reference is not null
  if (element === null) {
    logger.warn('Reference to DOM is null');
    return { ok: false, error: 'Reference to DOM is null' };
  }
  // current timestamp
  const timestamp = Math.trunc(Date.now() / 1000);
  // parse tweet from DOM
  const result = await parseTweet(tweetID, element, timestamp, logger)
    .then((tweet): AddTweetResult => {
      logger.info('tweet', tweet);
      return tweet !== null ?
          { ok: true, tweet }
        : { ok: false, error: 'Failed to parse tweet' };
    })
    .catch((error): AddTweetFailure => {
      logger.warn('Failed to parse tweet', error);
      return { ok: false, error: error.message };
    });
  if (!result.ok) {
    return result;
  }
  // send request to background
  logger.info('Save request');
  const request: TweetSaveRequestMessage = {
    type: 'Tweet/SaveRequest',
    tweet: result.tweet,
  };
  const response: TweetSaveResponseMessage =
    await browser.runtime.sendMessage(request);
  logger.debug('Save response', response);
  if (response?.type === 'Tweet/SaveResponse') {
    if (response.tweetID !== tweetID) {
      return { ok: false, error: 'Tweet ID does not match' };
    }
    if (response.ok) {
      return result;
    } else {
      return { ok: false, error: response.error };
    }
  }
  return { ok: false, error: 'Unknown response' };
};

interface DeleteTweetSuccess {
  ok: true;
}

interface DeleteTweetFailure {
  ok: false;
  error: string;
}

type DeleteTweetResult = DeleteTweetSuccess | DeleteTweetFailure;

const deleteTweet = async (
  tweetID: TweetID,
  logger: Logger,
): Promise<DeleteTweetResult> => {
  // check if the tweet exists in storage
  if (!(await savedTweetIDs()).includes(tweetID)) {
    return { ok: false, error: 'Tweet is not found in storage' };
  }
  // delete tweet
  return await deleteTweetFromStorage(tweetID)
    .then((): DeleteTweetSuccess => {
      return { ok: true };
    })
    .catch((error): DeleteTweetFailure => {
      logger.error('Failed to delete tweet from storage', error);
      return { ok: false, error: 'Failed to delete from storage' };
    });
};
