import { CoreLogger } from 'typescript-logging';
import { getNode, isElement } from './dom';
import { loggerProvider } from './logger';
import { TweetID } from './tweet';

const defaultLogger = loggerProvider.getCategory('lib-tweet');

export interface FindTweetResult {
  tweetID: TweetID;
  reactRoot: Element;
}

export const findTweets = (
  node: Node,
  url: string,
  logger: CoreLogger = defaultLogger
): FindTweetResult[] => {
  logger.info('find tweets');
  const result: FindTweetResult[] = [];
  // find <article data-testid="tweet"/>
  findTweetArticles(node).forEach((element) => {
    // find TweetID
    const tweetID = parseTweetID(element, url, logger);
    if (tweetID === null) {
      return;
    }
    // create <div class="scrapbox-copy-tweets" />
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

type URLType = 'twitter' | 'tweet' | 'other';

const matchURLType = (url: string): URLType => {
  const host = 'https://twitter.com';
  if (url.startsWith(host)) {
    const tweetLink = parseTweetLink(url.slice(host.length));
    return tweetLink !== null ? 'tweet' : 'twitter';
  }
  return 'other';
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
  id: TweetID;
}

const parseTweetLink = (link: string): TweetLink | null => {
  const match = link.match(/\/(?<username>\w+)\/status\/(?<id>[0-9]+)/);
  const username = match?.groups?.username;
  const id = match?.groups?.id;
  if (username !== undefined && id !== undefined) {
    return { username, id };
  }
  return null;
};

const parseTweetID = (
  element: Element,
  url: string,
  logger: CoreLogger
): string | null => {
  const urlType = matchURLType(url);
  switch (urlType) {
    case 'twitter':
      return parseTweetIdInTwitterPage(element, logger);
    case 'tweet':
      return parseTweetIdInTweetPage(element, url, logger);
    case 'other':
      return null;
    default: {
      const _: never = urlType;
      return _;
    }
  }
};

const parseTweetIdInTwitterPage = (
  element: Element,
  logger: CoreLogger
): TweetID | null => {
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

const parseTweetIdInTweetPage = (
  element: Element,
  url: string,
  logger: CoreLogger
): TweetID | null => {
  // get tweet ID from <a href="..."/>
  const tweetID = parseTweetIdInTwitterPage(element, logger);
  if (tweetID !== null) {
    return tweetID;
  }
  // get tweet ID from URL
  const host = 'https://twitter.com';
  if (url.startsWith(host)) {
    const tweetLink = parseTweetLink(url.slice(host.length));
    if (tweetLink !== null) {
      return tweetLink.id;
    }
  }
  return null;
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
  if (getNode('./div[@class="scrapbox-copy-tweets"]', group, logger) !== null) {
    logger.info('root <div/> already exists');
    return null;
  }
  // create react root
  logger.info('create <div class="scrapbox-copy-tweets" />');
  const root = group.appendChild(document.createElement('div'));
  root.classList.add('scrapbox-copy-tweets');
  return root;
};
