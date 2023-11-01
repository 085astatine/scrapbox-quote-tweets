import classNames from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';
import ReturnIcon from '~/icon/bootstrap/arrow-return-left.svg';
import ChevronDownIcon from '~/icon/bootstrap/chevron-down.svg';
import ChevronUpIcon from '~/icon/bootstrap/chevron-up.svg';
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
  const text = tweet.text.map((entity) => entity.text).join('');
  return (
    <div className="tweet">
      <Header tweet={tweet} />
      <Body text={text} />
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

interface BodyProps {
  text: string;
}

const Body: React.FC<BodyProps> = ({ text }: BodyProps) => {
  const [ellipsis, setEllipsis] = React.useState(true);
  const texts = text.split('\n');
  const Icon = ellipsis ? ChevronDownIcon : ChevronUpIcon;
  return (
    <div className="body">
      <div className={classNames('text', { ellipsis })}>
        {texts.map((line, index) => (
          <React.Fragment key={index}>
            {line}
            {index + 1 === texts.length ? (
              <></>
            ) : ellipsis ? (
              <ReturnIcon
                className="return"
                width={undefined}
                height={undefined}
              />
            ) : (
              <br />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="button">
        <div
          className="circle"
          onClick={() => setEllipsis((ellipsis) => !ellipsis)}
        />
        <Icon className="icon" width={undefined} height={undefined} />
      </div>
    </div>
  );
};
