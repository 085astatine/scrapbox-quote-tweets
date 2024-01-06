import browser from 'webextension-polyfill';
import { settingsJSONSchema } from '~/jsonschema/settings';
import { JSONSchemaValidationError } from '~/validate-json/error';
import validateSettings from '~/validate-json/validate-settings';
import { Settings } from '../settings';

const key = 'settings';

export const saveSettings = async (settings: Settings): Promise<void> => {
  // JSON Schema validation
  if (!validateSettings(settings)) {
    throw new JSONSchemaValidationError(
      settingsJSONSchema,
      settings,
      validateSettings.errors ?? [],
    );
  }
  // set to storage
  await browser.storage.local.set({ [key]: settings });
};

export const loadSettings = async (): Promise<Settings | null> => {
  // load from storage
  const data = await browser.storage.local
    .get(key)
    .then((record) => record[key]);
  if (data === undefined) {
    return null;
  }
  // JSON Schema validation
  if (!validateSettings(data)) {
    throw new JSONSchemaValidationError(
      settingsJSONSchema,
      data,
      validateSettings.errors ?? [],
    );
  }
  return data;
};
