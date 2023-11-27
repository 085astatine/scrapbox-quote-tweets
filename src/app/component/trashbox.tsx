import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import {
  DeletedTweets as DeletedTweetsData,
  Tweet as TweetData,
  toDate,
} from '~/lib/tweet';
import { State } from '../store';
import { Checkbox } from './checkbox';
import { Tweet as TweetInfo } from './tweet';

export const Trashbox: React.FC = () => {
  return (
    <>
      <DeletedTweetsList />
    </>
  );
};

const DeletedTweetsList: React.FC = () => {
  // redux
  const selector = React.useCallback((state: State) => {
    const deletedTweetsList = [...state.trashbox];
    deletedTweetsList.sort((lhs, rhs) => rhs.timestamp - lhs.timestamp);
    return deletedTweetsList;
  }, []);
  const deletedTweetsList = useSelector(selector, shallowEqual);
  return (
    <div className="deleted-tweets-list">
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
  return (
    <div className="item">
      <Checkbox checked={false} onClick={() => {}} />
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
  return (
    <div className="deleted-tweet">
      <Checkbox checked={false} onClick={() => {}} />
      <TweetInfo tweet={tweet} />
    </div>
  );
};
