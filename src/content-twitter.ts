import { loggerProvider } from './logger';

const logger = loggerProvider.getCategory('content-twitter');

logger.info('content script');
