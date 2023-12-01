import { ErrorObject } from 'ajv';
import { Tweet } from '~/lib/tweet/tweet';

declare const validate: {
  (data: unknown): data is Tweet[];
  errors: ErrorObject[] | null;
};
export default validate;
