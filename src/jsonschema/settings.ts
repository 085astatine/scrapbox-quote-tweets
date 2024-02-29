import { JSONSchemaType, SchemaObject } from 'ajv';
import { Settings } from '~/lib/settings';

const definitions: SchemaObject = {
  // Hostname
  hostname: {
    enum: ['twitter.com', 'x.com'],
  },
  // TweetSortKey
  tweetSortKey: {
    enum: ['created_time', 'saved_time', 'username'],
  },
  // TrashboxSortKey
  trashboxSortKey: {
    enum: ['deleted_time'],
  },
  // SortOrder
  sortOrder: {
    enum: ['asc', 'desc'],
  },
  // TweetSort
  tweetSort: {
    type: 'object',
    properties: {
      key: { $ref: '#/definitions/tweetSortKey' },
      order: { $ref: '#/definitions/sortOrder' },
    },
    required: ['key', 'order'],
    additionalProperties: false,
  },
  // TrashboxSort
  trashboxSort: {
    type: 'object',
    properties: {
      key: { $ref: '#/definitions/trashboxSortKey' },
      order: { $ref: '#/definitions/sortOrder' },
    },
    required: ['key', 'order'],
    additionalProperties: false,
  },
  // Settings
  settings: {
    type: 'object',
    properties: {
      hostname: { $ref: '#/definitions/hostname' },
      timezone: { type: 'string' },
      datetimeFormat: { type: 'string' },
      tweetSort: { $ref: '#/definitions/tweetSort' },
      trashboxSort: { $ref: '#/definitions/trashboxSort' },
    },
    required: [
      'hostname',
      'timezone',
      'datetimeFormat',
      'tweetSort',
      'trashboxSort',
    ],
    additionalProperties: false,
  },
};

export const settingsJSONSchema = {
  $ref: '#/definitions/settings',
  definitions,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any as Readonly<JSONSchemaType<Settings>>;
