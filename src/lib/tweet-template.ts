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

const tweetFields: readonly TweetField[] = [
  'tweet.id',
  'tweet.timestamp',
  'user.id',
  'user.name',
  'user.username',
];

const parseTweet = (template: string): TemplateElement<TweetField>[] => {
  return [
    {
      type: 'text',
      text: template,
    },
  ];
};
