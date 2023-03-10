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
  test('tweet.id', () => {
    const template = {
      tweet: 'tweet.id: ${tweet.id}',
    };
    expect(tweetToString(tweet, template)).toBe(
      'tweet.id: 1234567890123456789'
    );
  });
  test('tweet.url', () => {
    const template = {
      tweet: 'tweet.url: ${tweet.url}',
    };
    expect(tweetToString(tweet, template)).toBe(
      'tweet.url: https://twitter.com/username/status/1234567890123456789'
    );
  });
  test('user.id', () => {
    const template = {
      tweet: 'user.id: ${user.id}',
    };
    expect(tweetToString(tweet, template)).toBe('user.id: 1234567890');
  });
  test('user.name', () => {
    const template = {
      tweet: 'user.name: ${user.name}',
    };
    expect(tweetToString(tweet, template)).toBe('user.name: User Name');
  });
  test('user.username', () => {
    const template = {
      tweet: 'user.username: ${user.username}',
    };
    expect(tweetToString(tweet, template)).toBe('user.username: username');
  });
  test('date.timestamp', () => {
    const template = {
      tweet: 'date.timestamp: ${date.timestamp}',
    };
    expect(tweetToString(tweet, template)).toBe(
      'date.timestamp: 1330873445000'
    );
  });
});
