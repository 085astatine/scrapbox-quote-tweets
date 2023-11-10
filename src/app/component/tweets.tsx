import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { State } from '../store';
import { Tweet } from './tweet';

export const Tweets: React.FC = () => {
  // redux
  const selector = React.useCallback((state: State) => state.tweets, []);
  const tweets = useSelector(selector, shallowEqual);
  return (
    <div className="tweets">
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} tweet={tweet} />
      ))}
    </div>
  );
};
