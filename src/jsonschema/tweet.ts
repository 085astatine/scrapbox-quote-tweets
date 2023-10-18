import { JSONSchemaType, SchemaObject } from 'ajv';
import {
  Card,
  CardLink,
  CardSingle,
  Media,
  MediaPhoto,
  MediaVideo,
  Tweet,
  TweetEntity,
  TweetEntityCashtag,
  TweetEntityHashtag,
  TweetEntityMention,
  TweetEntityText,
  TweetEntityURL,
} from '~/content-twitter/lib/tweet';

const definitions: SchemaObject = {
  // URI
  uri: {
    type: 'string',
    format: 'uri',
  },
  // IRI
  iri: {
    type: 'string',
    format: 'iri',
  },
  // User
  user: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      username: { type: 'string' },
    },
    required: ['name', 'username'],
    additionalProperties: false,
  },
};

export const tweetEntityTextJSONSchema: JSONSchemaType<TweetEntityText> = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      const: 'text',
    },
    text: { type: 'string' },
  },
  required: ['type', 'text'],
  additionalProperties: false,
};

export const tweetEntityURLJSONSchema: JSONSchemaType<TweetEntityURL> = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      const: 'url',
    },
    text: { type: 'string' },
    short_url: { $ref: '#/definitions/uri' },
    expanded_url: { $ref: '#/definitions/uri' },
    decoded_url: { $ref: '#/definitions/iri' },
    title: {
      type: 'string',
      nullable: true,
    },
  },
  required: ['type', 'text', 'short_url', 'expanded_url', 'decoded_url'],
  additionalProperties: false,
};

export const tweetEntityHashtagJSONSchema: JSONSchemaType<TweetEntityHashtag> =
  {
    type: 'object',
    properties: {
      type: {
        type: 'string',
        const: 'hashtag',
      },
      text: { type: 'string' },
      tag: { type: 'string' },
      hashmoji: {
        type: 'string',
        nullable: true,
      },
    },
    required: ['type', 'text', 'tag'],
    additionalProperties: false,
  };

export const tweetEntityCashtagJSONSchema: JSONSchemaType<TweetEntityCashtag> =
  {
    type: 'object',
    properties: {
      type: {
        type: 'string',
        const: 'cashtag',
      },
      text: { type: 'string' },
      tag: { type: 'string' },
    },
    required: ['type', 'text', 'tag'],
    additionalProperties: false,
  };

export const tweetEntityMentionJSONSchema: JSONSchemaType<TweetEntityMention> =
  {
    type: 'object',
    properties: {
      type: {
        type: 'string',
        const: 'mention',
      },
      text: { type: 'string' },
      username: { type: 'string' },
    },
    required: ['type', 'text', 'username'],
    additionalProperties: false,
  };

export const tweetEntityJSONSchema: JSONSchemaType<TweetEntity> = {
  type: 'object',
  oneOf: [
    tweetEntityTextJSONSchema,
    tweetEntityURLJSONSchema,
    tweetEntityHashtagJSONSchema,
    tweetEntityCashtagJSONSchema,
    tweetEntityMentionJSONSchema,
  ],
  required: ['type'],
  discriminator: { propertyName: 'type' },
};

export const mediaPhotoJSONSchema: JSONSchemaType<MediaPhoto> = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      const: 'photo',
    },
    url: { $ref: '#/definitions/uri' },
  },
  required: ['type', 'url'],
  additionalProperties: false,
};

export const mediaVideoJSONSchema: JSONSchemaType<MediaVideo> = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      const: 'video',
    },
    thumbnail: { $ref: '#/definitions/uri' },
  },
  required: ['type', 'thumbnail'],
  additionalProperties: false,
};

export const mediaJSONSchema: JSONSchemaType<Media> = {
  type: 'object',
  oneOf: [mediaPhotoJSONSchema, mediaVideoJSONSchema],
  required: ['type'],
  discriminator: { propertyName: 'type' },
};

export const cardLinkJSONSchema: JSONSchemaType<CardLink> = {
  type: 'object',
  properties: {
    url: { $ref: '#/definitions/uri' },
    expanded_url: { $ref: '#/definitions/uri' },
    decoded_url: { $ref: '#/definitions/iri' },
    title: {
      type: 'string',
      nullable: true,
    },
  },
  required: ['url', 'expanded_url', 'decoded_url'],
  additionalProperties: false,
};

export const cardSingleJSONSchema: JSONSchemaType<CardSingle> = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      const: 'single',
    },
    link: {
      ...cardLinkJSONSchema,
      nullable: true,
    },
    media_url: { $ref: '#/definitions/uri' },
  },
  required: ['type', 'media_url'],
  additionalProperties: false,
};

export const cardCarouselJSONSchema: SchemaObject = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      const: 'carousel',
    },
    link: {
      ...cardLinkJSONSchema,
      nullable: true,
    },
    media_urls: {
      type: 'array',
      items: { $ref: '#/definitions/uri' },
    },
  },
  required: ['type', 'media_urls'],
  additionalProperties: false,
};

export const cardJSONSchema: JSONSchemaType<Card> = {
  type: 'object',
  oneOf: [cardSingleJSONSchema, cardCarouselJSONSchema],
  required: ['type'],
  discriminator: { propertyName: 'type' },
};

export const tweetJSONSchema: JSONSchemaType<Tweet> = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    timestamp: { type: 'integer' },
    author: { $ref: '#/definitions/user' },
    text: {
      type: 'array',
      items: tweetEntityJSONSchema,
    },
    card: {
      ...cardJSONSchema,
      nullable: true,
    },
    media: {
      type: 'array',
      items: mediaJSONSchema,
      nullable: true,
    },
  },
  required: ['id', 'timestamp', 'author', 'text'],
  additionalProperties: false,
  definitions,
};

export const tweetsJSONSchema: JSONSchemaType<Tweet[]> = {
  type: 'array',
  items: tweetJSONSchema,
  definitions,
};
