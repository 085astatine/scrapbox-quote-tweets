import { JSONSchemaType } from 'ajv';
import { DeletedTweetIDs } from '~/lib/tweet';

export const trashboxRecordJSONSchema: Readonly<
  JSONSchemaType<DeletedTweetIDs>
> = {
  type: 'object',
  properties: {
    timestamp: { type: 'integer' },
    tweetIDs: {
      type: 'array',
      items: {
        type: 'string',
        pattern: '^[0-9]+$',
      },
      minItems: 1,
    },
  },
  required: ['timestamp', 'tweetIDs'],
  additionalProperties: false,
};

export const trashboxRecordsJSONSchema: Readonly<
  JSONSchemaType<DeletedTweetIDs[]>
> = {
  type: 'array',
  items: trashboxRecordJSONSchema,
};
