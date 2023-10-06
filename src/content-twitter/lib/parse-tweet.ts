import { getElement, getElements, getNode } from '@lib/dom';
import { Logger, logger as defaultLogger } from '@lib/logger';
import { parseTweetText } from './parse-tweet-text';
import { Card, Media, MediaPhoto, MediaVideo, User } from './tweet';

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
  // timestamp
  const timestamp = parseTimestamp(tweet, logger);
  logger.debug('timestamp', timestamp);
  // user
  const user = parseUser(tweet, logger);
  logger.debug('user', user);
  // text
  const text = parseTweetText(tweet, logger);
  logger.debug('text', text);
  // card
  const card = parseCard(tweet, logger);
  logger.debug('card', card);
  // media
  const media = parseMedia(tweet, logger);
  logger.debug('media', media);
};

const findTweet = (element: Element, logger: Logger): Element | null => {
  logger.debug('find ancestor::article[@data-testid="tweet"]');
  return getElement('ancestor::article[@data-testid="tweet"]', element);
};

const parseTimestamp = (tweet: Element, logger: Logger): number | null => {
  const element = getElement('.//time', tweet);
  logger.debug('timestamp', element);
  if (element === null) {
    logger.warn('Timestamp is not found');
    return null;
  }
  const datetime = element.getAttribute('datetime');
  if (datetime === null) {
    logger.warn('datetime attribute is not found');
    return null;
  }
  const milliseconds = Date.parse(datetime);
  if (isNaN(milliseconds)) {
    logger.warn(`Faild to parses "${datetime}" as Date`);
  }
  return milliseconds / 1000;
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
  const elements = getElements('.//div[@data-testid="tweetPhoto"]', tweet);
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
  const img = getElement('.//img[@src]', element);
  logger.debug('MediaPhoto <img src="...">', img);
  if (img === null) {
    logger.warn('<img src="..."> is not found in MediaPhoto');
    return null;
  }
  const src = img.getAttribute('src') ?? '';
  return { type: 'photo', url: parseMediaPhotoURL(src) };
};

const parseMediaPhotoURL = (src: string): string => {
  try {
    const url = new URL(src);
    const format = url.searchParams.get('format');
    if (format !== null) {
      return `${url.origin}${url.pathname}.${format}`;
    }
  } catch (error) {
    if (!(error instanceof TypeError)) {
      throw error;
    }
  }
  return src;
};

const parseMediaVideo = (
  element: Element,
  logger: Logger,
): MediaVideo | null => {
  const video = getElement('.//video[@poster]', element);
  logger.debug('MediaVideo <video poster="...">', video);
  if (video === null) {
    logger.warn('<video poster="..."> is not found in MediaVideo');
    return null;
  }
  const thumbnail = video.getAttribute('poster') ?? '';
  return { type: 'video', thumbnail };
};

const parseCard = (tweet: Element, logger: Logger): Card | null => {
  const element = getElement('.//div[@data-testid="card.wrapper"]', tweet);
  if (element === null) {
    return null;
  }
  const link = getNode('.//a/@href', element)?.textContent;
  if (!link) {
    logger.warn('<a href="..."> is not found in card');
    return null;
  }
  const image = getNode('.//img/@src', element)?.textContent;
  if (!image) {
    logger.warn('<img src="..."> is not found in card');
    return null;
  }
  return {
    link_url: link,
    image_url: image,
  };
};
