import browser from 'webextension-polyfill';
import { tweetTemplateJSONSchema } from '~/jsonschema/tweet-template';
import {
  TweetTemplate,
  defaultTweetTemplate,
} from '~/lib/tweet/tweet-template';
import { JSONSchemaValidationError } from '~/validate-json/error';
import validateTweetTemplate from '~/validate-json/validate-tweet-template';
import { logger } from './logger';
import { recordTo, toRecord } from './to-record';

// load & save
export const saveTweetTemplate = async (
  template: TweetTemplate,
): Promise<void> => {
  logger.debug('save tweet-template', template);
  // JSONSchema validation
  if (!validateTweetTemplate(template)) {
    throw new JSONSchemaValidationError(
      tweetTemplateJSONSchema,
      template,
      validateTweetTemplate.errors ?? [],
    );
  }
  // set to storage
  logger.debug('save tweet-template record', toRecord(template, prefix));
  await browser.storage.local.set(
    toRecord(template, prefix) as TweetTemplateRecord,
  );
};

export const loadTweetTemplate = async (): Promise<TweetTemplate> => {
  logger.debug('load tweet-template');
  // load from storage
  const request = toRecord(
    defaultTweetTemplate(),
    prefix,
  ) as TweetTemplateRecord;
  const record = await browser.storage.local.get(request);
  const data = recordTo(record, prefix);
  // JSONSchema validation
  if (!validateTweetTemplate(data)) {
    throw new JSONSchemaValidationError(
      tweetTemplateJSONSchema,
      data,
      validateTweetTemplate.errors ?? [],
    );
  }
  return data;
};

// record
const prefix = 'tweetTemplate' as const;

export type TweetTemplateRecord = {
  tweetTemplate_tweet: string;
  tweetTemplate_footer: string;
  tweetTemplate_quote: boolean;
} & {
  [key in keyof TweetTemplate['entity'] as `tweetTemplate_entity_${key}`]: string;
} & {
  [key in keyof TweetTemplate['media'] as `tweetTemplate_media_${key}`]: string;
};

// key
const tweetTemplateRecordKeys: ReadonlyArray<keyof TweetTemplateRecord> = [
  'tweetTemplate_tweet',
  'tweetTemplate_footer',
  'tweetTemplate_entity_text',
  'tweetTemplate_entity_url',
  'tweetTemplate_entity_hashtag',
  'tweetTemplate_entity_cashtag',
  'tweetTemplate_entity_mention',
  'tweetTemplate_media_photo',
  'tweetTemplate_media_video',
  'tweetTemplate_quote',
] as const;

export const isTweetTemplateRecordKey = (
  key: string,
): key is keyof TweetTemplateRecord => {
  return (tweetTemplateRecordKeys as ReadonlyArray<string>).includes(key);
};
