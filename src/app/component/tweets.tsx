import classNames from 'classnames';
import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import CheckIcon from '~/icon/bootstrap/check2.svg';
import ClipboardIcon from '~/icon/bootstrap/clipboard.svg';
import TrashboxIcon from '~/icon/bootstrap/trash3.svg';
import { Collapse } from '~/lib/component/transition';
import { Tweet as TweetData } from '~/lib/tweet';
import { State, selectTweetAction } from '../store';
import { Tweet as TweetInfo } from './tweet';

export const Tweets: React.FC = () => {
  // redux
  const selector = React.useCallback((state: State) => state.tweets, []);
  const tweets = useSelector(selector, shallowEqual);
  return (
    <>
      <div className="tweets">
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} tweet={tweet} />
        ))}
      </div>
      <Commands />
    </>
  );
};

interface TweetProps {
  tweet: TweetData;
}

const Tweet: React.FC<TweetProps> = ({ tweet }: TweetProps) => {
  // redux
  const selector = React.useCallback(
    (state: State) => state.selectedTweets.includes(tweet),
    [tweet],
  );
  const isSelected = useSelector(selector);
  const dispatch = useDispatch();
  // select
  const select = () => dispatch(selectTweetAction(tweet));
  return (
    <div className="item">
      <button
        className={classNames('checkbox', { checked: isSelected })}
        onClick={select}>
        <CheckIcon className="icon" width={undefined} height={undefined} />
      </button>
      <TweetInfo tweet={tweet} />
    </div>
  );
};

const Commands: React.FC = () => {
  // ref
  const ref = React.useRef(null);
  // redux
  const selector = React.useCallback(
    (state: State) => state.selectedTweets.length > 0,
    [],
  );
  const show = useSelector(selector);
  return (
    <Collapse
      nodeRef={ref}
      in={show}
      duration={300}
      mountOnEnter
      unmountOnExit
      target={
        <div ref={ref}>
          <div className="commands">
            <button className="command">
              <ClipboardIcon
                className="icon"
                width={undefined}
                height={undefined}
              />
            </button>
            <button className="command">
              <TrashboxIcon
                className="icon"
                width={undefined}
                height={undefined}
              />
            </button>
          </div>
        </div>
      }
    />
  );
};
