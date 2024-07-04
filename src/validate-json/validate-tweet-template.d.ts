import { ErrorObject } from 'ajv';
import { TweetTemplate } from '~/lib/tweet/tweet-template';

declare const validate: {
  (data: unknown): data is TweetTemplate;
  errors: ErrorObject[] | null;
};
export default validate;
