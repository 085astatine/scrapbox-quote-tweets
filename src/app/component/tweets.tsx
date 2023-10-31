import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { State } from '../store';
import { Tweet } from './tweet';

export const Tweets: React.FC = () => {
  // redux
  const selector = React.useCallback(
    (state: State) => state.tweets.map((tweet) => tweet.id),
    [],
  );
  const tweetIDs = useSelector(selector, shallowEqual);
  return (
    <div className="tweets">
      {tweetIDs.map((tweetID) => (
        <Tweet key={tweetID} tweetID={tweetID} />
      ))}
    </div>
  );
};
