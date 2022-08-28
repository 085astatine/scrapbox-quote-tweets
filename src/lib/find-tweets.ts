import { CoreLogger } from 'typescript-logging';
import { getNode, isElement } from './dom';
import { loggerProvider } from './logger';

const defaultLogger = loggerProvider.getCategory('lib-tweet');

export interface FindTweetResult {
  tweetID: bigint;
  reactRoot: Element;
}

export const findTweets = (
  node: Node,
  logger: CoreLogger = defaultLogger
): FindTweetResult[] => {
  logger.info('find tweets');
  const result: FindTweetResult[] = [];
  // find <article data-testid="tweet"/>
  findTweetArticles(node).forEach((element) => {
    // find TweetID
    const tweetID = parseTweetID(element, logger);
    if (tweetID === null) {
      return;
    }
    // create <div scrapbox-copy-tweets="copy"/>
    const reactRoot = createRootDiv(element, logger);
    if (reactRoot === null) {
      return;
    }
    result.push({
      tweetID,
      reactRoot,
    });
  });
  return result;
};

const findTweetArticles = (node: Node): Element[] => {
  const articles = [];
  const xpathResult = document.evaluate(
    './/article[@data-testid="tweet"]',
    node,
    null,
    XPathResult.ORDERED_NODE_ITERATOR_TYPE,
    null
  );
  let article: Node | null;
  while ((article = xpathResult.iterateNext())) {
    if (isElement(article)) {
      articles.push(article);
    }
  }
  return articles;
};

interface TweetLink {
  username: string;
  id: bigint;
}

const parseTweetLink = (link: string): TweetLink | null => {
  const match = link.match(/\/(?<username>\w+)\/status\/(?<id>[0-9]+)/);
  const username = match?.groups?.username;
  const id = match?.groups?.id;
  if (username !== undefined && id !== undefined) {
    return { username, id: BigInt(id) };
  }
  return null;
};

const parseTweetID = (element: Element, logger: CoreLogger): bigint | null => {
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
  const tweetLink = parseTweetLink(link);
  if (tweetLink === null) {
    logger.warn(`failed to match: ${link}`);
    return null;
  }
  return tweetLink.id;
};

const createRootDiv = (
  element: Element,
  logger: CoreLogger
): Element | null => {
  // button group
  const xpathResult = document.evaluate(
    '(.//div[@role="group"])[last()]',
    element,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  );
  const group = xpathResult.singleNodeValue;
  if (group === null) {
    logger.warn('<div role="group"> is not found');
    return null;
  }
  // check if react root exists
  if (getNode('./div[@scrapbox-copy-tweets="copy"]', group, logger) !== null) {
    logger.info('root <div/> already exists');
    return null;
  }
  // create react root <div scrapbox-copy-tweets="copy"/>
  logger.info('create <div scrapbox-copy-tweets="copy"/>');
  const root = group.appendChild(document.createElement('div'));
  root.setAttribute('scrapbox-copy-tweets', 'copy');
  return root;
};
