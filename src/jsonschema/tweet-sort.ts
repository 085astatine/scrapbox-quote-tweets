import type { JSONSchemaType } from 'ajv';
import type { TrashboxSort } from '~/lib/trashbox';
import type { TweetSort } from '~/lib/tweet/types';

export const tweetSortJSONSchema: Readonly<JSONSchemaType<TweetSort>> = {
  type: 'object',
  properties: {
    key: {
      type: 'string',
      enum: ['created_time', 'saved_time', 'username'],
    },
    order: {
      type: 'string',
      enum: ['asc', 'desc'],
    },
  },
  required: ['key', 'order'],
  additionalProperties: false,
};

export const trashboxSortJSONSchema: Readonly<JSONSchemaType<TrashboxSort>> = {
  type: 'object',
  properties: {
    key: {
      type: 'string',
      enum: ['deleted_time'],
    },
    order: {
      type: 'string',
      enum: ['asc', 'desc'],
    },
  },
  required: ['key', 'order'],
  additionalProperties: false,
};
