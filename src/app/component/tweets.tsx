import classNames from 'classnames';
import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import CheckIcon from '~/icon/bootstrap/check2.svg';
import { Tweet as TweetData } from '~/lib/tweet';
import { State, selectTweetAction } from '../store';
import { Collapse } from './transition';
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
      duration={{ enter: 3000, exit: 1000 }}
      target={
        <div ref={ref}>
          {[...Array(10).keys()].reverse().map((i) => (
            <React.Fragment key={i}>
              {'a'.repeat(i + 1)}
              <br />
            </React.Fragment>
          ))}
        </div>
      }
    />
  );
};
