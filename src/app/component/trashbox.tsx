import classNames from 'classnames';
import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import DeleteIcon from '~/icon/google-fonts/delete-forever.svg';
import RestoreIcon from '~/icon/google-fonts/restore-from-trash.svg';
import { Collapse } from '~/lib/component/transition';
import { toDatetime } from '~/lib/datetime';
import {
  deleteTweetsFromTrashbox,
  restoreTweetsFromTrashbox,
} from '~/lib/storage/trashbox';
import {
  DeletedTweets as DeletedTweetsData,
  DeletedTweetsSortKey,
  SortOrder,
  Tweet as TweetData,
} from '~/lib/tweet/types';
import { trimGoogleFontsIcon } from '~/lib/utility';
import { State, actions } from '../store';
import {
  selectAllTrashboxSelectButtonState,
  selectDatetimeFormat,
  selectDeletedTweetsList,
  selectDeletedTweetsSort,
  selectIsAllDeletedTweetsSelected,
  selectIsDeletedTweetSelected,
  selectSelectedDeletedTweets,
  selectTimezone,
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
  const deletedTweetsList = useSelector(selectDeletedTweetsList, shallowEqual);
  return (
    <div className="deleted-tweets-list">
      <Toolbar />
      {deletedTweetsList.map((deletedTweets) => (
        <DeletedTweets
          key={deletedTweets.deleted_at}
          deletedTweets={deletedTweets}
        />
      ))}
    </div>
  );
};

interface DeletedTweetsProps {
  deletedTweets: DeletedTweetsData;
}

const DeletedTweets: React.FC<DeletedTweetsProps> = ({
  deletedTweets: { deleted_at: timestamp, tweets },
}) => {
  const selectIsAllSelected = React.useCallback(
    (state: State) => selectIsAllDeletedTweetsSelected(state, timestamp),
    [timestamp],
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
          timestamp={timestamp}
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
        All Tweets
      </label>
    </div>
  );
};

const SelectSort: React.FC = () => {
  const id = 'select-deleted-tweets-sort';
  const { key: sortKey, order: sortOrder } = useSelector(
    selectDeletedTweetsSort,
  );
  const dispatch = useDispatch();
  // options
  const options: ReadonlyArray<
    readonly [DeletedTweetsSortKey, SortOrder, string]
  > = [
    ['deleted_time', 'desc', 'Deleted Time (Newest → Oldest)'],
    ['deleted_time', 'asc', 'Deleted Time (Oldest → Newest)'],
  ];
  // event
  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const [key, order] = options[event.target.selectedIndex];
    dispatch(actions.settings.updateDeletedTweetsSort({ key, order }));
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
  const dispatch = useDispatch();
  // restore
  const restoreTweets = () => {
    // store
    dispatch(actions.tweet.restoreSelectedDeletedTweets());
    // storage
    restoreTweetsFromTrashbox(tweets.map((tweet) => tweet.id));
  };
  // delete
  const deleteTweets = () => {
    // store
    dispatch(actions.tweet.deleteSelectedDeletedTweets());
    // storage
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
