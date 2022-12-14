import { getNode, mutationRecordInfo } from './lib/dom';
import { logger } from './lib/logger';

logger.info('content scrapbox');

// DOM Content Loaded Event
window.addEventListener('DOMContentLoaded', () => {
  logger.debug('window DomContentLoaded event');
  // mutation observer
  mutationObserver.observe(document.body, {
    subtree: true,
    childList: true,
  });
});

// mutation observer
const observerCallback = (records: MutationRecord[]): void => {
  logger.debug('mutation records', records.map(mutationRecordInfo));
  records.forEach((record) => {
    record.addedNodes.forEach((node) => {
      const pageMenuNode = getNode('.//div[@class="page-menu"]', node);
      console.log('page menu node', pageMenuNode);
    });
  });
};
const mutationObserver = new MutationObserver(observerCallback);
