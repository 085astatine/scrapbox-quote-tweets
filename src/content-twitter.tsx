import React from 'react';
import { createRoot } from 'react-dom/client';
import browser from 'webextension-polyfill';
import { Copy } from './component/copy';
import { loggerProvider } from './logger';
import { Message } from './message';

const logger = loggerProvider.getCategory('content-twitter');

logger.info('content script');

// node
const getNode = (xpath: string, parent?: Node): Node | null => {
  logger.info('search node', { xpath });
  const result = document.evaluate(
    xpath,
    parent ?? document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  );
  const node = result.singleNodeValue;
  if (node !== null) {
    logger.info(`node: ${showNode(node)}`);
  } else {
    logger.error('node is not found');
  }
  return node;
};

const nodeTypeToString = (nodeType: number): string => {
  switch (nodeType) {
    case Node.ELEMENT_NODE: // 1
      return 'Element';
    case Node.ATTRIBUTE_NODE: // 2
      return 'Attribute';
    case Node.TEXT_NODE: // 3
      return 'Text';
    case Node.CDATA_SECTION_NODE: // 4
      return 'CDataSection';
    case Node.PROCESSING_INSTRUCTION_NODE: // 7
      return 'ProcessingInstruction';
    case Node.COMMENT_NODE: // 8
      return 'Comment';
    case Node.DOCUMENT_NODE: // 9
      return 'Document';
    case Node.DOCUMENT_TYPE_NODE: // 10
      return 'DocumentType';
    case Node.DOCUMENT_FRAGMENT_NODE: // 11
      return 'DocumentFragment';
    // deprecated
    case Node.ENTITY_REFERENCE_NODE: // 5
    case Node.ENTITY_NODE: // 6
    case Node.NOTATION_NODE: // 12
      return 'deprecated';
    default:
      return 'undefined';
  }
};

const showNodeType = (nodeType: number): string => {
  return `${nodeType}(${nodeTypeToString(nodeType)})`;
};

const showNode = (node: Node): string => {
  return `${node.nodeName} type=${showNodeType(node.nodeType)}`;
};

const isElement = (node: Node): node is Element => {
  return node.nodeType === Node.ELEMENT_NODE;
};

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

const showMutationRecord = (record: MutationRecord) => {
  // .type
  logger.info(`record type: ${record.type}`);
  // .addedNodes
  record.addedNodes.forEach((node) => {
    logger.info(`added node: ${showNode(node)}`);
  });
  // .removedNodes
  record.removedNodes.forEach((node) => {
    logger.info(`removed node: ${showNode(node)}`);
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
  if (getNode('./div[@scrapbox-copy-tweets="copy"]', group) !== null) {
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
