import { ErrorObject } from 'ajv';
import { DeletedTweetID } from '~/lib/tweet/types';

declare const validate: {
  (data: unknown): data is DeletedTweetID[];
  errors: ErrorObject[] | null;
};
export default validate;
