import classNames from 'classnames';
import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import DeleteIcon from '~/icon/google-fonts/delete-forever.svg';
import RestoreIcon from '~/icon/google-fonts/restore-from-trash.svg';
import { Collapse } from '~/lib/component/transition';
import { toDatetime } from '~/lib/datetime';
import { TrashboxSort } from '~/lib/settings';
import {
  deleteTweetsFromTrashbox,
  restoreTweetsFromTrashbox,
} from '~/lib/storage/trashbox';
import { Tweet as TweetData } from '~/lib/tweet/types';
import { trimGoogleFontsIcon } from '~/lib/utility';
import { State, actions } from '../store';
import {
  selectAllTrashboxSelectButtonState,
  selectDatetimeFormat,
  selectDeletedTimes,
  selectDeletedTweets,
  selectIsAllDeletedTweetsSelected,
  selectIsDeletedTweetSelected,
  selectSelectedDeletedTweets,
  selectTimezone,
  selectTrashboxSize,
  selectTrashboxSort,
} from '../store/selector';
import { Checkbox } from './checkbox';
import { Tweet as TweetInfo } from './tweet';

export const Trashbox: React.FC = () => {
  return (
    <>
      <DeletedTweetsList />
      <Commands />
    </>
  );
};

const DeletedTweetsList: React.FC = () => {
  const deletedTimes = useSelector(selectDeletedTimes, shallowEqual);
  return (
    <div className="deleted-tweets-list">
      <Toolbar />
      {deletedTimes.map((deletedTime) => (
        <DeletedTweets key={deletedTime} deletedTime={deletedTime} />
      ))}
    </div>
  );
};

interface DeletedTweetsProps {
  deletedTime: number;
}

const DeletedTweets: React.FC<DeletedTweetsProps> = ({ deletedTime }) => {
  const selectTweets = React.useCallback(
    (state: State) => selectDeletedTweets(state, deletedTime),
    [deletedTime],
  );
  const tweets = useSelector(selectTweets);
  const selectIsAllSelected = React.useCallback(
    (state: State) => selectIsAllDeletedTweetsSelected(state, deletedTime),
    [deletedTime],
  );
  const isAllSelected = useSelector(selectIsAllSelected);
  const dispatch = useDispatch();
  // select
  const selectAll = () => {
    if (isAllSelected) {
      dispatch(actions.tweet.unselectDeletedTweet(tweets));
    } else {
      dispatch(actions.tweet.selectDeletedTweet(tweets));
    }
  };
  return (
    <div className="item">
      <Checkbox checked={isAllSelected} onClick={selectAll} />
      <div className="deleted-tweets">
        <DeletedTweetsHeader
          timestamp={deletedTime}
          tweetsLength={tweets.length}
        />
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} tweet={tweet} />
        ))}
      </div>
    </div>
  );
};

interface DeletedTweetsHeaderProps {
  timestamp: number;
  tweetsLength: number;
}

const DeletedTweetsHeader: React.FC<DeletedTweetsHeaderProps> = ({
  timestamp,
  tweetsLength,
}) => {
  const timezone = useSelector(selectTimezone);
  const datetimeFormat = useSelector(selectDatetimeFormat);
  const deletedTime = toDatetime(timestamp, timezone).format(datetimeFormat);
  return (
    <div className="deleted-tweets-header">
      <div>{`${tweetsLength} Tweets`}</div>
      <div className="deleted-time">Deleted at {deletedTime}</div>
    </div>
  );
};

interface TweetProps {
  tweet: TweetData;
}

const Tweet: React.FC<TweetProps> = ({ tweet }) => {
  // redux
  const selectIsSelected = React.useCallback(
    (state: State) => selectIsDeletedTweetSelected(state, tweet.id),
    [tweet.id],
  );
  const isSelected = useSelector(selectIsSelected);
  const dispatch = useDispatch();
  // select
  const select = () => {
    if (isSelected) {
      dispatch(actions.tweet.unselectDeletedTweet(tweet));
    } else {
      dispatch(actions.tweet.selectDeletedTweet(tweet));
    }
  };
  return (
    <div className="deleted-tweet">
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
  const id = 'select-all-trashbox';
  const size = useSelector(selectTrashboxSize);
  const state = useSelector(selectAllTrashboxSelectButtonState);
  const dispatch = useDispatch();
  // select
  const select = () => {
    if (state === 'checked') {
      dispatch(actions.tweet.unselectAllDeletedTweets());
    } else if (state === 'unchecked') {
      dispatch(actions.tweet.selectAllDeletedTweets());
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
  const id = 'select-deleted-tweets-sort';
  const { key: sortKey, order: sortOrder } = useSelector(selectTrashboxSort);
  const dispatch = useDispatch();
  // options
  const options: ReadonlyArray<
    readonly [TrashboxSort['key'], TrashboxSort['order'], string]
  > = [
    ['deleted_time', 'desc', 'Deleted Time (Newest → Oldest)'],
    ['deleted_time', 'asc', 'Deleted Time (Oldest → Newest)'],
  ];
  // event
  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const [key, order] = options[event.target.selectedIndex];
    dispatch(actions.settings.updateTrashboxSort({ key, order }));
  };
  return (
    <div className="tool">
      <label className="tool-label" htmlFor={id}>
        Order By
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
  const tweets = useSelector(selectSelectedDeletedTweets, shallowEqual);
  // restore
  const restoreTweets = () => {
    restoreTweetsFromTrashbox(tweets.map((tweet) => tweet.id));
  };
  // delete
  const deleteTweets = () => {
    deleteTweetsFromTrashbox(tweets.map((tweet) => tweet.id));
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
            <button className="command" onClick={restoreTweets}>
              <RestoreIcon
                className="icon"
                viewBox={trimGoogleFontsIcon(200)}
                width={undefined}
                height={undefined}
                fill="currentColor"
              />
            </button>
            <button className="command" onClick={deleteTweets}>
              <DeleteIcon
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
