import browser from 'webextension-polyfill';
import { createLogger } from '~/lib/logger';
import {
  type ExpandTCoURLResultMessage,
  type GetURLTitleResultMessage,
  isExpandTCoURLRequestMessage,
  isForwardToOffscreenMessage,
  isGetURLTitleRequestMessage,
  respondToExpandTCoURLRequest,
  respondToGetURLTitleRequest,
} from '~/lib/message';

// logger
const logger = createLogger({ prefix: '[offscreen] ' });

// runtime.onMessage
const listener = async (
  message: unknown,
): Promise<ExpandTCoURLResultMessage | GetURLTitleResultMessage | void> => {
  logger.debug('on message', message);
  if (isForwardToOffscreenMessage(message)) {
    return await respondToForwardedMessage(message.message);
  } else {
    logger.debug('skip message', message);
  }
};

browser.runtime.onMessage.addListener(listener);

// respond to Forward/ToOffscreen
const respondToForwardedMessage = async (
  message: unknown,
): Promise<ExpandTCoURLResultMessage | GetURLTitleResultMessage | void> => {
  if (
    !isExpandTCoURLRequestMessage(message) &&
    !isGetURLTitleRequestMessage(message)
  ) {
    logger.debug('unexpected forwarded message', message);
    return;
  }
  switch (message?.type) {
    case 'ExpandTCoURL/Request':
      return await respondToExpandTCoURLRequest(message.shortURL, logger);
    case 'GetURLTitle/Request':
      return await respondToGetURLTitleRequest(message.url, logger);
    default:
      logger.debug('unexpected forwarded message', message);
  }
};
