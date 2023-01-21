import browser from 'webextension-polyfill';
import { logger } from './logger';

export interface ClipboardWindow {
  parentTabID: number;
  windowID: number;
  tabID: number;
}

export const setupClipboardWindows = () => {
  const clipboards: ClipboardWindow[] = [];

  return {
    async open(parentTabID: number | undefined): Promise<void> {
      logger.debug(`open clipboard in tab(ID=${parentTabID})`);
      if (parentTabID === undefined) {
        return;
      }
      // create clipboard window
      return browser.windows
        .create({
          url: browser.runtime.getURL('clipboard.html'),
          type: 'popup',
        })
        .then((window) => {
          const windowID = getWindowID(window);
          if (windowID !== undefined) {
            clipboards.push({ parentTabID, ...windowID });
          }
        });
    },
  };
};

const getWindowID = (
  window: browser.Windows.Window
): Pick<ClipboardWindow, 'windowID' | 'tabID'> | undefined => {
  const windowID = window.id;
  const tabID = window.tabs?.[0]?.id;
  if (windowID !== undefined && tabID !== undefined) {
    return { windowID, tabID };
  }
  return undefined;
};
