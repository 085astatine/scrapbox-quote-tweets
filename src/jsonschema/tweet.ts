import type { JSONSchemaType, SchemaObject } from 'ajv';
import type { Tweet, TweetID } from '~/lib/tweet/types';

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
  // Tweet
  tweet: {
    type: 'object',
    properties: {
      id: { $ref: '#/definitions/tweet:id' },
      created_at: { type: 'integer' },
      saved_at: { type: 'integer' },
      author: { $ref: '#/definitions/user' },
      text: {
        type: 'array',
        items: { $ref: '#/definitions/entity' },
      },
      media: {
        type: 'array',
        items: { $ref: '#/definitions/media' },
      },
    },
    required: ['id', 'created_at', 'saved_at', 'author', 'text'],
    additionalProperties: false,
  },
  // tweet id
  'tweet:id': {
    type: 'string',
    pattern: '^[0-9]+$',
  },
  // username
  username: {
    type: 'string',
    pattern: '^\\w{1,15}$',
  },
  // User
  user: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      username: { $ref: '#/definitions/username' },
    },
    required: ['name', 'username'],
    additionalProperties: false,
  },
  // TweetEntity
  entity: {
    type: 'object',
    oneOf: [
      { $ref: '#/definitions/entity:text' },
      { $ref: '#/definitions/entity:url' },
      { $ref: '#/definitions/entity:hashtag' },
      { $ref: '#/definitions/entity:cashtag' },
      { $ref: '#/definitions/entity:mention' },
    ],
    required: ['type'],
    discriminator: { propertyName: 'type' },
  },
  // TweetEntityText
  'entity:text': {
    type: 'object',
    properties: {
      type: { const: 'text' },
      text: { type: 'string' },
    },
    required: ['type', 'text'],
    additionalProperties: false,
  },
  // TweetEntityURL
  'entity:url': {
    type: 'object',
    properties: {
      type: { const: 'url' },
      text: { type: 'string' },
      short_url: { $ref: '#/definitions/uri' },
      expanded_url: { $ref: '#/definitions/uri' },
      decoded_url: { $ref: '#/definitions/iri' },
      title: { type: 'string' },
    },
    required: ['type', 'text', 'short_url', 'expanded_url', 'decoded_url'],
    additionalProperties: false,
  },
  // TweetEntityHashtag
  'entity:hashtag': {
    type: 'object',
    properties: {
      type: { const: 'hashtag' },
      text: { type: 'string' },
      tag: { type: 'string' },
      hashmoji: { $ref: '#/definitions/uri' },
    },
    required: ['type', 'text', 'tag'],
    additionalProperties: false,
  },
  // TweetEntityCashtag
  'entity:cashtag': {
    type: 'object',
    properties: {
      type: { const: 'cashtag' },
      text: { type: 'string' },
      tag: { type: 'string' },
    },
    required: ['type', 'text', 'tag'],
    additionalProperties: false,
  },
  // TweetEntityMention
  'entity:mention': {
    type: 'object',
    properties: {
      type: { const: 'mention' },
      text: { type: 'string' },
      username: { $ref: '#/definitions/username' },
    },
    required: ['type', 'text', 'username'],
    additionalProperties: false,
  },
  // Media
  media: {
    type: 'object',
    oneOf: [
      { $ref: '#/definitions/media:photo' },
      { $ref: '#/definitions/media:video' },
    ],
    required: ['type'],
    discriminator: { propertyName: 'type' },
  },
  // MediaPhoto
  'media:photo': {
    type: 'object',
    properties: {
      type: { const: 'photo' },
      url: { $ref: '#/definitions/uri' },
    },
    required: ['type', 'url'],
    additionalProperties: false,
  },
  // MediaVideo
  'media:video': {
    type: 'object',
    properties: {
      type: { const: 'video' },
      thumbnail: { $ref: '#/definitions/uri' },
    },
    required: ['type', 'thumbnail'],
    additionalProperties: false,
  },
};

export const tweetJSONSchema = {
  $ref: '#/definitions/tweet',
  definitions,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any as Readonly<JSONSchemaType<Tweet>>;

export const tweetsJSONSchema = {
  type: 'array',
  items: { $ref: '#/definitions/tweet' },
  definitions,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any as Readonly<JSONSchemaType<Tweet[]>>;

export const tweetIDsJSONSchema: Readonly<JSONSchemaType<TweetID[]>> = {
  type: 'array',
  items: {
    type: 'string',
    pattern: '^[0-9]+$',
  },
};
