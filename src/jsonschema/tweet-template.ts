import { JSONSchemaType } from 'ajv';
import { TweetTemplate } from '~/lib/tweet/tweet-template';

export const tweetTemplateJSONSchema: Readonly<JSONSchemaType<TweetTemplate>> =
  {
    type: 'object',
    properties: {
      tweet: { type: 'string' },
      footer: { type: 'string' },
      entity: {
        type: 'object',
        properties: {
          text: { type: 'string' },
          url: { type: 'string' },
          hashtag: { type: 'string' },
          cashtag: { type: 'string' },
          mention: { type: 'string' },
        },
        required: ['text', 'url', 'hashtag', 'cashtag', 'mention'],
        additionalProperties: false,
      },
      media: {
        type: 'object',
        properties: {
          photo: { type: 'string' },
          video: { type: 'string' },
        },
        required: ['photo', 'video'],
        additionalProperties: false,
      },
      quote: { type: 'boolean' },
    },
    required: ['tweet', 'footer', 'entity', 'media', 'quote'],
    additionalProperties: false,
  };
