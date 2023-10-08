import { Logger, logger as defaultLogger } from '~/lib/logger';

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
