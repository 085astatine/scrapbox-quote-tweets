import browser from 'webextension-polyfill';
import { Logger, logger as defaultLogger } from '~/lib/logger';

export interface Offscreen {
  exists: () => Promise<boolean>;
  open: () => Promise<void>;
  close: () => Promise<void>;
}

let opening: Promise<void> | null = null;

const setupOffscreenImpl = (logger: Logger = defaultLogger): Offscreen => {
  const url = browser.runtime.getURL('offscreen.html');

  const exists = async (): Promise<boolean> => {
    const contexts = await chrome.runtime.getContexts({
      contextTypes: [chrome.runtime.ContextType.OFFSCREEN_DOCUMENT],
      documentUrls: [url],
    });
    return contexts.length > 0;
  };

  const open = async (): Promise<void> => {
    logger.debug('open offscreen');
    if (await exists()) {
      logger.warn('offscreen is already opened');
      return;
    }
    if (opening !== null) {
      logger.warn('offscreen is currently beeing opened');
      return;
    }
    opening = chrome.offscreen.createDocument({
      url,
      reasons: [chrome.offscreen.Reason.DOM_PARSER],
      justification: 'expand t.co URL',
    });
    await opening;
    opening = null;
  };

  const close = async (): Promise<void> => {
    logger.debug('close offscreen');
    await chrome.offscreen.closeDocument();
  };
  return {
    exists,
    open,
    close,
  };
};

const setupOffscreenDummy = (): Offscreen => {
  return {
    async exists() {
      return false;
    },
    async open() {},
    async close() {},
  };
};

export const setupOffscreen: (logger?: Logger) => Offscreen =
  process.env.TARGET_BROWSER === 'chrome' ?
    setupOffscreenImpl
  : setupOffscreenDummy;
