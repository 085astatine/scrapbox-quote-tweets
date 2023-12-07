import { JSONSchemaType } from 'ajv';
import { DeletedTweetIDs } from '~/lib/tweet/deleted-tweets';

export const deletedTweetIDsJSONSchema: Readonly<
  JSONSchemaType<DeletedTweetIDs>
> = {
  type: 'object',
  properties: {
    deleted_at: { type: 'integer' },
    tweetIDs: {
      type: 'array',
      items: {
        type: 'string',
        pattern: '^[0-9]+$',
      },
      minItems: 1,
    },
  },
  required: ['deleted_at', 'tweetIDs'],
  additionalProperties: false,
};

export const deletedTweetIDsListJSONSchema: Readonly<
  JSONSchemaType<DeletedTweetIDs[]>
> = {
  type: 'array',
  items: deletedTweetIDsJSONSchema,
};
