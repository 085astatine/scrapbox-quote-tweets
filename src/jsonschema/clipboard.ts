import { JSONSchemaType } from 'ajv';
import { TrashboxRecord } from '~/lib/clipboard';

export const trashboxRecordJSONSchema: Readonly<
  JSONSchemaType<TrashboxRecord>
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
  JSONSchemaType<TrashboxRecord[]>
> = {
  type: 'array',
  items: trashboxRecordJSONSchema,
};
