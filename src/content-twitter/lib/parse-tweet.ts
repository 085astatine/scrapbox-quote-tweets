import { getElement } from '@lib/dom';
import { Logger, logger as defaultLogger } from '@lib/logger';
import { User } from './tweet';

export const parseTweet = (
  element: Element,
  logger: Logger = defaultLogger,
): void => {
  const tweet = findTweet(element, logger);
  logger.debug('tweet', tweet);
  if (tweet === null) {
    logger.warn('Tweet is not found');
    return;
  }
  // timestamp
  const timestamp = parseTimestamp(tweet, logger);
  logger.debug('timestamp', timestamp);
  // user
  const user = parseUser(tweet, logger);
  logger.debug('user', user);
};

const findTweet = (element: Element, logger: Logger): Element | null => {
  logger.debug('find ancestor::article[@data-testid="tweet"]');
  return getElement('ancestor::article[@data-testid="tweet"]', element);
};

const parseTimestamp = (tweet: Element, logger: Logger): number | null => {
  const element = getElement('.//time', tweet);
  logger.debug('timestamp', element);
  if (element === null) {
    logger.warn('Timestamp is not found');
    return null;
  }
  const datetime = element.getAttribute('datetime');
  if (datetime === null) {
    logger.warn('datetime attribute is not found');
    return null;
  }
  const milliseconds = Date.parse(datetime);
  if (isNaN(milliseconds)) {
    logger.warn(`Faild to parses "${datetime}" as Date`);
  }
  return milliseconds / 1000;
};

const parseUser = (tweet: Element, logger: Logger): User | null => {
  const user = getElement('.//div[@data-testid="User-Name"]', tweet);
  logger.debug('User-Name', user);
  if (user === null) {
    logger.warn('User-Name is not found');
    return null;
  }
  const name = parseUserName(user, logger);
  const username = parseUserUsername(user, logger);
  if (name === null || username === null) {
    logger.warn('Failed to parse User');
    return null;
  }
  return { name, username };
};

const parseUserName = (user: Element, logger: Logger): string | null => {
  const element = getElement('./div[1]//a', user);
  logger.debug('User.name', element);
  if (element === null) {
    logger.warn('User.name is not found');
    return null;
  }
  // traverse DOM tree
  return traverseUserName(element);
};

const traverseUserName = (element: Element): string => {
  if (element.childElementCount === 0) {
    if (element.tagName === 'SPAN') {
      return element.textContent ?? '';
    } else if (element.tagName === 'IMG') {
      return element.getAttribute('alt') ?? '';
    }
    return '';
  } else {
    return [...element.children]
      .map((child) => traverseUserName(child))
      .join('');
  }
};

const parseUserUsername = (user: Element, logger: Logger): string | null => {
  const element = getElement('./div[2]/div/div[1]//a', user);
  logger.debug('User.username', element);
  if (element === null) {
    logger.warn('User.username is not found');
    return null;
  }
  const username = element.textContent;
  if (username === null) {
    return null;
  }
  return username.replace(/^@/, '');
};
