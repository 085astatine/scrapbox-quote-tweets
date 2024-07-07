import { JSONSchemaType, SchemaObject } from 'ajv';
import { Settings } from '~/lib/settings';

const definitions: SchemaObject = {
  // Hostname
  hostname: {
    enum: ['twitter.com', 'x.com'],
  },
  // Settings
  settings: {
    type: 'object',
    properties: {
      hostname: { $ref: '#/definitions/hostname' },
      timezone: { type: 'string' },
      datetimeFormat: { type: 'string' },
    },
    required: ['hostname', 'timezone', 'datetimeFormat'],
    additionalProperties: false,
  },
};

export const settingsJSONSchema = {
  $ref: '#/definitions/settings',
  definitions,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any as Readonly<JSONSchemaType<Settings>>;
