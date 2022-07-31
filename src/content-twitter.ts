import { loggerProvider } from './logger';

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
    logger.info('node is found', { type: node.nodeType, name: node.nodeName });
  } else {
    logger.error('node is not found');
  }
  return node;
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
