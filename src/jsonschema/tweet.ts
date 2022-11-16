import { JSONSchemaType } from 'ajv';
import {
  Tweet,
  TweetEntity,
  TweetEntityCashtag,
  TweetEntityHashtag,
  TweetEntityMedia,
  TweetEntityMention,
  TweetEntityText,
  TweetEntityURL,
  User,
} from '../lib/tweet';

export const usernameJSONSchema: JSONSchemaType<string> = {
  type: 'string',
  pattern: '^[a-zA-Z0-9_]{1,15}$',
};

export const userJSONSchema: JSONSchemaType<User> = {
  type: 'object',
  required: ['id', 'name', 'username'],
  additionalProperties: false,
  properties: {
    id: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    username: usernameJSONSchema,
  },
};

export const tweetEntityTextJSONSchema: JSONSchemaType<TweetEntityText> = {
  type: 'object',
  required: ['type', 'text'],
  additionalProperties: false,
  properties: {
    type: {
      type: 'string',
      const: 'text',
    },
    text: {
      type: 'string',
    },
  },
};

export const tweetEntityURLJSONSchema: JSONSchemaType<TweetEntityURL> = {
  type: 'object',
  required: ['type', 'text', 'url', 'display_url'],
  additionalProperties: false,
  properties: {
    type: {
      type: 'string',
      const: 'url',
    },
    text: {
      type: 'string',
    },
    url: {
      type: 'string',
    },
    display_url: {
      type: 'string',
    },
    title: {
      type: 'string',
      nullable: true,
    },
    description: {
      type: 'string',
      nullable: true,
    },
  },
};

export const tweetEntityMediaJSONSchema: JSONSchemaType<TweetEntityMedia> = {
  type: 'object',
  required: ['type', 'text', 'media_key', 'media_type'],
  additionalProperties: false,
  properties: {
    type: {
      type: 'string',
      const: 'media',
    },
    text: {
      type: 'string',
    },
    media_key: {
      type: 'string',
    },
    media_type: {
      type: 'string',
    },
    url: {
      type: 'string',
      nullable: true,
    },
  },
};

export const tweetEntityHashtagJSONSchema: JSONSchemaType<TweetEntityHashtag> =
  {
    type: 'object',
    required: ['type', 'text', 'tag'],
    additionalProperties: false,
    properties: {
      type: {
        type: 'string',
        const: 'hashtag',
      },
      text: {
        type: 'string',
      },
      tag: {
        type: 'string',
      },
    },
  };

export const tweetEntityCashtagJSONSchema: JSONSchemaType<TweetEntityCashtag> =
  {
    type: 'object',
    required: ['type', 'text', 'tag'],
    additionalProperties: false,
    properties: {
      type: {
        type: 'string',
        const: 'cashtag',
      },
      text: {
        type: 'string',
      },
      tag: {
        type: 'string',
      },
    },
  };

export const tweetEntityMentionJSONSchema: JSONSchemaType<TweetEntityMention> =
  {
    type: 'object',
    required: ['type', 'text', 'user_id', 'username'],
    additionalProperties: false,
    properties: {
      type: {
        type: 'string',
        const: 'mention',
      },
      text: {
        type: 'string',
      },
      user_id: {
        type: 'string',
      },
      username: usernameJSONSchema,
    },
  };

export const tweetEntityJSONSchema: JSONSchemaType<TweetEntity> = {
  type: 'object',
  required: ['type'],
  discriminator: {
    propertyName: 'type',
  },
  oneOf: [
    tweetEntityTextJSONSchema,
    tweetEntityURLJSONSchema,
    tweetEntityMediaJSONSchema,
    tweetEntityHashtagJSONSchema,
    tweetEntityCashtagJSONSchema,
    tweetEntityMentionJSONSchema,
  ],
};

export const tweetJSONSchema: JSONSchemaType<Tweet> = {
  type: 'object',
  required: ['id', 'timestamp', 'author', 'text'],
  additionalProperties: false,
  properties: {
    id: {
      type: 'string',
    },
    timestamp: {
      type: 'integer',
    },
    author: userJSONSchema,
    text: {
      type: 'array',
      items: tweetEntityJSONSchema,
    },
  },
};

export const tweetsJSONSchema: JSONSchemaType<Tweet[]> = {
  type: 'array',
  items: tweetJSONSchema,
};
