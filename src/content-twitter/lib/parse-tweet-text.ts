import browser from 'webextension-polyfill';
import { getElement, isHTMLElement } from '~/lib/dom';
import { Logger, logger as defaultLogger } from '~/lib/logger';
import {
  ExpandTCoURLRequestMessage,
  ExpandTCoURLResponseMessage,
} from '~/lib/message';
import { formatTCoURL } from '~/lib/url';
import {
  TweetEntity,
  TweetEntityCashtag,
  TweetEntityHashtag,
  TweetEntityMention,
  TweetEntityText,
  TweetEntityURL,
} from './tweet';

export const parseTweetText = async (
  tweet: Element,
  logger: Logger = defaultLogger,
): Promise<TweetEntity[]> => {
  const element = getElement('.//div[@data-testid="tweetText"]', tweet);
  logger.debug('Text <div data-testid="tweetText">', element);
  if (element === null) {
    logger.warn('<div data-testid="tweetText"> is not found');
    return [];
  }
  const result: TweetEntity[] = [];
  for (const child of element.children) {
    const type = entityType(child);
    if (type === null) {
      logger.warn('Unknown entity type', child);
      continue;
    }
    const entity = await entityParsers[type](child, logger);
    logger.debug('parsed entity', entity);
    if (entity === null) {
      logger.warn('Failed to parse as TweetEntity', child);
      continue;
    }
    // connect text entity
    const tail = result.slice(-1)[0];
    if (entity.type === 'text' && tail?.type === 'text') {
      tail.text += entity.text;
    } else {
      result.push(entity);
    }
  }
  return result;
};

type EntityType = TweetEntity['type'] | 'emoji';

const entityType = (entity: Element): EntityType | null => {
  const entityXPaths: ReadonlyArray<readonly [EntityType, string]> = [
    ['mention', 'self::div[span/a[starts-with(text(), "@")]]'],
    [
      'hashtag',
      'self::span[a[starts-with(@href, "/hashtag/") and starts-with(text(), "#")]]',
    ],
    [
      'cashtag',
      'self::span[a[starts-with(@href, "/search") and starts-with(text(), "$")]]',
    ],
    ['url', 'self::a[starts-with(@href, "https://t.co/")]'],
    ['emoji', 'self::img[@alt]'],
    ['text', 'self::span'],
  ] as const;
  for (const [type, xpath] of entityXPaths) {
    if (getElement(xpath, entity) !== null) {
      return type;
    }
  }
  return null;
};

const parseEntityText = async (
  entity: Element,
  logger: Logger,
): Promise<TweetEntityText | null> => {
  logger.debug('Text entity element', entity);
  const text = entity.textContent ?? '';
  return { type: 'text', text };
};

const parseEntityEmoji = async (
  entity: Element,
  logger: Logger,
): Promise<TweetEntityText | null> => {
  logger.debug('Emoji entity element', entity);
  const text = entity.getAttribute('alt') ?? '';
  return { type: 'text', text };
};

const parseEntityURL = async (
  entity: Element,
  logger: Logger,
): Promise<TweetEntityURL | null> => {
  logger.debug('URL entity element', entity);
  const shortURL = formatTCoURL(entity.getAttribute('href') ?? '');
  const text = [...entity.childNodes]
    .map((node) => {
      // text node
      if (node.nodeName === '#text') {
        return node.textContent;
      }
      // visible HTML element
      if (isHTMLElement(node)) {
        if (node.offsetWidth || node.offsetHeight) {
          return node.textContent;
        }
      }
      return '';
    })
    .join('');
  // request expand https://t.co/...
  const requestMessage: ExpandTCoURLRequestMessage = {
    type: 'ExpandTCoURL/Request',
    shortURL,
  };
  logger.debug('Request to expand t.co URL', requestMessage);
  const responseMessage: ExpandTCoURLResponseMessage =
    await browser.runtime.sendMessage(requestMessage);
  logger.debug('Response to request', responseMessage);
  if (responseMessage?.type !== 'ExpandTCoURL/Response') {
    logger.warn('Unexpected response message', responseMessage);
  }
  return { type: 'url', short_url: shortURL, text };
};

const parseEntityHashtag = async (
  entity: Element,
  logger: Logger,
): Promise<TweetEntityHashtag | null> => {
  logger.debug('Hashtag entity element', entity);
  const text = entity.textContent;
  if (text === null || !text.startsWith('#')) {
    logger.warn('Hashtag entity text does not match', text);
    return null;
  }
  const tag = text.replace(/^#/, '');
  return { type: 'hashtag', text, tag };
};

const parseEntityCashtag = async (
  entity: Element,
  logger: Logger,
): Promise<TweetEntityCashtag | null> => {
  logger.debug('Cashtag entity element', entity);
  const text = entity.textContent;
  if (text === null || !text.startsWith('$')) {
    logger.warn('Mention entity text does not match', text);
    return null;
  }
  const tag = text.replace(/^\$/, '');
  return { type: 'cashtag', text, tag };
};

const parseEntityMention = async (
  entity: Element,
  logger: Logger,
): Promise<TweetEntityMention | null> => {
  logger.debug('Mention entity element', entity);
  const text = entity.textContent;
  if (text === null || !text.startsWith('@')) {
    logger.warn('Mention entity text does not match', text);
    return null;
  }
  const username = text.replace(/^@/, '');
  return { type: 'mention', text, username };
};

const entityParsers: {
  [key in EntityType]: (
    element: Element,
    logger: Logger,
  ) => Promise<TweetEntity | null>;
} = {
  text: parseEntityText,
  emoji: parseEntityEmoji,
  url: parseEntityURL,
  hashtag: parseEntityHashtag,
  cashtag: parseEntityCashtag,
  mention: parseEntityMention,
} as const;
