import { defaultTimezone, toDatetime } from '../datetime';
import { Hostname, baseURL } from '../settings';
import {
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
} from './tweet';
import {
  EntityCashtagField,
  EntityHashtagField,
  EntityMentionField,
  EntityTextField,
  EntityURLField,
  MediaPhotoField,
  MediaVideoField,
  ParsedTweetTemplate,
  TemplateElement,
  TweetField,
  TweetTemplate,
  parseTweetTemplate,
} from './tweet-template';

export interface TweetToStringOption {
  hostname?: Hostname;
  timezone?: string;
  datetimeFormat?: string;
}

const defaultOption = (): Required<TweetToStringOption> => {
  return {
    hostname: 'twitter.com',
    timezone: defaultTimezone(),
    datetimeFormat: 'YYYY-MM-DD[T]HH:mm:ssZ',
  };
};

export const tweetToString = (
  tweet: Tweet,
  template: TweetTemplate,
  option?: TweetToStringOption,
): string => {
  const options = {
    ...defaultOption(),
    ...(option ?? {}),
  };
  const parsedTemplate = parseTweetTemplate(template);
  const textElements: string[] = [];
  // tweet
  textElements.push(
    substituteTweetTemplates(
      parsedTemplate.tweet,
      tweet,
      parsedTemplate,
      options,
    ),
  );
  // media
  if (tweet.media !== undefined) {
    textElements.push(mediaListToString(tweet.media, parsedTemplate));
  }
  // footer
  textElements.push(
    substituteTweetTemplates(
      parsedTemplate.footer,
      tweet,
      parsedTemplate,
      options,
    ),
  );
  // quote
  return parsedTemplate.quote ?
      quoteText(textElements.join(''))
    : textElements.join('');
};

const substituteTweetTemplates = (
  tweetTemplates: readonly TemplateElement<TweetField>[],
  tweet: Tweet,
  template: ParsedTweetTemplate,
  option: Required<TweetToStringOption>,
): string => {
  // substitute tweet templates
  const text = tweetTemplates
    .map((element) => substituteTweetTemplate(element, tweet, template, option))
    .join('');
  // if the text is emapty, do not add EOL
  if (!text) {
    return '';
  }
  // EOL
  return text.replace(/\n+$/, '').replace(/$/, '\n');
};

const substituteTweetTemplate = (
  templateElement: TemplateElement<TweetField>,
  tweet: Tweet,
  template: ParsedTweetTemplate,
  option: Required<TweetToStringOption>,
): string => {
  switch (templateElement.type) {
    case 'text':
      return templateElement.text;
    case 'placeholder':
      switch (templateElement.field) {
        case 'tweet.url':
          return `${baseURL(option.hostname)}/${tweet.author.username}/status/${
            tweet.id
          }`;
        case 'tweet.id':
          return tweet.id;
        case 'tweet.text':
          return tweet.text
            .map((entity) => tweetEntityToString(entity, template, option))
            .join('');
        case 'tweet.datetime':
          return toDatetime(tweet.created_at, option.timezone).format(
            option.datetimeFormat,
          );
        case 'user.name':
          return tweet.author.name;
        case 'user.username':
          return tweet.author.username;
        case 'user.url':
          return `${baseURL(option.hostname)}/${tweet.author.username}`;
      }
  }
  const _: never = templateElement;
  return '';
};

const tweetEntityToString = (
  entity: TweetEntity,
  template: ParsedTweetTemplate,
  option: Required<TweetToStringOption>,
): string => {
  switch (entity.type) {
    case 'text':
      return template.entity.text
        .map((element) => substituteEntityTextTemplate(element, entity))
        .join('');
    case 'url':
      return template.entity.url
        .map((element) => substituteEntityURLTemplate(element, entity))
        .join('');
    case 'hashtag':
      return template.entity.hashtag
        .map((element) => substituteEntityHashtagTemplate(element, entity))
        .join('');
    case 'cashtag':
      return template.entity.cashtag
        .map((element) => substituteEntityCashtagTemplate(element, entity))
        .join('');
    case 'mention':
      return template.entity.mention
        .map((element) =>
          substituteEntityMentionTemplate(element, entity, option),
        )
        .join('');
    default: {
      const _: never = entity;
      return '';
    }
  }
};

