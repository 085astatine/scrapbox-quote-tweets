import { ErrorObject } from 'ajv';
import { DeletedTweetIDs } from '~/lib/tweet/deleted-tweets';

declare const validate: {
  (data: unknown): data is DeletedTweetIDs[];
  errors: ErrorObject[] | null;
};
export default validate;
