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
import { type Logger, createLogger } from '~/lib/logger';
import {
  deleteTweet as deleteTweetFromStorage,
  saveTweet,
  savedTweetIDs,
} from '~/lib/storage/tweet';
import type { Tweet, TweetID } from '~/lib/tweet/types';
import { JSONSchemaValidationError } from '~/validate-json/error';
import { parseTweet } from '../lib/parse-tweet';
import { State, actions } from '../store';
import {
  selectScrapboxButtonState,
  selectScrapboxIcon,
} from '../store/selector';

type TooltipType = 'notification' | 'error';

type TooltipMessage = {
  type: TooltipType;
  message: string;
  onClosed?: () => void;
};

export type ScrapboxButtonProps = {
  tweetID: TweetID;
};

export const ScrapboxButton: React.FC<ScrapboxButtonProps> = ({ tweetID }) => {
  // logger
  const logger = createLogger({ prefix: `[Tweet ID: ${tweetID}] ` });
  // reference for parsing this tweet
  const tweetRef = React.useRef<HTMLDivElement>(null);
  // redux
  const selector = React.useCallback(
    (state: State) => selectScrapboxButtonState(state, tweetID),
    [tweetID],
  );
  const buttonState = useSelector(selector);
  const icon = useSelector(selectScrapboxIcon);
  const dispatch = useDispatch();
  // floting-ui
  const arrowRef = React.useRef<SVGSVGElement>(null);
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
    dispatch(
      actions.tweet.updateButton({ tweetID, button: { state: 'in-progress' } }),
    );
    // add tweet
    const result = await addTweet(tweetID, tweetRef.current, logger);
    if (result.ok) {
      setTooltipMessage({ type: 'notification', message: 'Copied' });
    } else {
      dispatch(
        actions.tweet.updateButton({
          tweetID,
          button: { state: 'failure', message: result.error },
        }),
      );
      setTooltipMessage({
        type: 'error',
        message: `Failed: ${result.error}`,
        onClosed: () =>
          dispatch(
            actions.tweet.updateButton({ tweetID, button: { state: 'none' } }),
          ),
      });
    }
    // show result with tooltip
    setShowTooltip(true);
  };
  // click: delete tweet
  const onClickDeleteTweet = async () => {
    // change to in-progress
    dispatch(
      actions.tweet.updateButton({ tweetID, button: { state: 'in-progress' } }),
    );
    // delete tweet
    const result = await deleteTweet(tweetID, logger);
    if (result.ok) {
      setTooltipMessage({ type: 'notification', message: 'Deleted' });
    } else {
      setTooltipMessage({
        type: 'error',
        message: `Failed: ${result.error}`,
        onClosed: () =>
          dispatch(
            actions.tweet.updateButton({
              tweetID,
              button: { state: 'success' },
            }),
          ),
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
        {icon === 'scrapbox' ?
          <ScrapboxIcon
            className="logo"
            viewBox="-29 0 172 172"
            width={undefined}
            height={undefined}
          />
        : <div className="logo">
            <img
              src={browser.runtime.getURL('cosense.png')}
              alt="Cosense Icon"
            />
          </div>
        }
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
                {...(tooltipMessage.type === 'error' && {
                  onClose: () => setShowTooltip(false),
                })}
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

type TooltipBodyProps = {
  message: string;
  onClose?: () => void;
};

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

type AddTweetSuccess = {
  ok: true;
  tweet: Tweet;
};

type AddTweetFailure = {
  ok: false;
  error: string;
};

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
  // save to storage
  return await saveTweet(result.tweet)
    .then(() => {
      logger.debug('Save tweet to storage', result.tweet);
      return result;
    })
    .catch((error) => {
      logger.warn('Faled to save tweet to storage', error);
      return {
        ok: false,
        error:
          error instanceof JSONSchemaValidationError ? 'Validation Error' : (
            'Unknown Error'
          ),
      };
    });
};

type DeleteTweetSuccess = {
  ok: true;
};

type DeleteTweetFailure = {
  ok: false;
  error: string;
};

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
