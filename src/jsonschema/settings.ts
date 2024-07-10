import type { JSONSchemaType } from 'ajv';
import type { Settings } from '~/lib/settings';

export const settingsJSONSchema: Readonly<JSONSchemaType<Settings>> = {
  type: 'object',
  properties: {
    hostname: {
      type: 'string',
      enum: ['twitter.com', 'x.com'],
    },
    timezone: { type: 'string' },
    datetimeFormat: { type: 'string' },
  },
  required: ['hostname', 'timezone', 'datetimeFormat'],
  additionalProperties: false,
};
