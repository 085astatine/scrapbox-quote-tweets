import classNames from 'classnames';
import React from 'react';
import ReturnIcon from '~/icon/bootstrap/arrow-return-left.svg';
import ChevronDownIcon from '~/icon/bootstrap/chevron-down.svg';
import ChevronUpIcon from '~/icon/bootstrap/chevron-up.svg';
import { Tweet as TweetData, TweetID, toDate } from '~/lib/tweet';

export interface TweetProps {
  tweet: TweetData;
}

export const Tweet: React.FC<TweetProps> = ({ tweet }: TweetProps) => {
  const text = tweet.text.map((entity) => entity.text).join('');
  return (
    <div className="tweet">
      <Header
        id={tweet.id}
        name={tweet.author.name}
        username={tweet.author.username}
        timestamp={tweet.timestamp}
      />
      <Body text={text} />
    </div>
  );
};

interface HeaderProps {
  id: TweetID;
  name: string;
  username: string;
  timestamp: number;
}

const Header: React.FC<HeaderProps> = ({
  id,
  name,
  username,
  timestamp,
}: HeaderProps) => {
  const baseURL = 'https://twitter.com';
  const timezone = 'UTC';
  const dateFormat = 'YYYY/MM/DD HH:mm:ss';
  const userURL = `${baseURL}/${username}`;
  const tweetURL = `${userURL}/status/${id}`;
  const date = toDate(timestamp, timezone).format(dateFormat);
  return (
    <div className="header">
      <a className="name" href={userURL} target="_blink" rel="noreferrer">
        {name}
      </a>
      <a className="username" href={userURL} target="_blink" rel="noreferrer">
        {`@${username}`}
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
            {ellipsis ?
              <ReturnIcon
                className="return"
                width={undefined}
                height={undefined}
              />
            : index + 1 === texts.length ?
              <></>
            : <br />}
          </React.Fragment>
        ))}
      </div>
      <div className="expand-button">
        <button
          className="expand-button-circle"
          onClick={() => setEllipsis((ellipsis) => !ellipsis)}
        />
        <Icon className="icon" width={undefined} height={undefined} />
      </div>
    </div>
  );
};
