import { CoreLogger } from 'typescript-logging';
import { loggerProvider } from './logger';

const defaultLogger = loggerProvider.getCategory('lib-tweet');

export const parseTweet = (
  element: Element,
  logger: CoreLogger = defaultLogger
): null => {
  logger.info('parse tweet');
  return null;
};
