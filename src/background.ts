import { loggerProvider } from './logger';

const logger = loggerProvider.getCategory('background');

logger.info('background script');
