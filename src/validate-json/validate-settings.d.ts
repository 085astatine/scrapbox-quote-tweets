import { ErrorObject } from 'ajv';
import { Settings } from '~/lib/settings';

declare const validate: {
  (data: unknown): data is Settings;
  errors: ErrorObject[] | null;
};
export default validate;
