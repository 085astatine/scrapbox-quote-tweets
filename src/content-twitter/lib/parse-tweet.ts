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
  // user
  const user = parseUser(tweet, logger);
  logger.debug('user', user);
};

const findTweet = (element: Element, logger: Logger): Element | null => {
  logger.debug('find ancestor::article[@data-testid="tweet"]');
  return getElement('ancestor::article[@data-testid="tweet"]', element);
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
  return element.textContent;
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
