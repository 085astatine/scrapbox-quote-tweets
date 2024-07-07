import { ErrorObject } from 'ajv';
import { TrashboxSort } from '~/lib/trashbox';

declare const validate: {
  (data: unknown): data is TrashboxSort;
  errors: ErrorObject[] | null;
};
export default validate;
