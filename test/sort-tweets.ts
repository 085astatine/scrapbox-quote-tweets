import { tweetIDSortFunction } from '~/lib/tweet/sort-tweets';

describe('sort-tweets/tweet-id', () => {
  test('asc', () => {
    const tweetIDs = ['11', '13', '2', '3', '5', '7', '9'];
    const expected = ['2', '3', '5', '7', '9', '11', '13'];
    expect([...tweetIDs].sort(tweetIDSortFunction('asc'))).toStrictEqual([
      ...expected,
    ]);
    expect([...tweetIDs].sort(tweetIDSortFunction('desc'))).toStrictEqual(
      [...expected].reverse(),
    );
  });
});
