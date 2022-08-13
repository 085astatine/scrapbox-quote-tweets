import { LogLevel } from 'typescript-logging';
import { CategoryProvider } from 'typescript-logging-category-style';

const config = {
  level: process.env.NODE_ENV == 'production' ? LogLevel.Error : LogLevel.Info,
};

export const loggerProvider = CategoryProvider.createProvider(
  'scrapbox-copy-tweets',
  config
);
