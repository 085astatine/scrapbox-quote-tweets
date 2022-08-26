import { CoreLogger } from 'typescript-logging';
import { getNode } from './dom';
import { loggerProvider } from './logger';

const defaultLogger = loggerProvider.getCategory('lib-tweet');

export const parseTweet = (
  element: Element,
  logger: CoreLogger = defaultLogger
): bigint | null => {
  logger.info('parse tweet');
  // link node
  const linkNode = getNode(
    './/a[./time and @role="link"]/@href',
    element,
    logger
  );
  if (linkNode === null) {
    logger.info('tweet link is not found');
    return null;
  }
  const link = linkNode.nodeValue;
  logger.info(`tweet link: ${link}`);
  if (link === null) {
    logger.info('tweet link is null');
    return null;
  }
  // parse link
  const linkMatch = link.match(/\/(?<username>\w+)\/status\/(?<id>[0-9]+)/);
  const tweetID = linkMatch?.groups?.id ?? null;
  if (tweetID === null) {
    logger.warn(`failed to match: ${link}`);
    return null;
  }
  return BigInt(tweetID);
};
