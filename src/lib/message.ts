import browser from 'webextension-polyfill';
import { Logger } from './logger';
import { Offscreen } from './offscreen';
import { expandTCoURL, getURLTitle } from './url';

export interface ExpandTCoURLRequestMessage {
  type: 'ExpandTCoURL/Request';
  shortURL: string;
}

export interface ExpandTCoURLSuccessMessage {
  type: 'ExpandTCoURL/Response';
  ok: true;
  shortURL: string;
  expandedURL: string;
  title?: string;
}

export interface ExpandTCoURLFailureMessage {
  type: 'ExpandTCoURL/Response';
  ok: false;
  shortURL: string;
}

export type ExpandTCoURLResponseMessage =
  | ExpandTCoURLSuccessMessage
  | ExpandTCoURLFailureMessage;

export interface ForwardToOffscreenMessage<Message> {
  type: 'Forward/ToOffscreen';
  message: Message;
}

export interface GetURLTitleRequestMessage {
  type: 'GetURLTitle/Request';
  url: string;
}

export interface GetURLTitleSuccessMessage {
  type: 'GetURLTitle/Response';
  ok: true;
  url: string;
  title: string;
}

export interface GetURLTitleFailureMessage {
  type: 'GetURLTitle/Response';
  ok: false;
  url: string;
}

export type GetURLTitleResponseMessage =
  | GetURLTitleSuccessMessage
  | GetURLTitleFailureMessage;

export interface SettingsDownloadStorageMessage {
  type: 'Settings/DownloadStorage';
}

// Respond to ExpandTCoURL/Request
export const respondToExpandTCoURLRequest = async (
  shortURL: string,
  logger: Logger,
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
    ...(title !== null && { title }),
  };
};

// Respond to GetURLTitle/Request
export const respondToGetURLTitleRequest = async (
  url: string,
  logger: Logger,
): Promise<GetURLTitleResponseMessage> => {
  const title = await getURLTitle(url, logger);
  if (title === null) {
    return {
      type: 'GetURLTitle/Response',
      ok: false,
      url,
    };
  }
  return {
    type: 'GetURLTitle/Response',
    ok: true,
    url,
    title,
  };
};

// Forward message to offscreen
export async function forwardMessageToOffscreen(
  offscreen: Offscreen,
  message: ExpandTCoURLRequestMessage,
  logger: Logger,
): Promise<ExpandTCoURLResponseMessage>;

export async function forwardMessageToOffscreen(
  offscreen: Offscreen,
  message: GetURLTitleRequestMessage,
  logger: Logger,
): Promise<GetURLTitleResponseMessage>;

export async function forwardMessageToOffscreen(
  offscreen: Offscreen,
  message: ExpandTCoURLRequestMessage | GetURLTitleRequestMessage,
  logger: Logger,
): Promise<ExpandTCoURLResponseMessage | GetURLTitleResponseMessage> {
  await offscreen.open();
  logger.debug('forward to offscreen', message);
  const request = {
    type: 'Forward/ToOffscreen',
    message,
  };
  const response = await browser.runtime.sendMessage(request);
  logger.debug('response from offscreen', response);
  await offscreen.close();
  return response;
}
