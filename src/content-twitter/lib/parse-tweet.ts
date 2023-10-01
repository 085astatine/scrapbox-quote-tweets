import { getElement } from '@lib/dom';
import { Logger, logger as defaultLogger } from '@lib/logger';

export const parseTweet = (
  element: Element,
  logger: Logger = defaultLogger,
): void => {
  const tweet = findTweet(element, logger);
  logger.debug('tweet', tweet);
};

const findTweet = (element: Element, logger: Logger): Element | null => {
  logger.debug('find ancestor::article[@data-testid="tweet"]');
  return getElement('ancestor::article[@data-testid="tweet"]', element);
};
