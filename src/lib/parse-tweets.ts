import {
  ApiV2Includes,
  MediaObjectV2,
  TweetEntityUrlV2,
  TweetV2,
  TweetV2LookupResult,
} from 'twitter-api-v2';
import { CoreLogger } from 'typescript-logging';
import { loggerProvider } from './logger';
import { Tweet, TweetEntity, TweetEntityMedia, TweetEntityURL } from './tweet';

const defaultLogger = loggerProvider.getCategory('tweet');

export class ParseTweetError extends Error {
  readonly tweetID: string;

  constructor(tweetID: string, message: string) {
    super(message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ParseTweetError);
    }
    this.name = 'ParseTweetError';
    this.tweetID = tweetID;
  }
}

export const parseTweets = (
  response: TweetV2LookupResult,
  logger: CoreLogger = defaultLogger
): Tweet[] => {
  logger.debug('parse tweets', response);
  return response.data.map((tweet) =>
    parseTweet(tweet, response.includes, logger)
  );
};

const parseTweet = (
  tweet: TweetV2,
  includes: ApiV2Includes | undefined,
  logger: CoreLogger
): Tweet => {
  logger.debug(`parse tweet ${tweet.id}`);
  const timestamp = parseTimestamp(tweet);
  const text = parseText(tweet, includes, logger);
  return {
    id: tweet.id,
    timestamp,
    text,
  };
};

const parseTimestamp = (tweet: TweetV2): number => {
  if (tweet.created_at === undefined) {
    throw new ParseTweetError(tweet.id, 'tweet.created_at is undefined');
  }
  return new Date(tweet.created_at).getTime();
};

interface TweetPosition {
  start: number;
  end: number;
}

interface TweetEntityWithPosition<Entity> extends TweetPosition {
  entity: Entity;
}

type TweetEntityGenerator<ApiEntity extends TweetPosition, Entity> = (
  text: string,
  data: ApiEntity,
  logger: CoreLogger
) => TweetEntityWithPosition<Entity>;

const parseText = (
  tweet: TweetV2,
  includes: ApiV2Includes | undefined,
  logger: CoreLogger
): TweetEntity[] => {
  // text
  const text: TweetEntityWithPosition<TweetEntity>[] = [
    {
      start: 0,
      end: tweet.text.length,
      entity: {
        type: 'text',
        text: tweet.text,
      },
    },
  ];
  // entities.urls
  tweet?.entities?.urls.forEach((url) =>
    splitText(
      text,
      url,
      toTweetEntityURL(tweet.id, includes?.media ?? []),
      logger
    )
  );
  logger.debug('text entities', text);
  return text.map((entity) => entity.entity);
};

const splitText = <ApiEntity extends TweetPosition>(
  entities: TweetEntityWithPosition<TweetEntity>[],
  entity: ApiEntity,
  generator: TweetEntityGenerator<ApiEntity, TweetEntity>,
  logger: CoreLogger
) => {
  // find the source entity that includes target
  const source = entities.find(
    (source) => source.start <= entity.start && entity.end <= source.end
  );
  if (source === undefined) {
    return;
  }
  const sourceIndex = entities.indexOf(source);
  // check if entity.type is 'text'
  if (source.entity.type !== 'text') {
    logger.warn('the source type is not text', source);
  }
  // split text
  const headText = source.entity.text.slice(0, entity.start - source.start);
  const bodyText = source.entity.text.slice(
    entity.start - source.start,
    entity.end - source.start
  );
  const tailText = source.entity.text.slice(
    entity.end - source.start,
    source.end - source.start
  );
  logger.debug('split text', {
    head: headText,
    body: bodyText,
    tail: tailText,
  });
  // insert entities
  const splittedEntities: TweetEntityWithPosition<TweetEntity>[] = [];
  // head entity
  if (headText.length !== 0) {
    splittedEntities.push({
      entity: {
        type: 'text',
        text: headText,
      },
      start: source.start,
      end: entity.start,
    });
  }
  // body entity
  if (bodyText.length !== 0) {
    splittedEntities.push(generator(bodyText, entity, logger));
  }
  // tail entity
  if (tailText.length !== 0) {
    splittedEntities.push({
      entity: { type: 'text', text: tailText },
      start: entity.end,
      end: source.end,
    });
  }
  entities.splice(sourceIndex, 1, ...splittedEntities);
};

const toTweetEntityURL = (
  tweetID: string,
  media: readonly MediaObjectV2[]
): TweetEntityGenerator<
  TweetEntityUrlV2,
  TweetEntityURL | TweetEntityMedia
> => {
  return (
    text: string,
    entity: TweetEntityUrlV2
  ): TweetEntityWithPosition<TweetEntityURL | TweetEntityMedia> => {
    // position
    const position = {
      start: entity.start,
      end: entity.end,
    };
    // media
    // @ts-expect-error TweetEntityUrlV2.media_key is not defined
    const mediaKey: string | undefined = entity.media_key;
    if (mediaKey !== undefined) {
      const medium = media.find((medium) => medium.media_key === mediaKey);
      if (medium === undefined) {
        throw new ParseTweetError(
          tweetID,
          `media_key(${mediaKey}) is not found`
        );
      }
      if (medium.url === undefined) {
        throw new ParseTweetError(
          tweetID,
          `url is not defined at media(media_key=${mediaKey})`
        );
      }
      return {
        entity: {
          type: 'media',
          text,
          media_type: medium.type,
          url: medium.url,
        },
        ...position,
      };
    }
    // url
    return {
      entity: {
        type: 'url',
        text,
        url: entity.expanded_url,
        display_url: entity.display_url,
        title: entity.title,
        description: entity.description,
      },
      ...position,
    };
  };
};
