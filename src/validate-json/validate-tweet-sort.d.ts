import { ErrorObject } from 'ajv';
import { TweetSort } from '~/lib/tweet/types';

declare const validate: {
  (data: unknown): data is TweetSort;
  errors: ErrorObject[] | null;
};
export default validate;
