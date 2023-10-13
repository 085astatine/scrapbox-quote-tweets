import browser from 'webextension-polyfill';
import { getElement, getElements, getNode } from '~/lib/dom';
import { Logger, logger as defaultLogger } from '~/lib/logger';
import {
  ExpandTCoURLRequestMessage,
  ExpandTCoURLResponseMessage,
} from '~/lib/message';
import { formatTCoURL, formatTwimgURL } from '~/lib/url';
import { parseTweetText } from './parse-tweet-text';
import {
  CardLink,
  CardSingle,
  Media,
  MediaPhoto,
  MediaVideo,
  Tweet,
  TweetID,
  User,
} from './tweet';

export const parseTweet = async (
  id: TweetID,
  element: Element,
  logger: Logger = defaultLogger,
): Promise<Tweet | null> => {
  const tweet = getElement('ancestor::article[@data-testid="tweet"]', element);
  logger.debug('tweet element', tweet);
  if (tweet === null) {
    logger.warn('<div data-testid="tweet"> is not found');
    return null;
  }
  // Tweet.timestamp
  const timestamp = parseTimestamp(tweet, logger);
  logger.debug('Tweet.timestamp', timestamp);
  if (timestamp === null) {
    logger.warn('Failed to parse Tweet.timesamp');
    return null;
  }
  // Tweet.author
  const author = parseUser(tweet, logger);
  logger.debug('Tweet.author', author);
  if (author === null) {
    logger.warn('Falied to parse Tweet.author');
    return null;
  }
  // Tweet.text
  const text = await parseTweetText(tweet, logger);
  logger.debug('Tweet.text', text);
  const result: Tweet = { id, timestamp, author, text };
  // card
  const card = await parseCardSingle(tweet, logger);
  logger.debug('Tweet.card', card);
  if (card !== null) {
    result.card = card;
  }
  // media
  const media = parseMedia(tweet, logger);
  logger.debug('Tweet.media', media);
  if (media.length) {
    result.media = media;
  }
  return result;
};

const isInQuotedTweet = (element: Element): boolean => {
  return (
    getElement('ancestor::div[div[1]/span[text()="Quote"]]', element) !== null
  );
};

const parseTimestamp = (tweet: Element, logger: Logger): number | null => {
  const datetime = getNode('.//time/@datetime', tweet);
  logger.debug('datetime attribute', datetime);
  if (datetime === null) {
    logger.warn('<time datetime="..."> is not found');
    return null;
  }
  const milliseconds = Date.parse(datetime.textContent ?? '');
  if (isNaN(milliseconds)) {
    logger.warn(`Faild to parses "${datetime}" as Date`);
  }
  return milliseconds / 1000;
};

const parseUser = (tweet: Element, logger: Logger): User | null => {
  const element = getElement('.//div[@data-testid="User-Name"]', tweet);
  logger.debug('User element', element);
  if (element === null) {
    logger.warn('<div data-testid="User-Name"> is not found');
    return null;
  }
  const name = parseUserName(element, logger);
  const username = parseUserUsername(element, logger);
  if (name === null || username === null) {
    logger.warn('Failed to parse as User', element);
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

const parseMedia = (tweet: Element, logger: Logger): Media[] => {
  const elements = getElements(
    './/div[@data-testid="tweetPhoto"]',
    tweet,
  ).filter((element) => !isInQuotedTweet(element));
  logger.debug('Media elements', elements);
  const result: Media[] = [];
  for (const element of elements) {
    switch (mediaType(element)) {
      case 'photo': {
        const photo = parseMediaPhoto(element, logger);
        logger.debug('MediaPhoto', photo);
        if (photo !== null) {
          result.push(photo);
        }
        break;
      }
      case 'video': {
        const video = parseMediaVideo(element, logger);
        logger.debug('MediaVideo', video);
        if (video !== null) {
          result.push(video);
        }
        break;
      }
      default:
        logger.warn('unknown media type', element);
    }
  }
  return result;
};

const mediaType = (element: Element): Media['type'] | null => {
  if (element.getAttribute('data-testid') === 'tweetPhoto') {
    if (getElement('.//div[@data-testid="videoPlayer"]', element) !== null) {
      return 'video';
    }
    return 'photo';
  }
  return null;
};

const parseMediaPhoto = (
  element: Element,
  logger: Logger,
): MediaPhoto | null => {
  const src = getNode('.//img/@src', element);
  logger.debug('MediaPhoto <img src="...">', src);
  if (src === null) {
    logger.warn('<img src="..."> is not found in MediaPhoto');
    return null;
  }
  return { type: 'photo', url: formatTwimgURL(src.textContent ?? '') };
};

const parseMediaVideo = (
  element: Element,
  logger: Logger,
): MediaVideo | null => {
  const poster = getElement('.//video/@poster', element);
  logger.debug('MediaVideo <video poster="...">', poster);
  if (poster === null) {
    logger.warn('<video poster="..."> is not found in MediaVideo');
    return null;
  }
  return { type: 'video', thumbnail: poster.textContent ?? '' };
};

const parseCardSingle = async (
  tweet: Element,
  logger: Logger,
): Promise<CardSingle | null> => {
  const element = getElement('.//div[@data-testid="card.wrapper"]', tweet);
  if (element === null) {
    return null;
  }
  const media = getNode('.//img/@src | .//video/@poster', element)?.textContent;
  if (!media) {
    logger.warn('<img src="..."> or <video poster="..."> is not found in card');
    return null;
  }
  const link = await parseCardLink(
    getNode('.//a/@href', element)?.textContent,
    logger,
  );
  return {
    type: 'single',
    ...(link !== null ? { link } : {}),
    media_url: media,
  };
};

const parseCardLink = async (
  href: string | undefined | null,
  logger: Logger,
): Promise<CardLink | null> => {
  if (!href) {
    return null;
  }
  const url = formatTCoURL(href);
  // request expand https://t.co/...
  const request: ExpandTCoURLRequestMessage = {
    type: 'ExpandTCoURL/Request',
    shortURL: url,
  };
  logger.debug('Request to expand t.co URL', request);
  const { expandedURL, title } = await browser.runtime
    .sendMessage(request)
    .then((response: ExpandTCoURLResponseMessage) => {
      logger.debug('Response to request', response);
      if (response?.type === 'ExpandTCoURL/Response') {
        if (response?.ok) {
          const { expandedURL, title } = response;
          return { expandedURL, title };
        }
      } else {
        logger.warn('Unexpected response message', response);
      }
      return { expandedURL: url };
    });
  return {
    url,
    expanded_url: expandedURL,
    ...(title !== undefined ? { title } : []),
  };
};
