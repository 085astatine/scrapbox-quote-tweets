import difflib from 'difflib';

export interface TweetTemplate {
  tweet: string;
  footer: string;
  entityText: string;
  entityUrl: string;
  entityHashtag: string;
  entityCashtag: string;
  entityMention: string;
  mediaPhoto: string;
  mediaVideo: string;
  quote: boolean;
}

export const defaultTweetTemplate = (): TweetTemplate => {
  return {
    tweet: '[${tweet.url} ${user.name}(@${user.username})]: ${tweet.text}',
    footer: '${tweet.datetime}',
    entityText: '${text}',
    entityUrl: '[${decoded_url} ${title}]',
    entityHashtag: '${text}',
    entityCashtag: '${text}',
    entityMention: '[${user_url} ${text}]',
    mediaPhoto: '[${url}]',
    mediaVideo: '[${thumbnail}]',
    quote: true,
  };
};

export interface TemplateElementText {
  type: 'text';
  text: string;
}

export interface TemplateElementPlaceholder<Field extends string> {
  type: 'placeholder';
  field: Field;
}

export type TemplateElement<Field extends string> =
  | TemplateElementText
  | TemplateElementPlaceholder<Field>;

const tweetFields = [
  'tweet.url',
  'tweet.id',
  'tweet.text',
  'tweet.datetime',
  'user.name',
  'user.username',
  'user.url',
] as const;

const entityTextFields = ['text'] as const;

const entityURLFields = [
  'text',
  'short_url',
  'expanded_url',
  'decoded_url',
  'title',
] as const;

const entityHashtagFields = ['text', 'tag', 'hashmoji'] as const;

const entityCashtagFields = ['text', 'tag'] as const;

const entityMentionFields = ['text', 'username', 'user_url'] as const;

const mediaPhotoFields = ['url'] as const;

const mediaVideoFields = ['thumbnail'] as const;

export type TweetField = (typeof tweetFields)[number];

export type EntityTextField = (typeof entityTextFields)[number];

export type EntityURLField = (typeof entityURLFields)[number];

export type EntityHashtagField = (typeof entityHashtagFields)[number];

export type EntityCashtagField = (typeof entityCashtagFields)[number];

export type EntityMentionField = (typeof entityMentionFields)[number];

export type MediaPhotoField = (typeof mediaPhotoFields)[number];

export type MediaVideoField = (typeof mediaVideoFields)[number];

export interface ParsedTweetTemplate {
  tweet: readonly TemplateElement<TweetField>[];
  footer: readonly TemplateElement<TweetField>[];
  entityText: readonly TemplateElement<EntityTextField>[];
  entityUrl: readonly TemplateElement<EntityURLField>[];
  entityHashtag: readonly TemplateElement<EntityHashtagField>[];
  entityCashtag: readonly TemplateElement<EntityCashtagField>[];
  entityMention: readonly TemplateElement<EntityMentionField>[];
  mediaPhoto: readonly TemplateElement<MediaPhotoField>[];
  mediaVideo: readonly TemplateElement<MediaVideoField>[];
  quote: boolean;
}

export const parseTweetTemplate = (
  template: TweetTemplate,
): ParsedTweetTemplate => {
  // parse template
  const parser = tweetTemplateParser;
  return {
    tweet: parser.tweet(template.tweet),
    footer: parser.footer(template.footer),
    entityText: parser.entityText(template.entityText),
    entityUrl: parser.entityUrl(template.entityUrl),
    entityHashtag: parser.entityHashtag(template.entityHashtag),
    entityCashtag: parser.entityCashtag(template.entityCashtag),
    entityMention: parser.entityMention(template.entityMention),
    mediaPhoto: parser.mediaPhoto(template.mediaPhoto),
    mediaVideo: parser.mediaVideo(template.mediaVideo),
    quote: template.quote,
  };
};

export class UnexpectedPlaceholderError extends Error {
  readonly field: string;
  readonly fields: readonly string[];
  readonly maybe: readonly string[];

  constructor(field: string, fields: readonly string[]) {
    const maybe = difflib.getCloseMatches(field, fields as string[]);
    let message = `"${field}" is not assignable to a placeholder.`;
    if (maybe.length > 0) {
      message += ` Did you mean ${maybe
        .map((field) => `"${field}"`)
        .join(' / ')}?`;
    }
    super(message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UnexpectedPlaceholderError);
    }
    this.field = field;
    this.fields = fields;
    this.maybe = maybe;
  }
}

const parsePlaceholders = <Field extends string>(
  template: string,
  fields: readonly Field[],
): TemplateElement<Field>[] => {
  const elements: TemplateElement<Field>[] = [];
  let tail = template;
  while (tail.length > 0) {
    const match = tail.match(/(?<!\\)\$\{(?<field>.+?)\}/);
    if (match !== null) {
      if (match.index !== 0) {
        elements.push({ type: 'text', text: tail.slice(0, match.index) });
      }
      const field = match?.groups?.field;
      if (field !== undefined) {
        if (!isField(field, fields)) {
          throw new UnexpectedPlaceholderError(field, fields);
        }
        elements.push({ type: 'placeholder', field: field as Field });
        tail = tail.slice((match.index ?? 0) + match[0].length);
      }
    } else {
      elements.push({ type: 'text', text: tail });
      tail = '';
    }
  }
  return elements;
};

const isField = <Field extends string>(
  field: string,
  fields: readonly Field[],
): field is Field => {
  return (fields as readonly string[]).includes(field);
};

const fieldParser = <Field extends string>(
  fields: readonly Field[],
): ((template: string) => TemplateElement<Field>[]) => {
  return (template: string) => parsePlaceholders(template, fields);
};

type ParserKey = Exclude<keyof TweetTemplate, 'quote'>;

type TweetTemplateParser = {
  [Key in ParserKey]: (template: string) => ParsedTweetTemplate[Key];
};

export const tweetTemplateParser: TweetTemplateParser = {
  tweet: fieldParser(tweetFields),
  footer: fieldParser(tweetFields),
  entityText: fieldParser(entityTextFields),
  entityUrl: fieldParser(entityURLFields),
  entityHashtag: fieldParser(entityHashtagFields),
  entityCashtag: fieldParser(entityCashtagFields),
  entityMention: fieldParser(entityMentionFields),
  mediaPhoto: fieldParser(mediaPhotoFields),
  mediaVideo: fieldParser(mediaVideoFields),
} as const;
