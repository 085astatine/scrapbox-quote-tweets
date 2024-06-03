import classNames from 'classnames';
import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import ClipboardIcon from '~/icon/bootstrap/clipboard.svg';
import TrashboxIcon from '~/icon/google-fonts/delete.svg';
import { Collapse } from '~/lib/component/transition';
import { addTweetsToTrashbox } from '~/lib/storage/trashbox';
import { defaultTweetTemplate } from '~/lib/tweet/tweet-template';
import { tweetToString } from '~/lib/tweet/tweet-to-string';
import { SortOrder, Tweet as TweetData, TweetSortKey } from '~/lib/tweet/types';
import { trimGoogleFontsIcon } from '~/lib/utility';
import { State, actions } from '../store';
import {
  selectAllTweetsSelectButtonState,
  selectIsSelectedTweet,
  selectSelectedTweets,
  selectTweetSort,
  selectTweetToStringOption,
  selectTweets,
  selectTweetsSize,
} from '../store/selector';
import { Checkbox } from './checkbox';
import { Tweet as TweetInfo } from './tweet';

export const Tweets: React.FC = () => {
  const tweets = useSelector(selectTweets, shallowEqual);
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
  const selectIsSelected = React.useCallback(
    (state: State) => selectIsSelectedTweet(state, tweet.id),
    [tweet.id],
  );
  const isSelected = useSelector(selectIsSelected);
  const dispatch = useDispatch();
  // select
  const select = () => {
    if (isSelected) {
      dispatch(actions.tweet.unselectTweet(tweet));
    } else {
      dispatch(actions.tweet.selectTweet(tweet));
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
  const size = useSelector(selectTweetsSize);
  const state = useSelector(selectAllTweetsSelectButtonState);
  const dispatch = useDispatch();
  // select
  const select = () => {
    if (state === 'checked') {
      dispatch(actions.tweet.unselectAllTweets());
    } else if (state === 'unchecked') {
      dispatch(actions.tweet.selectAllTweets());
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
        All Tweets ({size})
      </label>
    </div>
  );
};

const SelectSort: React.FC = () => {
  const id = 'select-tweets-sort';
  const { key: sortKey, order: sortOrder } = useSelector(selectTweetSort);
  const dispatch = useDispatch();
  // options
  const options: ReadonlyArray<readonly [TweetSortKey, SortOrder, string]> = [
    ['created_time', 'desc', 'Posted Time (Newest → Oldest)'],
    ['created_time', 'asc', 'Posted Time (Oldest → Newest)'],
    ['saved_time', 'desc', 'Saved Time (Newest → Oldest)'],
    ['saved_time', 'asc', 'Saved Time (Oldest → Newest)'],
    ['username', 'asc', 'Username (@A → @Z)'],
    ['username', 'desc', 'Username (@Z → @A)'],
  ];
  // event
  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const [key, order] = options[event.target.selectedIndex];
    dispatch(actions.settings.updateTweetSort({ key, order }));
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
  const ref = React.useRef(null);
  const tweets = useSelector(selectSelectedTweets, shallowEqual);
  const toStringOption = useSelector(selectTweetToStringOption, shallowEqual);
  // clipboard
  const copyToClipboard = () => {
    // copy to clipboard
    const text = tweets
      .map((tweet) =>
        tweetToString(tweet, defaultTweetTemplate(), toStringOption),
      )
      .join('\n');
    navigator.clipboard.writeText(text);
    // move to trashbox
    moveToTrashbox();
  };
  // move to trashbox
  const moveToTrashbox = () => {
    const timestamp = Math.trunc(Date.now() / 1000);
    // storage
    addTweetsToTrashbox(tweets, timestamp);
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
                viewBox={trimGoogleFontsIcon(200)}
                width={undefined}
                height={undefined}
                fill="currentColor"
              />
            </button>
          </div>
        </div>
      }
    />
  );
};
