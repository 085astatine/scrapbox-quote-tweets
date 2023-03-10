import dayjs from 'dayjs';
import { Tweet } from './tweet';
import {
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
    .map((element) => fillTweetTemplateElement(element, tweet))
    .join('');
  return filledOutTemplate;
};

const fillTweetTemplateElement = (
  templateElement: TemplateElement<TweetField>,
  tweet: Tweet
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
          return dayjs(tweet.timestamp).format();
        case 'date.year':
          return dayjs(tweet.timestamp).format('YYYY');
        case 'date.month':
          return dayjs(tweet.timestamp).format('MM');
        case 'date.day':
          return dayjs(tweet.timestamp).format('DD');
        case 'date.hours':
          return dayjs(tweet.timestamp).format('HH');
        case 'date.minutes':
          return dayjs(tweet.timestamp).format('mm');
        case 'date.seconds':
          return dayjs(tweet.timestamp).format('ss');
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
