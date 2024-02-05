import { ErrorObject } from 'ajv';
import { TweetID } from '~/lib/tweet/types';

declare const validate: {
  (data: unknown): data is TweetID[];
  errors: ErrorObject[] | null;
};
export default validate;
