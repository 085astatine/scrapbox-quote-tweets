import { storageJSONSchema } from '~/jsonschema/storage';
import { JSONSchemaValidationError } from '~/validate-json/error';
import validate from '~/validate-json/validate-storage';
import type { Storage } from './types';

export function validateStorage(value: unknown): asserts value is Storage {
  // JSONSchema validation
  if (!validate(value)) {
    throw new JSONSchemaValidationError(
      storageJSONSchema,
      value,
      validate.errors ?? [],
    );
  }
}
