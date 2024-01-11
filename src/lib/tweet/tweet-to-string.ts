import { defaultTimezone, toDatetime } from '../datetime';
import { Hostname, baseURL } from '../settings';
import {
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
  const filledOutTemplate = parsedTemplate.tweet
    .map((element) =>
      fillTweetTemplateElement(element, tweet, parsedTemplate, options),
    )
    .join('');
  return filledOutTemplate;
};

const fillTweetTemplateElement = (
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
            .map((entity) => fillTweetEntity(entity, template))
            .join('');
        case 'tweet.datetime':
          return toDatetime(tweet.created_at, option.timezone).format(
            option.datetimeFormat,
          );
        case 'user.name':
          return tweet.author.name;
        case 'user.username':
          return tweet.author.username;
      }
  }
  const _: never = templateElement;
  return '';
};

const fillTweetEntity = (
  entity: TweetEntity,
  template: ParsedTweetTemplate,
): string => {
  switch (entity.type) {
    case 'text':
      return template.entity.text
        .map((element) => fillTweetEntityText(element, entity))
        .join('');
    case 'url':
      return template.entity.url
        .map((element) => fillTweetEntityURL(element, entity))
        .join('');
    case 'hashtag':
      return template.entity.hashtag
        .map((element) => fillTweetEntityHashtag(element, entity))
        .join('');
    case 'cashtag':
      return template.entity.cashtag
        .map((element) => fillTweetEntityCashtag(element, entity))
        .join('');
    case 'mention':
      return template.entity.mention
        .map((element) => fillTweetEntityMention(element, entity))
        .join('');
    default: {
      const _: never = entity;
      return '';
    }
  }
};

const fillTweetEntityText = (
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

const fillTweetEntityURL = (
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

const fillTweetEntityHashtag = (
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

const fillTweetEntityCashtag = (
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

const fillTweetEntityMention = (
  templateElement: TemplateElement<EntityMentionField>,
  entity: TweetEntityMention,
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
      }
  }
  const _: never = templateElement;
  return '';
};
