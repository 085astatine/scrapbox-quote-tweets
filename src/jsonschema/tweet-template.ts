import { JSONSchemaType } from 'ajv';
import { TweetTemplate } from '~/lib/tweet/tweet-template';

export const tweetTemplateJSONSchema: Readonly<JSONSchemaType<TweetTemplate>> =
  {
    type: 'object',
    properties: {
      tweet: { type: 'string' },
      footer: { type: 'string' },
      entityText: { type: 'string' },
      entityUrl: { type: 'string' },
      entityHashtag: { type: 'string' },
      entityCashtag: { type: 'string' },
      entityMention: { type: 'string' },
      mediaPhoto: { type: 'string' },
      mediaVideo: { type: 'string' },
      quote: { type: 'boolean' },
    },
    required: [
      'tweet',
      'footer',
      'entityText',
      'entityUrl',
      'entityHashtag',
      'entityCashtag',
      'entityMention',
      'mediaPhoto',
      'mediaVideo',
      'quote',
    ],
    additionalProperties: false,
  };
