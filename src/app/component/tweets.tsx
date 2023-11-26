import classNames from 'classnames';
import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import ClipboardIcon from '~/icon/bootstrap/clipboard.svg';
import TrashboxIcon from '~/icon/bootstrap/trash3.svg';
import { Collapse } from '~/lib/component/transition';
import { storage } from '~/lib/storage';
import { Tweet as TweetData } from '~/lib/tweet';
import { SortOrder, TweetSortKey } from '../lib/sort-tweets';
import { tweetSortFunction } from '../lib/sort-tweets';
import {
  State,
  moveToTrashboxAction,
  selectAllTweetsAction,
  selectTweetAction,
  unselectAllTweetsAction,
  unselectTweetAction,
  updateTweetSortAction,
} from '../store';
import { Checkbox } from './checkbox';
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
        <Toolbar />
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
  const select = () => {
    if (isSelected) {
      dispatch(unselectTweetAction(tweet));
    } else {
      dispatch(selectTweetAction(tweet));
    }
  };
  return (
    <div className="item">
      <Checkbox checked={isSelected} onClick={select} />
      <TweetInfo tweet={tweet} />
    </div>
  );
};

const Toolbar: React.FC = () => {
  return (
    <div className="toolbar">
      <SelectAll />
      <SelectSort />
    </div>
  );
};

const SelectAll: React.FC = () => {
  const id = 'select-all-tweets';
  // redux
  const selector = React.useCallback(
    (state: State): 'disabled' | 'checked' | 'unchecked' =>
      state.tweets.length === 0
        ? 'disabled'
        : state.tweets.every((tweet) => state.selectedTweets.includes(tweet))
        ? 'checked'
        : 'unchecked',
    [],
  );
  const state = useSelector(selector);
  const dispatch = useDispatch();
  // select
  const select = () => {
    if (state === 'checked') {
      dispatch(unselectAllTweetsAction());
    } else if (state === 'unchecked') {
      dispatch(selectAllTweetsAction());
    }
  };
  return (
    <div className="tool">
      <Checkbox
        id={id}
        disabled={state === 'disabled'}
        checked={state === 'checked'}
        onClick={select}
      />
      <label
        className={classNames('tool-label', { disabled: state === 'disabled' })}
        htmlFor={id}>
        All Tweets
      </label>
    </div>
  );
};

const SelectSort: React.FC = () => {
  const id = 'select-tweets-sort';
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
    <div className="tool">
      <label className="tool-label" htmlFor={id}>
        Order by
      </label>
      <select
        className="form-select"
        id={id}
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
    </div>
  );
};

const Commands: React.FC = () => {
  // ref
  const ref = React.useRef(null);
  // redux
  const selector = React.useCallback((state: State) => {
    const selectedTweets = [...state.selectedTweets];
    selectedTweets.sort(tweetSortFunction(state.tweetSort));
    return selectedTweets;
  }, []);
  const tweets = useSelector(selector, shallowEqual);
  const dispatch = useDispatch();
  // clipboard
  const copyToClipboard = () => {
    // TODO: copy to clipboard
    moveToTrashbox();
  };
  // move to trashbox
  const moveToTrashbox = () => {
    const timestamp = Math.trunc(Date.now() / 1000);
    // store
    dispatch(moveToTrashboxAction(timestamp));
    // storage
    storage.clipboard.trashbox.move(tweets, timestamp);
  };
  return (
    <Collapse
      nodeRef={ref}
      in={tweets.length > 0}
      duration={300}
      mountOnEnter
      unmountOnExit
      target={
        <div ref={ref}>
          <div className="commands fade-in">
            <button className="command" onClick={copyToClipboard}>
              <ClipboardIcon
                className="icon"
                width={undefined}
                height={undefined}
              />
            </button>
            <button className="command" onClick={moveToTrashbox}>
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
