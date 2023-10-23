import { ErrorObject } from 'ajv';
import { TrashboxRecord } from '~/lib/clipboard';

declare const validate: {
  (data: unknown): data is TrashboxRecord[];
  errors: ErrorObject[] | null;
};
export default validate;
