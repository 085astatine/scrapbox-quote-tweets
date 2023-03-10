import moment from 'moment';
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
        case 'tweet.timestamp':
          return tweet.timestamp.toString();
        case 'user.id':
          return tweet.author.id;
        case 'user.name':
          return tweet.author.name;
        case 'user.username':
          return tweet.author.username;
        case 'date.iso':
          return moment(tweet.timestamp).toISOString(true);
        case 'date.year':
          return moment(tweet.timestamp).format('YYYY');
        case 'date.month':
          return moment(tweet.timestamp).format('MM');
        case 'date.day':
          return moment(tweet.timestamp).format('DD');
        case 'date.hours':
          return moment(tweet.timestamp).format('HH');
        case 'date.minutes':
          return moment(tweet.timestamp).format('mm');
        case 'date.seconds':
          return moment(tweet.timestamp).format('ss');
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
