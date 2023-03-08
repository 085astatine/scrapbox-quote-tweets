import difflib from 'difflib';

export interface TweetTemplate {
  tweet: string;
}

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

export type TweetField =
  | 'tweet.id'
  | 'tweet.timestamp'
  | 'user.id'
  | 'user.name'
  | 'user.username';

export interface ParsedTweetTemplate {
  tweet: readonly TemplateElement<TweetField>[];
}

export const parseTweetTemplate = (
  template: TweetTemplate
): ParsedTweetTemplate => {
  return {
    tweet: parseTweet(template.tweet),
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
  fields: readonly Field[]
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
  fields: readonly Field[]
): field is Field => {
  return (fields as readonly string[]).includes(field);
};

const tweetFields: readonly TweetField[] = [
  'tweet.id',
  'tweet.timestamp',
  'user.id',
  'user.name',
  'user.username',
];

const parseTweet = (template: string): TemplateElement<TweetField>[] => {
  return parsePlaceholders(template, tweetFields);
};

export const tweetTemplateParser = {
  tweet: parseTweet,
};
