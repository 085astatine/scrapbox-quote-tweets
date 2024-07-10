import browser from 'webextension-polyfill';
import type { Logger } from './logger';
import type { Offscreen } from './offscreen';
import { expandTCoURL, getURLTitle } from './url';

export interface ExpandTCoURLRequestMessage {
  type: 'ExpandTCoURL/Request';
  shortURL: string;
}

export interface ExpandTCoURLSuccessMessage {
  type: 'ExpandTCoURL/Result';
  ok: true;
  shortURL: string;
  expandedURL: string;
  title?: string;
}

export interface ExpandTCoURLFailureMessage {
  type: 'ExpandTCoURL/Result';
  ok: false;
  shortURL: string;
}

export type ExpandTCoURLResultMessage =
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
  type: 'GetURLTitle/Result';
  ok: true;
  url: string;
  title: string;
}

export interface GetURLTitleFailureMessage {
  type: 'GetURLTitle/Result';
  ok: false;
  url: string;
}

export type GetURLTitleResultMessage =
  | GetURLTitleSuccessMessage
  | GetURLTitleFailureMessage;

export interface SettingsDownloadStorageMessage {
  type: 'Settings/DownloadStorage';
}

// Respond to ExpandTCoURL/Request
export const respondToExpandTCoURLRequest = async (
  shortURL: string,
  logger: Logger,
): Promise<ExpandTCoURLResultMessage> => {
  // expand https://t.co/...
  const expandedURL = await expandTCoURL(shortURL, logger);
  if (expandedURL === null) {
    return {
      type: 'ExpandTCoURL/Result',
      ok: false,
      shortURL,
    };
  }
  // get title
  const title = await getURLTitle(expandedURL, logger);
  return {
    type: 'ExpandTCoURL/Result',
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
): Promise<GetURLTitleResultMessage> => {
  const title = await getURLTitle(url, logger);
  if (title === null) {
    return {
      type: 'GetURLTitle/Result',
      ok: false,
      url,
    };
  }
  return {
    type: 'GetURLTitle/Result',
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
): Promise<ExpandTCoURLResultMessage>;

export async function forwardMessageToOffscreen(
  offscreen: Offscreen,
  message: GetURLTitleRequestMessage,
  logger: Logger,
): Promise<GetURLTitleResultMessage>;

export async function forwardMessageToOffscreen(
  offscreen: Offscreen,
  message: ExpandTCoURLRequestMessage | GetURLTitleRequestMessage,
  logger: Logger,
): Promise<ExpandTCoURLResultMessage | GetURLTitleResultMessage> {
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
