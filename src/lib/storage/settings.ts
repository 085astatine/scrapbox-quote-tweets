import browser from 'webextension-polyfill';
import { settingsJSONSchema } from '~/jsonschema/settings';
import { JSONSchemaValidationError } from '~/validate-json/error';
import validateSettings from '~/validate-json/validate-settings';
import { Settings, defaultSettings } from '../settings';
import { logger } from './logger';

type SettingsRecord = {
  [key in keyof Settings as `settings_${key}`]: Settings[key];
};

const toRecord = (settings: Settings): SettingsRecord => {
  return Object.entries(settings).reduce((record, [key, value]) => {
    // @ts-expect-error Add prefix to settings keys
    record[`settings_${key}`] = value;
    return record;
  }, {}) as SettingsRecord;
};

const toSettings = (record: SettingsRecord): Settings => {
  // 'settings_'.length === 9
  return Object.entries(record).reduce((settings, [key, value]) => {
    // @ts-expect-error Remove prefix from record keys
    settings[key.substring(9)] = value;
    return settings;
  }, {}) as Settings;
};

export const saveSettings = async (settings: Settings): Promise<void> => {
  logger.debug('save settings');
  // JSON Schema validation
  if (!validateSettings(settings)) {
    throw new JSONSchemaValidationError(
      settingsJSONSchema,
      settings,
      validateSettings.errors ?? [],
    );
  }
  // set to storage
  await browser.storage.local.set(toRecord(settings));
};

export const loadSettings = async (): Promise<Settings | null> => {
  logger.debug('load settings');
  // load from storage
  const record = (await browser.storage.local.get(
    toRecord(defaultSettings()),
  )) as SettingsRecord;
  const data = toSettings(record);
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
