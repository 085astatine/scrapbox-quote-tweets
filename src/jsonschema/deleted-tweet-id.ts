import type { JSONSchemaType } from 'ajv';
import type { DeletedTweetID } from '~/lib/tweet/types';

export const deletedTweetIDJSONSchema: Readonly<
  JSONSchemaType<DeletedTweetID>
> = {
  type: 'object',
  properties: {
    deleted_at: { type: 'integer' },
    tweet_id: {
      type: 'string',
      pattern: '^[0-9]+$',
    },
  },
  required: ['deleted_at', 'tweet_id'],
  additionalProperties: false,
};

export const deletedTweetIDsJSONSchema: Readonly<
  JSONSchemaType<DeletedTweetID[]>
> = {
  type: 'array',
  items: deletedTweetIDJSONSchema,
};
