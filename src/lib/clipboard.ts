import browser from 'webextension-polyfill';
import { logger } from './logger';

interface ClipboardWindow {
  parentTabID: number | undefined;
  windowID: number;
  tabID: number;
}

export interface ClipboardWindows {
  open(parentTabID: number | undefined): Promise<void>;
  close(tabID: number | undefined): Promise<void>;
  onTabRemoved(tabID: number): void;
}

export const setupClipboardWindows = (): ClipboardWindows => {
  const clipboards: ClipboardWindow[] = [];

  // open clipboard
  const open = async (parentTabID: number | undefined): Promise<void> => {
    logger.debug(`open clipboard in tab(ID=${parentTabID})`);
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
  };
  // close clipboard
  const close = async (tabID: number | undefined): Promise<void> => {
    logger.debug(`close clipboard in tab(ID=${tabID})`);
    const target = clipboards.find((clipboard) => clipboard.tabID === tabID);
    if (target?.parentTabID === undefined) {
      return;
    }
    // close the clipboard window
    browser.windows.remove(target.windowID);
    // activate the parent tab
    browser.tabs.update(target.parentTabID, { active: true });
    // focus on the window with the parent tab
    browser.tabs.get(target.parentTabID).then((tab) => {
      if (tab.windowId !== undefined) {
        browser.windows.update(tab.windowId, { focused: true });
      }
    });
  };
  // browser.tabs.onTabRemoved
  const onTabRemoved = (tabID: number): void => {
    const targets = clipboards.reduceRight((targets, clipboard, index) => {
      if (clipboard.parentTabID === tabID || clipboard.tabID === tabID) {
        targets.push({ index, clipboard });
      }
      return targets;
    }, [] as { index: number; clipboard: ClipboardWindow }[]);
    targets.forEach((target) => {
      // remove from list
      clipboards.splice(target.index, 1);
      // remove windows with paernt tab is removed
      if (target.clipboard.parentTabID === tabID) {
        logger.debug('remove clipboard', target.clipboard);
        browser.windows.remove(target.clipboard.windowID);
      }
    });
  };
  return {
    open,
    close,
    onTabRemoved,
  } as const;
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
