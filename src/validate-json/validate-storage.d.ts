import { ErrorObject } from 'ajv';
import { Storage } from '~/lib/storage/types';

declare const validate: {
  (data: unknown): data is Storage;
  errors: ErrorObject[] | null;
};
export default validate;
