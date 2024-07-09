import equal from 'fast-deep-equal';
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

type TweetTemplateRecord = {
  [Key in keyof TweetTemplate as `tweetTemplate_${Key}`]: TweetTemplate[Key];
};

// key
const tweetTemplateRecordKeys: ReadonlyArray<keyof TweetTemplateRecord> = [
  'tweetTemplate_tweet',
  'tweetTemplate_footer',
  'tweetTemplate_entityText',
  'tweetTemplate_entityUrl',
  'tweetTemplate_entityHashtag',
  'tweetTemplate_entityCashtag',
  'tweetTemplate_entityMention',
  'tweetTemplate_mediaPhoto',
  'tweetTemplate_mediaVideo',
  'tweetTemplate_quote',
] as const;

export const isTweetTemplateRecordKey = (
  key: string,
): key is keyof TweetTemplateRecord => {
  return (tweetTemplateRecordKeys as ReadonlyArray<string>).includes(key);
};

// storage listener
export type OnChangedTweetTemplate = {
  tweetTemplate?: Partial<TweetTemplate>;
};

export const onChangedTweetTemplate = (
  changes: browser.Storage.StorageAreaOnChangedChangesType,
): OnChangedTweetTemplate => {
  const record = Object.entries(changes).reduce<Partial<TweetTemplateRecord>>(
    (record, [key, { oldValue, newValue }]) => {
      if (
        isTweetTemplateRecordKey(key) &&
        !equal(oldValue, newValue) &&
        newValue !== undefined
      ) {
        Object.assign(record, { [key]: newValue });
      }
      return record;
    },
    {},
  );
  const tweetTemplate = recordTo(record, prefix) as Partial<TweetTemplate>;
  return {
    ...(Object.keys(tweetTemplate).length > 0 && { tweetTemplate }),
  };
};
