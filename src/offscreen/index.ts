import browser from 'webextension-polyfill';
import { createLogger } from '~/lib/logger';
import {
  ExpandTCoURLRequestMessage,
  ExpandTCoURLResultMessage,
  ForwardToOffscreenMessage,
  GetURLTitleRequestMessage,
  GetURLTitleResultMessage,
  respondToExpandTCoURLRequest,
  respondToGetURLTitleRequest,
} from '~/lib/message';

// logger
const logger = createLogger({ prefix: '[offscreen] ' });

// runtime.onMessage
type ForwardedMessage = ExpandTCoURLRequestMessage | GetURLTitleRequestMessage;
type RequestMessage = ForwardToOffscreenMessage<ForwardedMessage>;
type ResponseMessage = ExpandTCoURLResultMessage | GetURLTitleResultMessage;

const listener = async (
  message: RequestMessage,
): Promise<ResponseMessage | void> => {
  logger.debug('on message', message);
  switch (message?.type) {
    case 'Forward/ToOffscreen':
      return await respondToForwardedMessage(message.message);
    default:
      logger.debug('skip message', message);
  }
};

browser.runtime.onMessage.addListener(listener);

// respond to Forward/ToOffscreen
const respondToForwardedMessage = async (
  message: ForwardedMessage,
): Promise<ResponseMessage | void> => {
  switch (message?.type) {
    case 'ExpandTCoURL/Request':
      return await respondToExpandTCoURLRequest(message.shortURL, logger);
    case 'GetURLTitle/Request':
      return await respondToGetURLTitleRequest(message.url, logger);
    default:
      logger.debug('unexpected forwarded message', message);
  }
};
