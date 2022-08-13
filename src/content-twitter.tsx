import React from 'react';
import { createRoot } from 'react-dom/client';
import browser from 'webextension-polyfill';
import { Copy } from './component/copy';
import { getNode, isElement, showMutationRecord, showNode } from './lib/dom';
import { loggerProvider } from './lib/logger';
import { Message } from './lib/message';

const logger = loggerProvider.getCategory('content-twitter');

logger.info('content script');

// observer
const observerCallback = (records: MutationRecord[]): void => {
  logger.info('mutation observer callback');
  records.forEach((record) => {
    // show record
    showMutationRecord(record);
    // tweet nodes
    record.addedNodes.forEach((node) => {
      // check if node is an element
      if (!isElement(node)) {
        return;
      }
      // tweet nodes
      findTweetNodes(node).forEach((node) => {
        logger.info(`tweet node: ${showNode(node)}`);
        // react root
        const rootDiv = reactRootDiv(node);
        if (rootDiv === null) {
          return;
        }
        // render by React
        const reactRoot = createRoot(rootDiv);
        reactRoot.render(<Copy />);
      });
    });
  });
};

const findTweetNodes = (element: Element): Element[] => {
  const nodes = [];
  const xpathResult = document.evaluate(
    './/article[@data-testid="tweet"]',
    element,
    null,
    XPathResult.ORDERED_NODE_ITERATOR_TYPE,
    null
  );
  let node: Node | null;
  while ((node = xpathResult.iterateNext())) {
    showNode(node);
    if (isElement(node)) {
      nodes.push(node);
    }
  }
  return nodes;
};

const reactRootDiv = (element: Element): Element | null => {
  // button group
  const xpathResult = document.evaluate(
    '(.//div[@role="group"])[last()]',
    element,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  );
  const group = xpathResult.singleNodeValue;
  if (group === null) {
    logger.warn('<div role="group"> is not found');
    return null;
  }
  // check if react root exists
  if (getNode('./div[@scrapbox-copy-tweets="copy"]', group, logger) !== null) {
    logger.info('root <div/> already exists');
    return null;
  }
  // create react root <div scrapbox-copy-tweets="copy"/>
  logger.info('create <div scrapbox-copy-tweets="copy"/>');
  const root = group.appendChild(document.createElement('div'));
  root.setAttribute('scrapbox-copy-tweets', 'copy');
  return root;
};

// observe body
const observer = new MutationObserver(observerCallback);

window.addEventListener('DOMContentLoaded', () => {
  logger.info('window DOMContentLoaded event');
  const options = {
    subtree: true,
    childList: true,
  };
  observer.observe(document.body, options);
});

// message: url changed
const urlChangedListener = (message: Message) => {
  if (message.type == 'url_changed') {
    logger.info('url changged');
  }
};
browser.runtime.onMessage.addListener(urlChangedListener);
