import { Tweet } from './tweet';
import { toDate } from './tweet-date';
import {
  ParsedTweetTemplate,
  TemplateElement,
  TweetField,
  TweetTemplate,
  parseTweetTemplate,
} from './tweet-template';

export const tweetToString = (
  tweet: Tweet,
  template: TweetTemplate
): string => {
  const parsedTemplate = parseTweetTemplate(template);
  const filledOutTemplate = parsedTemplate.tweet
    .map((element) => fillTweetTemplateElement(element, tweet, parsedTemplate))
    .join('');
  return filledOutTemplate;
};

const fillTweetTemplateElement = (
  templateElement: TemplateElement<TweetField>,
  tweet: Tweet,
  template: ParsedTweetTemplate
): string => {
  switch (templateElement.type) {
    case 'text':
      return templateElement.text;
    case 'placeholder':
      switch (templateElement.field) {
        case 'tweet.url':
          return `https://twitter.com/${tweet.author.username}/status/${tweet.id}`;
        case 'tweet.id':
          return tweet.id;
        case 'user.id':
          return tweet.author.id;
        case 'user.name':
          return tweet.author.name;
        case 'user.username':
          return tweet.author.username;
        case 'date.iso':
          return toDate(tweet.timestamp, template.timezone).format();
        case 'date.year':
          return toDate(tweet.timestamp, template.timezone).format('YYYY');
        case 'date.month':
          return toDate(tweet.timestamp, template.timezone).format('MM');
        case 'date.day':
          return toDate(tweet.timestamp, template.timezone).format('DD');
        case 'date.hours':
          return toDate(tweet.timestamp, template.timezone).format('HH');
        case 'date.minutes':
          return toDate(tweet.timestamp, template.timezone).format('mm');
        case 'date.seconds':
          return toDate(tweet.timestamp, template.timezone).format('ss');
        case 'date.timestamp':
          return tweet.timestamp.toString();
        default: {
          const _: never = templateElement.field;
          return _;
        }
      }
    default: {
      const _: never = templateElement;
      return _;
    }
  }
};
