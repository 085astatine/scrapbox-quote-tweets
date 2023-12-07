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
  const entityTemplate = {
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
      tweet: 'tweet.id: ${tweet.id}',
    };
    expect(tweetToString(tweet, { ...entityTemplate, ...template })).toBe(
      'tweet.id: 1234567890123456789',
    );
  });
  test('tweet.url', () => {
    const template = {
      tweet: 'tweet.url: ${tweet.url}',
    };
    expect(tweetToString(tweet, { ...entityTemplate, ...template })).toBe(
      'tweet.url: https://twitter.com/username/status/1234567890123456789',
    );
  });
  test('user.name', () => {
    const template = {
      tweet: 'user.name: ${user.name}',
    };
    expect(tweetToString(tweet, { ...entityTemplate, ...template })).toBe(
      'user.name: User Name',
    );
  });
  test('user.username', () => {
    const template = {
      tweet: 'user.username: ${user.username}',
    };
    expect(tweetToString(tweet, { ...entityTemplate, ...template })).toBe(
      'user.username: username',
    );
  });
  test('date.timestamp', () => {
    const template = {
      tweet: 'date.timestamp: ${date.timestamp}',
    };
    expect(tweetToString(tweet, { ...entityTemplate, ...template })).toBe(
      'date.timestamp: 1330873445',
    );
  });
  test('date.iso(utc)', () => {
    const template = {
      tweet: 'date.iso: ${date.iso}',
      timezone: 'UTC',
    };
    expect(tweetToString(tweet, { ...entityTemplate, ...template })).toBe(
      'date.iso: 2012-03-04T15:04:05Z',
    );
  });
  test('date.iso(Asia/Tokyp)', () => {
    const template = {
      tweet: 'date.iso: ${date.iso}',
      timezone: 'Asia/Tokyo',
    };
    expect(tweetToString(tweet, { ...entityTemplate, ...template })).toBe(
      'date.iso: 2012-03-05T00:04:05+09:00',
    );
  });
  test('date(UTC)', () => {
    const template = {
      tweet:
        'date: ${date.year}/${date.month}/${date.day} ${date.hours}:${date.minutes}:${date.seconds}',
      timezone: 'UTC',
    };
    expect(tweetToString(tweet, { ...entityTemplate, ...template })).toBe(
      'date: 2012/03/04 15:04:05',
    );
  });
  test('date(Asia/Tokyo)', () => {
    const template = {
      tweet:
        'date: ${date.year}/${date.month}/${date.day} ${date.hours}:${date.minutes}:${date.seconds}',
      timezone: 'Asia/Tokyo',
    };
    expect(tweetToString(tweet, { ...entityTemplate, ...template })).toBe(
      'date: 2012/03/05 00:04:05',
    );
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
      ...{ text: 'text: "${text}"' },
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
      ...{
        url: [
          'text: "${text}"',
          'short_url: "${short_url}"',
          'expanded_url: "${expanded_url}"',
          'decoded_url: "${decoded_url}"',
          'title: "${title}"',
        ].join('\n'),
      },
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
      ...{
        hashtag: ['text: "${text}"', 'tag: "${tag}"'].join('\n'),
      },
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
      ...{
        cashtag: ['text: "${text}"', 'tag: "${tag}"'].join('\n'),
      },
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
      ...{
        mention: ['text: "${text}"', 'username: "${username}"'].join('\n'),
      },
    };
    expect(tweetToString({ ...tweet, ...text }, template)).toBe(
      ['text: "@bob"', 'username: "bob"'].join('\n'),
    );
  });
});
