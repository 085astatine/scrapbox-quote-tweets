import { tweetToString } from '~/lib/tweet/tweet-to-string';

describe('tweet-to-string/tweet', () => {
  const tweet = {
    id: '1234567890123456789',
    created_at: 1330873445,
    saved_at: 1365142028,
    author: {
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
  const baseTemplate = {
    tweet: '',
    entity: {
      text: '${text}',
      url: '[${decoded_url} ${title}]',
      hashtag: '#${tag}',
      cashtag: '$${tag}',
      mention: '@${username}',
    },
  };
  test('tweet.id', () => {
    const template = {
      ...baseTemplate,
      tweet: 'tweet.id: ${tweet.id}',
    };
    expect(tweetToString(tweet, template)).toBe(
      'tweet.id: 1234567890123456789',
    );
  });
  test('tweet.url(twitter.com)', () => {
    const template = {
      ...baseTemplate,
      tweet: 'tweet.url: ${tweet.url}',
    };
    const option = {
      hostname: 'twitter.com' as const,
    };
    expect(tweetToString(tweet, template, option)).toBe(
      'tweet.url: https://twitter.com/username/status/1234567890123456789',
    );
  });
  test('tweet.url(x.com)', () => {
    const template = {
      ...baseTemplate,
      tweet: 'tweet.url: ${tweet.url}',
    };
    const option = {
      hostname: 'x.com' as const,
    };
    expect(tweetToString(tweet, template, option)).toBe(
      'tweet.url: https://x.com/username/status/1234567890123456789',
    );
  });
  test('tweet.datetime(UTC, ISO8601)', () => {
    const template = {
      ...baseTemplate,
      tweet: 'tweet.datetime: ${tweet.datetime}',
    };
    const option = {
      timezone: 'UTC',
      datetimeFormat: 'YYYY-MM-DD[T]HH:mm:ss[Z]',
    };
    expect(tweetToString(tweet, template, option)).toBe(
      'tweet.datetime: 2012-03-04T15:04:05Z',
    );
  });
  test('tweet.datetime(Asia/Tokyo, ISO8601)', () => {
    const template = {
      ...baseTemplate,
      tweet: 'tweet.datetime: ${tweet.datetime}',
    };
    const option = {
      timezone: 'Asia/Tokyo',
      datetimeFormat: 'YYYY-MM-DD[T]HH:mm:ssZ',
    };
    expect(tweetToString(tweet, template, option)).toBe(
      'tweet.datetime: 2012-03-05T00:04:05+09:00',
    );
  });
  test('tweet.datetime(UTC, Costom Format)', () => {
    const template = {
      ...baseTemplate,
      tweet: 'tweet.datetime: ${tweet.datetime}',
    };
    const option = {
      timezone: 'UTC',
      datetimeFormat: 'YYYY/MM/DD HH:mm:ss',
    };
    expect(tweetToString(tweet, template, option)).toBe(
      'tweet.datetime: 2012/03/04 15:04:05',
    );
  });
  test('tweet.datetime(Asia/Tokyo, Custom Format)', () => {
    const template = {
      ...baseTemplate,
      tweet: 'tweet.datetime: ${tweet.datetime}',
    };
    const option = {
      timezone: 'Asia/Tokyo',
      datetimeFormat: 'YYYY/MM/DD HH:mm:ss',
    };
    expect(tweetToString(tweet, template, option)).toBe(
      'tweet.datetime: 2012/03/05 00:04:05',
    );
  });
  test('user.name', () => {
    const template = {
      ...baseTemplate,
      tweet: 'user.name: ${user.name}',
    };
    expect(tweetToString(tweet, template)).toBe('user.name: User Name');
  });
  test('user.username', () => {
    const template = {
      ...baseTemplate,
      tweet: 'user.username: ${user.username}',
    };
    expect(tweetToString(tweet, template)).toBe('user.username: username');
  });
});

describe('tweet-to-string/entity', () => {
  const tweet = {
    id: '1234567890123456789',
    created_at: 1330873445,
    saved_at: 1365142028,
    author: {
      name: 'Alice',
      username: 'alice',
    },
  };
  const baseTemplate = {
    tweet: '${tweet.text}',
    entity: {
      text: '${text}',
      url: '[${decoded_url} ${title}]',
      hashtag: '#${tag}',
      cashtag: '$${tag}',
      mention: '@${username}',
    },
  };
  test('text', () => {
    const text = {
      text: [{ type: 'text' as const, text: 'This is the test text.' }],
    };
    const template = { ...baseTemplate };
    template.entity = {
      ...baseTemplate.entity,
      text: 'text: "${text}"',
    };
    expect(tweetToString({ ...tweet, ...text }, template)).toBe(
      'text: "This is the test text."',
    );
  });
  test('url', () => {
    const text = {
      text: [
        {
          type: 'url' as const,
          text: 'example.com/sample/i...',
          short_url: 'https://t.co/XXXXXXXXXX',
          expanded_url: 'https://example.com/%E4%BE%8B',
          decoded_url: 'https://example.com/例',
          title: 'Example.com',
        },
      ],
    };
    const template = { ...baseTemplate };
    template.entity = {
      ...template.entity,
      url: [
        'text: "${text}"',
        'short_url: "${short_url}"',
        'expanded_url: "${expanded_url}"',
        'decoded_url: "${decoded_url}"',
        'title: "${title}"',
      ].join('\n'),
    };
    expect(tweetToString({ ...tweet, ...text }, template)).toBe(
      [
        'text: "example.com/sample/i..."',
        'short_url: "https://t.co/XXXXXXXXXX"',
        'expanded_url: "https://example.com/%E4%BE%8B"',
        'decoded_url: "https://example.com/例"',
        'title: "Example.com"',
      ].join('\n'),
    );
  });
  test('hashtag', () => {
    const text = {
      text: [
        {
          type: 'hashtag' as const,
          text: '#Twitter',
          tag: 'Twitter',
        },
      ],
    };
    const template = { ...baseTemplate };
    template.entity = {
      ...template.entity,
      hashtag: ['text: "${text}"', 'tag: "${tag}"'].join('\n'),
    };
    expect(tweetToString({ ...tweet, ...text }, template)).toBe(
      ['text: "#Twitter"', 'tag: "Twitter"'].join('\n'),
    );
  });
  test('cashtag', () => {
    const text = {
      text: [
        {
          type: 'cashtag' as const,
          text: '$TWTR',
          tag: 'TWTR',
        },
      ],
    };
    const template = { ...baseTemplate };
    template.entity = {
      ...template.entity,
      cashtag: ['text: "${text}"', 'tag: "${tag}"'].join('\n'),
    };
    expect(tweetToString({ ...tweet, ...text }, template)).toBe(
      ['text: "$TWTR"', 'tag: "TWTR"'].join('\n'),
    );
  });
  test('mention', () => {
    const text = {
      text: [
        {
          type: 'mention' as const,
          text: '@bob',
          username: 'bob',
        },
      ],
    };
    const template = { ...baseTemplate };
    template.entity = {
      ...template.entity,
      mention: ['text: "${text}"', 'username: "${username}"'].join('\n'),
    };
    expect(tweetToString({ ...tweet, ...text }, template)).toBe(
      ['text: "@bob"', 'username: "bob"'].join('\n'),
    );
  });
});
