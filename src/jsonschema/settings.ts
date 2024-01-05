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
  // DeletedTweetsSortKey
  deletedTweetsSortKey: {
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
  // DeletedTweetsSort
  deletedTweetsSort: {
    type: 'object',
    properties: {
      key: { $ref: '#/definitions/deletedTweetsSortKey' },
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
      deletedTweetsSort: { $ref: '#/definitions/deletedTweetsSort' },
    },
    required: [
      'hostname',
      'timezone',
      'datetimeFormat',
      'tweetSort',
      'deletedTweetsSort',
    ],
    additionalProperties: false,
  },
};

export const settingsJSONSchema = {
  $ref: '#/definitions/settings',
  definitions,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any as Readonly<JSONSchemaType<Settings>>;
