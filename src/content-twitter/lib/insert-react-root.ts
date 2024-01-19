import { getElement, getElements, getNode } from '~/lib/dom';
import { Logger, logger as defaultLogger } from '~/lib/logger';
import { TweetID } from '~/lib/tweet/tweet';

export interface InsertReactRootResult {
  tweetID: TweetID;
  reactRoot: Element;
}

export const insertReactRoot = (
  node: Node,
  url: string,
  logger: Logger = defaultLogger,
): InsertReactRootResult[] => {
  const result: InsertReactRootResult[] = [];
  // find <article data-testid="tweet"/>
  findTweetArticles(node).forEach((element) => {
    logger.info('find <article data-test-id="tweet" />');
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
  return getElements('.//article[@data-testid="tweet"]', node);
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

const parseTweetID = (element: Element, url: string): string | null => {
  const urlType = matchURLType(url);
  switch (urlType) {
    case 'twitter':
      return parseTweetIdInTwitterPage(element);
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

const parseTweetIdInTwitterPage = (element: Element): TweetID | null => {
  // link node
  const linkNode = getNode('.//a[./time and @role="link"]/@href', element);
  if (linkNode === null) {
    return null;
  }
  const link = linkNode.nodeValue;
  if (link === null) {
    return null;
  }
  // parse link
  const tweetLink = parseTweetLink(link);
  if (tweetLink === null) {
    return null;
  }
  return tweetLink.id;
};

const parseTweetIdInTweetPage = (
  element: Element,
  url: string,
): TweetID | null => {
  // get tweet ID from <a href="..."/>
  const tweetID = parseTweetIdInTwitterPage(element);
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
  tweetID: TweetID,
  logger: Logger,
): Element | null => {
  // button group
  const group = getElement('(.//div[@role="group"])[last()]', element);
  if (group === null) {
    logger.warn('<div role="group"> is not found');
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
