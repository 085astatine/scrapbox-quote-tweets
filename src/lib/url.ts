import punycode from 'punycode';
import { type Logger, logger as defaultLogger } from '~/lib/logger';

export const isTCoURL = (url: string): boolean => {
  try {
    return new URL(url).hostname === 't.co';
  } catch (error) {
    if (!(error instanceof TypeError)) {
      throw error;
    }
  }
  return false;
};

export const formatTCoURL = (url: string): string => {
  try {
    const address = new URL(url);
    if (address.hostname === 't.co') {
      return `${address.origin}${address.pathname}`;
    }
  } catch (error) {
    if (!(error instanceof TypeError)) {
      throw error;
    }
  }
  return url;
};

export const expandTCoURL = async (
  url: string,
  logger: Logger = defaultLogger,
): Promise<string | null> => {
  logger.debug(`expand ${url}`);
  if (!isTCoURL(url)) {
    logger.warn(`URL("${url}") is not 'https:/t.co/...'`);
    return null;
  }
  const expandedURL = await fetch(url)
    .then((response) => response.text())
    .then((text) => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(text, 'text/html');
      return dom.title;
    })
    .catch((error) => {
      logger.warn(`Failed to expand "${url}"`, error);
      return null;
    });
  logger.debug(`Expanded URL is "${expandedURL}"`);
  return expandedURL;
};

export const formatTwimgURL = (url: string): string => {
  try {
    const address = new URL(url);
    if (address.hostname === 'pbs.twimg.com') {
      const format = address.searchParams.get('format');
      if (format !== null) {
        return `${address.origin}${address.pathname}.${format}`;
      }
    }
  } catch (error) {
    if (!(error instanceof TypeError)) {
      throw error;
    }
  }
  return url;
};

export const getURLTitle = async (
  url: string,
  logger: Logger = defaultLogger,
): Promise<string | null> => {
  logger.debug(`Get the title of ${url}`);
  // check Content-Type is text/html
  const isHTML = await fetch(url, { method: 'HEAD' })
    .then((response) => {
      const contentType = response.headers.get('Content-Type');
      logger.debug('Get the Content-Type of URL', { url, contentType });
      return contentType?.startsWith('text/html');
    })
    .catch((error) => {
      logger.warn(`Failed to fetch to URL(${url})`, error);
      return false;
    });
  if (!isHTML) {
    logger.debug(`"${url}" is not text/html`);
    return null;
  }
  // get title
  const title = await fetch(url)
    .then((response) => response.text())
    .then((text) => {
      const parser = new DOMParser();
      const head = parser.parseFromString(text, 'text/html');
      return head.title;
    })
    .catch((error) => {
      logger.warn(`Failed to access to URL(${url})`, error);
      return null;
    });
  logger.debug('Get the title of URL', { url, title });
  return title;
};

export const decodeURL = (url: string): string => {
  try {
    const host = new URL(url).host;
    return decodeURI(url).replace(host, punycode.toUnicode(host));
  } catch (error) {
    if (!(error instanceof TypeError) || !(error instanceof URIError)) {
      throw error;
    }
  }
  return url;
};
