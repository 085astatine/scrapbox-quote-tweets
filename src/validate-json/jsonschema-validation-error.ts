import { ErrorObject } from 'ajv';

export class JSONSchemaValidationError extends Error {
  readonly schema: object;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly data: any;
  readonly errors: ErrorObject[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(schema: object, data: any, errors: ErrorObject[]) {
    super();
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, JSONSchemaValidationError);
    }
    this.name = 'JSONSchemaValidationError';
    this.schema = schema;
    this.data = data;
    this.errors = errors;
  }
}
