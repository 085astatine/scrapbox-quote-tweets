import browser from 'webextension-polyfill';
import { logger } from '~/lib/logger';
import {
  ExpandTCoURLRequestMessage,
  ExpandTCoURLResponseMessage,
  ForwardToOffscreenMessage,
} from '~/lib/message';
import { expandTCoURL, getURLTitle } from '~/lib/url';

// runtime.onMessage
type ForwardedMessage = ExpandTCoURLRequestMessage;
type RequestMessage = ForwardToOffscreenMessage<ForwardedMessage>;
type ResponseMessage = ExpandTCoURLResponseMessage;

const listener = async (
  message: RequestMessage,
): Promise<ResponseMessage | void> => {
  logger.debug('[offscreen] on message', message);
  switch (message?.type) {
    case 'Forward/ToOffscreen':
      return await respondToForwardedMessage(message.message);
    default:
      logger.debug('[offscreen] skip message', message);
  }
};

browser.runtime.onMessage.addListener(listener);

// respond to Forward/ToOffscreen
const respondToForwardedMessage = async (
  message: ForwardedMessage,
): Promise<ResponseMessage | void> => {
  switch (message?.type) {
    case 'ExpandTCoURL/Request':
      return await respondToExpandTCoURLRequest(message.shortURL);
    default:
      logger.debug('[offscreen] unexpected forwarded message', message);
  }
};

// respond to ExpandTCoURL/Request
const respondToExpandTCoURLRequest = async (
  shortURL: string,
): Promise<ExpandTCoURLResponseMessage> => {
  // expand https://t.co/...
  const expandedURL = await expandTCoURL(shortURL, logger);
  if (expandedURL === null) {
    return {
      type: 'ExpandTCoURL/Response',
      ok: false,
      shortURL,
    };
  }
  // get title
  const title = await getURLTitle(expandedURL, logger);
  return {
    type: 'ExpandTCoURL/Response',
    ok: true,
    shortURL,
    expandedURL,
    ...(title !== null ? { title } : {}),
  };
};
