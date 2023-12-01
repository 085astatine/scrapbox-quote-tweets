import classNames from 'classnames';
import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import DeleteIcon from '~/icon/google-fonts/delete-forever.svg';
import RestoreIcon from '~/icon/google-fonts/restore-from-trash.svg';
import { Collapse } from '~/lib/component/transition';
import {
  deleteTweetsFromTrashbox,
  restoreTweetsFromTrashbox,
} from '~/lib/storage/trashbox';
import { DeletedTweets as DeletedTweetsData } from '~/lib/tweet/deleted-tweets';
import {
  DeletedTweetsSortKey,
  SortOrder,
  deletedTweetsSortFunction,
} from '~/lib/tweet/sort-tweets';
import { Tweet as TweetData } from '~/lib/tweet/tweet';
import { toDate } from '~/lib/tweet/tweet-date';
import { trimGoogleFontsIcon } from '~/lib/utility';
import { State, actions } from '../store';
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
  // redux
  const selector = React.useCallback((state: State) => {
    const deletedTweetsList = [...state.trashbox];
    deletedTweetsList.sort(deletedTweetsSortFunction(state.deletedTweetsSort));
    return deletedTweetsList;
  }, []);
  const deletedTweetsList = useSelector(selector, shallowEqual);
  return (
    <div className="deleted-tweets-list">
      <Toolbar />
      {deletedTweetsList.map((deletedTweets) => (
        <DeletedTweets
          key={deletedTweets.timestamp}
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
  deletedTweets: { timestamp, tweets },
}) => {
  // redux
  const selector = React.useCallback(
    (state: State) =>
      tweets.every((tweet) => state.selectedDeletedTweets.includes(tweet)),
    [tweets],
  );
  const isAllSelected = useSelector(selector);
  const dispatch = useDispatch();
  // select
  const selectAll = () => {
    if (isAllSelected) {
      dispatch(actions.unselectDeletedTweet(tweets));
    } else {
      dispatch(actions.selectDeletedTweet(tweets));
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
  const timezone = 'UTC';
  const dateFormat = 'YYYY/MM/DD HH:mm:ss';
  const deletedTime = toDate(timestamp, timezone).format(dateFormat);
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
  const selector = React.useCallback(
    (state: State) => state.selectedDeletedTweets.includes(tweet),
    [tweet],
  );
  const isSelected = useSelector(selector);
  const dispatch = useDispatch();
  // select
  const select = () => {
    if (isSelected) {
      dispatch(actions.unselectDeletedTweet(tweet));
    } else {
      dispatch(actions.selectDeletedTweet(tweet));
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
  // redux
  const selector = React.useCallback(
    (state: State): 'disabled' | 'checked' | 'unchecked' => {
      const deletedTweetIDs = state.trashbox
        .map((deletedTweets) => deletedTweets.tweets.map((tweet) => tweet.id))
        .flat();
      return (
        deletedTweetIDs.length === 0 ? 'disabled'
        : (
          deletedTweetIDs.every((tweetID) =>
            state.selectedDeletedTweets.some((tweet) => tweet.id === tweetID),
          )
        ) ?
          'checked'
        : 'unchecked'
      );
    },
    [],
  );
  const state = useSelector(selector);
  const dispatch = useDispatch();
  // select
  const select = () => {
    if (state === 'checked') {
      dispatch(actions.unselectAllDeletedTweets());
    } else if (state === 'unchecked') {
      dispatch(actions.selectAllDeletedTweets());
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
  // redux
  const selector = React.useCallback(
    (state: State) => state.deletedTweetsSort,
    [],
  );
  const { key: sortKey, order: sortOrder } = useSelector(selector);
  const dispatch = useDispatch();
  // options
  const options: ReadonlyArray<
    readonly [DeletedTweetsSortKey, SortOrder, string]
  > = [
    ['timestamp', 'desc', 'Deleted Time (Newest → Oldest)'],
    ['timestamp', 'asc', 'Deleted Time (Oldest → Newest)'],
  ];
  // event
  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const [key, order] = options[event.target.selectedIndex];
    dispatch(actions.updateDeletedTweetsSort({ key, order }));
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
  // ref
  const ref = React.useRef(null);
  // redux
  const selector = React.useCallback(
    (state: State) => state.selectedDeletedTweets,
    [],
  );
  const tweets = useSelector(selector, shallowEqual);
  const dispatch = useDispatch();
  // restore
  const restoreTweets = () => {
    // store
    dispatch(actions.restoreSelectedDeletedTweets());
    // storage
    restoreTweetsFromTrashbox(tweets.map((tweet) => tweet.id));
  };
  // delete
  const deleteTweets = () => {
    // store
    dispatch(actions.deleteSelectedDeletedTweets());
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
