import { JSONSchemaType, SchemaObject } from 'ajv';
import { Tweet } from '~/content-twitter/lib/tweet';

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
      username: { type: 'string' },
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
  // Card
  card: {
    type: 'object',
    oneOf: [
      { $ref: '#/definitions/card:single' },
      { $ref: '#/definitions/card:carousel' },
    ],
    required: ['type'],
    discriminator: { propertyName: 'type' },
  },
  // CardLink
  'card:link': {
    type: 'object',
    properties: {
      url: { $ref: '#/definitions/uri' },
      expanded_url: { $ref: '#/definitions/uri' },
      decoded_url: { $ref: '#/definitions/iri' },
      title: { type: 'string' },
    },
    required: ['url', 'expanded_url', 'decoded_url'],
    additionalProperties: false,
  },
  // CardSingle
  'card:single': {
    type: 'object',
    properties: {
      type: { const: 'single' },
      link: { $ref: '#/definitions/card:link' },
      media_url: { $ref: '#/definitions/uri' },
    },
    required: ['type', 'media_url'],
    additionalProperties: false,
  },
  // CardCarousel
  'card:carousel': {
    type: 'object',
    properties: {
      type: { const: 'carousel' },
      link: { $ref: '#/definitions/card:link' },
      media_urls: {
        type: 'array',
        items: { $ref: '#/definitions/uri' },
      },
    },
    required: ['type', 'media_urls'],
    additionalProperties: false,
  },
};

export const tweetJSONSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    timestamp: { type: 'integer' },
    author: { $ref: '#/definitions/user' },
    text: {
      type: 'array',
      items: { $ref: '#/definitions/entity' },
    },
    card: { $ref: '#/definitions/card' },
    media: {
      type: 'array',
      items: { $ref: '#/definitions/media' },
    },
  },
  required: ['id', 'timestamp', 'author', 'text'],
  additionalProperties: false,
  definitions,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any as JSONSchemaType<Tweet>;

export const tweetsJSONSchema: JSONSchemaType<Tweet[]> = {
  type: 'array',
  items: tweetJSONSchema,
  definitions,
};
