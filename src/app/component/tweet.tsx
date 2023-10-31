import React from 'react';
import { useSelector } from 'react-redux';
import { Tweet as TweetData, TweetID, toDate } from '~/lib/tweet';
import { State } from '../store';

export interface TweetProps {
  tweetID: TweetID;
}

export const Tweet: React.FC<TweetProps> = ({ tweetID }: TweetProps) => {
  // redux
  const selector = React.useCallback(
    (state: State) => state.tweets.find((tweet) => tweet.id === tweetID),
    [tweetID],
  );
  const tweet = useSelector(selector);
  if (tweet === undefined) {
    return <div>Error</div>;
  }
  return (
    <div className="tweet">
      <Header tweet={tweet} />
      <div className="text">
        {tweet.text.map((entity) => entity.text).join('')}
      </div>
    </div>
  );
};

interface HeaderProps {
  tweet: TweetData;
}

const Header: React.FC<HeaderProps> = ({ tweet }: HeaderProps) => {
  const baseURL = 'https://twitter.com';
  const timezone = 'UTC';
  const dateFormat = 'YYYY/MM/DD HH:mm:ss';
  const userURL = `${baseURL}/${tweet.author.username}`;
  const tweetURL = `${userURL}/status/${tweet.id}`;
  const date = toDate(tweet.timestamp, timezone).format(dateFormat);
  return (
    <div className="header">
      <a className="name" href={userURL} target="_blink" rel="noreferrer">
        {tweet.author.name}
      </a>
      <a className="username" href={userURL} target="_blink" rel="noreferrer">
        {`@${tweet.author.username}`}
      </a>
      <a className="datetime" href={tweetURL} target="_blink" rel="noreferrer">
        {date}
      </a>
    </div>
  );
};
