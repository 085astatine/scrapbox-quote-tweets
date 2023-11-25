import classNames from 'classnames';
import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import CheckIcon from '~/icon/bootstrap/check2.svg';
import ClipboardIcon from '~/icon/bootstrap/clipboard.svg';
import TrashboxIcon from '~/icon/bootstrap/trash3.svg';
import { Collapse } from '~/lib/component/transition';
import { Tweet as TweetData } from '~/lib/tweet';
import { SortOrder, TweetSortKey } from '../lib/sort-tweets';
import { tweetSortFunction } from '../lib/sort-tweets';
import {
  State,
  selectAllTweetsAction,
  selectTweetAction,
  unselectAllTweetsAction,
  updateTweetSortAction,
} from '../store';
import { Tweet as TweetInfo } from './tweet';

export const Tweets: React.FC = () => {
  // redux
  const selector = React.useCallback((state: State) => {
    const tweets = [...state.tweets];
    tweets.sort(tweetSortFunction(state.tweetSort));
    return tweets;
  }, []);
  const tweets = useSelector(selector, shallowEqual);
  return (
    <>
      <div className="tweets fade-in">
        <SelectAll />
        <SelectSort />
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

const SelectAll: React.FC = () => {
  // redux
  const selector = React.useCallback(
    (state: State) =>
      state.tweets.every((tweet) => state.selectedTweets.includes(tweet)),
    [],
  );
  const isSelected = useSelector(selector);
  const dispatch = useDispatch();
  // select
  const select = () => {
    if (isSelected) {
      dispatch(unselectAllTweetsAction());
    } else {
      dispatch(selectAllTweetsAction());
    }
  };
  return (
    <button
      className={classNames('checkbox', { checked: isSelected })}
      onClick={select}>
      <CheckIcon className="icon" width={undefined} height={undefined} />
    </button>
  );
};

const SelectSort: React.FC = () => {
  // redux
  const selector = React.useCallback((state: State) => state.tweetSort, []);
  const { key: sortKey, order: sortOrder } = useSelector(selector);
  const dispatch = useDispatch();
  // options
  const options: ReadonlyArray<readonly [TweetSortKey, SortOrder, string]> = [
    ['timestamp', 'asc', 'Posted Time (older → newer)'],
    ['timestamp', 'desc', 'Posted Time (newer → older)'],
    ['username', 'asc', 'Username (@A → @Z)'],
    ['username', 'desc', 'Username (@Z → @A)'],
  ];
  // event
  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const [key, order] = options[event.target.selectedIndex];
    dispatch(updateTweetSortAction({ key, order }));
  };
  return (
    <select
      className="form-select"
      value={options.findIndex(
        ([key, order]) => key === sortKey && order === sortOrder,
      )}
      onChange={onChange}>
      {options.map((option, index) => (
        <option key={index} value={index}>
          {option[2]}
        </option>
      ))}
    </select>
  );
};

const Commands: React.FC = () => {
  // ref
  const ref = React.useRef(null);
  // redux
  const selector = React.useCallback((state: State) => {
    const selectedTweets = [...state.selectedTweets];
    selectedTweets.sort(tweetSortFunction(state.tweetSort));
    return selectedTweets.length > 0;
  }, []);
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
          <div className="commands fade-in">
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
