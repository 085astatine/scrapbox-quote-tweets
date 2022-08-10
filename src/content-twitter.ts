import browser from 'webextension-polyfill';
import { loggerProvider } from './logger';
import { Message } from './message';

const logger = loggerProvider.getCategory('content-twitter');

logger.info('content script');

// node
const getNode = (xpath: string): Node | null => {
  logger.info('search node', { xpath });
  const result = document.evaluate(
    xpath,
    document.body,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  );
  const node = result.singleNodeValue;
  if (node !== null) {
    logger.info(
      `node: name=${node.nodeName}, type=${showNodeType(node.nodeType)})`
    );
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
// observer
const observerCallback = (records: MutationRecord[]): void => {
  logger.info('mutation observer callback');
  records.forEach((record) => {
    logger.info('record:', { type: record.type });
  });
};
const observer = new MutationObserver(observerCallback);

// window: load event
window.addEventListener('load', () => {
  logger.info('window load event');
  const xpath = '//section[@aria-labelledby="accessible-list-0"]/div';
  const node = getNode(xpath);
  console.log('load event:', node);
  if (node !== null) {
    const options = {
      subtree: true,
      childList: true,
    };
    observer.observe(node, options);
  }
});

// message: url changed
const urlChangedListener = (message: Message) => {
  if (message.type == 'url_changed') {
    logger.info('url changged');
  }
};
browser.runtime.onMessage.addListener(urlChangedListener);