const substituteEntityTextTemplate = (
  templateElement: TemplateElement<EntityTextField>,
  entity: TweetEntityText,
): string => {
  switch (templateElement.type) {
    case 'text':
      return templateElement.text;
    case 'placeholder':
      switch (templateElement.field) {
        case 'text':
          return entity.text;
      }
  }
  const _: never = templateElement;
  return '';
};

const substituteEntityURLTemplate = (
  templateElement: TemplateElement<EntityURLField>,
  entity: TweetEntityURL,
): string => {
  switch (templateElement.type) {
    case 'text':
      return templateElement.text;
    case 'placeholder':
      switch (templateElement.field) {
        case 'text':
          return entity.text;
        case 'short_url':
          return entity.short_url;
        case 'expanded_url':
          return entity.expanded_url;
        case 'decoded_url':
          return entity.decoded_url;
        case 'title':
          return entity.title ?? '';
      }
  }
  const _: never = templateElement;
  return '';
};

const substituteEntityHashtagTemplate = (
  templateElement: TemplateElement<EntityHashtagField>,
  entity: TweetEntityHashtag,
): string => {
  switch (templateElement.type) {
    case 'text':
      return templateElement.text;
    case 'placeholder':
      switch (templateElement.field) {
        case 'text':
          return entity.text;
        case 'tag':
          return entity.tag;
        case 'hashmoji':
          return entity.hashmoji ?? '';
      }
  }
  const _: never = templateElement;
  return '';
};

const substituteEntityCashtagTemplate = (
  templateElement: TemplateElement<EntityCashtagField>,
  entity: TweetEntityCashtag,
): string => {
  switch (templateElement.type) {
    case 'text':
      return templateElement.text;
    case 'placeholder':
      switch (templateElement.field) {
        case 'text':
          return entity.text;
        case 'tag':
          return entity.tag;
      }
  }
  const _: never = templateElement;
  return '';
};

const substituteEntityMentionTemplate = (
  templateElement: TemplateElement<EntityMentionField>,
  entity: TweetEntityMention,
  option: Required<TweetToStringOption>,
): string => {
  switch (templateElement.type) {
    case 'text':
      return templateElement.text;
    case 'placeholder':
      switch (templateElement.field) {
        case 'text':
          return entity.text;
        case 'username':
          return entity.username;
        case 'user_url':
          return `${baseURL(option.hostname)}/${entity.username}`;
      }
  }
  const _: never = templateElement;
  return '';
};

const mediaListToString = (
  mediaList: Media[],
  template: ParsedTweetTemplate,
): string => {
  // media to string
  const text = mediaList
    .map((media) => mediaToString(media, template))
    .join('');
  // EOL
  return text.replace(/\n+$/, '').replace(/$/, '\n');
};

const mediaToString = (media: Media, template: ParsedTweetTemplate): string => {
  switch (media.type) {
    case 'photo':
      return template.media.photo
        .map((element) => substituteMediaPhotoTemplate(element, media))
        .join('');
    case 'video':
      return template.media.video
        .map((element) => substituteMediaVideoTemplate(element, media))
        .join('');
  }
  const _: never = media;
  return '';
};

const substituteMediaPhotoTemplate = (
  templateElement: TemplateElement<MediaPhotoField>,
  media: MediaPhoto,
): string => {
  switch (templateElement.type) {
    case 'text':
      return templateElement.text;
    case 'placeholder':
      switch (templateElement.field) {
        case 'url':
          return media.url;
      }
  }
  const _: never = templateElement;
  return '';
};

const substituteMediaVideoTemplate = (
  templateElement: TemplateElement<MediaVideoField>,
  media: MediaVideo,
): string => {
  switch (templateElement.type) {
    case 'text':
      return templateElement.text;
    case 'placeholder':
      switch (templateElement.field) {
        case 'thumbnail':
          return media.thumbnail;
      }
  }
  const _: never = templateElement;
  return '';
};

const quoteText = (text: string): string => {
  // if the text is emapty, do not add EOL
  if (!text) {
    return '';
  }
  return text
    .replace(/\n+$/, '')
    .split('\n')
    .map((line) => `>${line}\n`)
    .join('');
};
