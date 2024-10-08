import { getElement, getElements, getNode } from '~/lib/dom';
import { type Logger, logger as defaultLogger } from '~/lib/logger';
import type { TweetID } from '~/lib/tweet/types';
import { isPromotionTweet } from './tweet';

export type InsertReactRootResult = {
  tweetID: TweetID;
  reactRoot: Element;
};

export const insertReactRoot = (
  node: Node,
  url: URL,
  logger: Logger = defaultLogger,
): InsertReactRootResult[] => {
  const result: InsertReactRootResult[] = [];
  // find <article data-testid="tweet"/>
  findTweetArticles(node).forEach((element) => {
    logger.info('find <article data-testid="tweet" />');
    // find TweetID
    const tweetID = parseTweetID(element, url);
    logger.info(`tweet ID ${tweetID}`);
    if (tweetID === null) {
      return;
    }
    // create <div class="scrapbox-copy-tweets" />
    const reactRoot = createRootDiv(element, tweetID, logger);
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

const origins: readonly string[] = ['https://twitter.com', 'https://x.com'];

type URLType = 'twitter' | 'tweet' | 'other';

const matchURLType = (url: URL): URLType => {
  if (origins.includes(url.origin)) {
    const tweetLink = parseTweetLink(url);
    return tweetLink !== null ? 'tweet' : 'twitter';
  }
  return 'other';
};

const findTweetArticles = (node: Node): Element[] => {
  return getElements('.//article[@data-testid="tweet"]', node);
};

type TweetLink = {
  username: string;
  id: TweetID;
};

const parseTweetLink = (url: URL): TweetLink | null => {
  // check origin
  if (!origins.includes(url.origin)) {
    return null;
  }
  // parse username & tweet ID
  const match = url.pathname.match(/\/(?<username>\w+)\/status\/(?<id>[0-9]+)/);
  const username = match?.groups?.username;
  const id = match?.groups?.id;
  if (username !== undefined && id !== undefined) {
    return { username, id };
  }
  return null;
};

const parseTweetID = (element: Element, url: URL): string | null => {
  const urlType = matchURLType(url);
  switch (urlType) {
    case 'twitter':
      return parseTweetIdInTwitterPage(element, url);
    case 'tweet':
      return parseTweetIdInTweetPage(element, url);
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
  url: URL,
): TweetID | null => {
  // get href
  const href = getNode(
    './/a[./time and @role="link"]/@href',
    element,
  )?.nodeValue;
  if (href === undefined || href === null) {
    return null;
  }
  // parse link
  const tweetLink = parseTweetLink(new URL(href, url.origin));
  if (tweetLink === null) {
    return null;
  }
  return tweetLink.id;
};

const parseTweetIdInTweetPage = (
  element: Element,
  url: URL,
): TweetID | null => {
  // get tweet ID from <a href="..."/>
  const tweetID = parseTweetIdInTwitterPage(element, url);
  if (tweetID !== null) {
    return tweetID;
  }
  // get tweet ID from URL
  const tweetLink = parseTweetLink(url);
  if (tweetLink !== null) {
    return tweetLink.id;
  }
  return null;
};

const createRootDiv = (
  element: Element,
  tweetID: TweetID,
  logger: Logger,
): Element | null => {
  // button group
  const group = getElement('(.//div[@role="group"])[last()]', element);
  if (group === null) {
    logger.warn('<div role="group"> is not found');
    return null;
  }
  // check if this tweet is a promotion
  if (isPromotionTweet(element)) {
    logger.info('this tweet is a promotion', element);
    return null;
  }
  // check if react root exists
  if (getElement('./div[@class="scrapbox-copy-tweets"]', group) !== null) {
    logger.info('<div classse="scrapbox-copy-tweets:" /> already exists');
    return null;
  }
  // create react root
  logger.info('create <div class="scrapbox-copy-tweets" />');
  const root = group.appendChild(document.createElement('div'));
  root.classList.add('scrapbox-copy-tweets');
  root.setAttribute('tweet-id', tweetID);
  return root;
};
