import { tweetToString } from '../src/lib/tweet-to-string';

describe('tweet-to-string/tweet', () => {
  const tweet = {
    id: '1234567890123456789',
    timestamp: 1330873445000,
    author: {
      id: '1234567890',
      name: 'User Name',
      username: 'username',
    },
    text: [
      {
        type: 'text' as const,
        text: 'text',
      },
    ],
  };
  const entityTemplate = {
    entity: {
      text: '${text}',
    },
  };
  test('tweet.id', () => {
    const template = {
      tweet: 'tweet.id: ${tweet.id}',
    };
    expect(tweetToString(tweet, { ...entityTemplate, ...template })).toBe(
      'tweet.id: 1234567890123456789'
    );
  });
  test('tweet.url', () => {
    const template = {
      tweet: 'tweet.url: ${tweet.url}',
    };
    expect(tweetToString(tweet, { ...entityTemplate, ...template })).toBe(
      'tweet.url: https://twitter.com/username/status/1234567890123456789'
    );
  });
  test('user.id', () => {
    const template = {
      tweet: 'user.id: ${user.id}',
    };
    expect(tweetToString(tweet, { ...entityTemplate, ...template })).toBe(
      'user.id: 1234567890'
    );
  });
  test('user.name', () => {
    const template = {
      tweet: 'user.name: ${user.name}',
    };
    expect(tweetToString(tweet, { ...entityTemplate, ...template })).toBe(
      'user.name: User Name'
    );
  });
  test('user.username', () => {
    const template = {
      tweet: 'user.username: ${user.username}',
    };
    expect(tweetToString(tweet, { ...entityTemplate, ...template })).toBe(
      'user.username: username'
    );
  });
  test('date.timestamp', () => {
    const template = {
      tweet: 'date.timestamp: ${date.timestamp}',
    };
    expect(tweetToString(tweet, { ...entityTemplate, ...template })).toBe(
      'date.timestamp: 1330873445000'
    );
  });
  test('date.iso(utc)', () => {
    const template = {
      tweet: 'date.iso: ${date.iso}',
      timezone: 'UTC',
    };
    expect(tweetToString(tweet, { ...entityTemplate, ...template })).toBe(
      'date.iso: 2012-03-04T15:04:05Z'
    );
  });
  test('date.iso(Asia/Tokyp)', () => {
    const template = {
      tweet: 'date.iso: ${date.iso}',
      timezone: 'Asia/Tokyo',
    };
    expect(tweetToString(tweet, { ...entityTemplate, ...template })).toBe(
      'date.iso: 2012-03-05T00:04:05+09:00'
    );
  });
  test('date(UTC)', () => {
    const template = {
      tweet:
        'date: ${date.year}/${date.month}/${date.day} ${date.hours}:${date.minutes}:${date.seconds}',
      timezone: 'UTC',
    };
    expect(tweetToString(tweet, { ...entityTemplate, ...template })).toBe(
      'date: 2012/03/04 15:04:05'
    );
  });
  test('date(Asia/Tokyo)', () => {
    const template = {
      tweet:
        'date: ${date.year}/${date.month}/${date.day} ${date.hours}:${date.minutes}:${date.seconds}',
      timezone: 'Asia/Tokyo',
    };
    expect(tweetToString(tweet, { ...entityTemplate, ...template })).toBe(
      'date: 2012/03/05 00:04:05'
    );
  });
});
