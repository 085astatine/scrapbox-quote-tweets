import {
  UnexpectedPlaceholderError,
  tweetTemplateParser,
} from '../src/lib/tweet-template';

describe('tweet-template/tweet', () => {
  test('parse', () => {
    const template = '>[${tweet.id} @${user.username}]';
    const expected = [
      { type: 'text', text: '>[' },
      { type: 'placeholder', field: 'tweet.id' },
      { type: 'text', text: ' @' },
      { type: 'placeholder', field: 'user.username' },
      { type: 'text', text: ']' },
    ];
    expect(tweetTemplateParser.tweet(template)).toStrictEqual(expected);
  });
  test('excaped_placeholder', () => {
    const template = '>[\\${tweet.id} @${user.username}]';
    const expected = [
      { type: 'text', text: '>[\\${tweet.id} @' },
      { type: 'placeholder', field: 'user.username' },
      { type: 'text', text: ']' },
    ];
    expect(tweetTemplateParser.tweet(template)).toStrictEqual(expected);
  });
  test('unexpected_field', () => {
    const template = '>[${tweet.id} @${user.usrname}]';
    try {
      expect(tweetTemplateParser.tweet(template)).toThrow(
        UnexpectedPlaceholderError
      );
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(UnexpectedPlaceholderError);
      if (error instanceof UnexpectedPlaceholderError) {
        expect(error.field).toBe('user.usrname');
      }
    }
  });
});
