import { JSONSchemaType } from 'ajv';
import {
  ReferencedTweet,
  Tweet,
  TweetEntity,
  TweetEntityAnnotation,
  TweetEntityCashtag,
  TweetEntityHashtag,
  TweetEntityMedia,
  TweetEntityMention,
  TweetEntityText,
  TweetEntityURL,
  User,
} from '@lib/tweet';

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
      pattern: '^[0-9]+$',
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
  required: ['type', 'text', 'url', 'display_url', 'decoded_url'],
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
    decoded_url: {
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
      pattern: '^[0-9_]+$',
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
    required: ['type', 'text', 'user'],
    additionalProperties: false,
    properties: {
      type: {
        type: 'string',
        const: 'mention',
      },
      text: {
        type: 'string',
      },
      user: {
        type: 'object',
        required: ['id', 'username'],
        additionalProperties: false,
        properties: {
          id: {
            type: 'string',
            pattern: '^[0-9]+$',
          },
          name: {
            type: 'string',
            nullable: true,
          },
          username: usernameJSONSchema,
        },
      },
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

export const tweetEntityAnnotationJSONSchema: JSONSchemaType<TweetEntityAnnotation> =
  {
    type: 'object',
    required: [
      'type',
      'text',
      'probability',
      'annotation_type',
      'normalized_text',
    ],
    additionalProperties: false,
    properties: {
      type: {
        type: 'string',
        const: 'annotation',
      },
      text: {
        type: 'string',
      },
      probability: {
        type: 'number',
      },
      annotation_type: {
        type: 'string',
      },
      normalized_text: {
        type: 'string',
      },
    },
  };

export const referencedTweetJSONSchema: JSONSchemaType<ReferencedTweet> = {
  type: 'object',
  required: ['type', 'id'],
  additionalProperties: false,
  properties: {
    type: {
      type: 'string',
      enum: ['retweeted', 'quoted', 'replied_to'],
    },
    id: {
      type: 'string',
      pattern: '^[0-9]+$',
    },
  },
};

export const tweetJSONSchema: JSONSchemaType<Tweet> = {
  type: 'object',
  required: ['id', 'timestamp', 'author', 'text'],
  additionalProperties: false,
  properties: {
    id: {
      type: 'string',
      pattern: '^[0-9]+$',
    },
    timestamp: {
      type: 'integer',
    },
    author: userJSONSchema,
    text: {
      type: 'array',
      items: tweetEntityJSONSchema,
    },
    annotations: {
      type: 'array',
      items: tweetEntityAnnotationJSONSchema,
      nullable: true,
    },
    referenced_tweets: {
      type: 'array',
      items: referencedTweetJSONSchema,
      nullable: true,
    },
  },
};

export const tweetsJSONSchema: JSONSchemaType<Tweet[]> = {
  type: 'array',
  items: tweetJSONSchema,
};
