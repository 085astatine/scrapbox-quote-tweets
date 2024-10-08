/* eslint-disable @typescript-eslint/no-explicit-any */
import type { JSONSchemaType } from 'ajv';
import type { Storage } from '~/lib/storage/types';
import { deletedTweetIDsJSONSchema } from './deleted-tweet-id';
import { settingsJSONSchema } from './settings';
import { tweetJSONSchema } from './tweet';
import { trashboxSortJSONSchema, tweetSortJSONSchema } from './tweet-sort';
import { tweetTemplateJSONSchema } from './tweet-template';

export const storageJSONSchema = {
  type: 'object',
  properties: {
    ...Object.entries(settingsJSONSchema.properties).reduce<
      Record<string, any>
    >((properties, [key, value]) => {
      properties[`settings_${key}`] = value;
      return properties;
    }, {}),
    ...Object.entries(tweetTemplateJSONSchema.properties).reduce<
      Record<string, any>
    >((properties, [key, value]) => {
      properties[`tweetTemplate_${key}`] = value;
      return properties;
    }, {}),
    trashbox: deletedTweetIDsJSONSchema,
    tweetSort: tweetSortJSONSchema,
    trashboxSort: trashboxSortJSONSchema,
  },
  patternProperties: {
    '^tweet_[0-9]+$': { $ref: tweetJSONSchema.$ref },
  },
  additionalProperties: false,
  definitions: {
    ...tweetJSONSchema.definitions,
  },
} as any as Readonly<JSONSchemaType<Storage>>;
