import equal from 'fast-deep-equal';
import browser from 'webextension-polyfill';
import { settingsJSONSchema } from '~/jsonschema/settings';
import { JSONSchemaValidationError } from '~/validate-json/error';
import validateSettings from '~/validate-json/validate-settings';
import { Settings, defaultSettings } from '../settings';
import { logger } from './logger';
import { recordTo, toRecord } from './to-record';

// load & save
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
  await browser.storage.local.set(toRecord(settings, prefix) as SettingsRecord);
};

export const loadSettings = async (): Promise<Settings> => {
  logger.debug('load settings');
  // load from storage
  const request = toRecord(defaultSettings(), prefix) as SettingsRecord;
  const record = await browser.storage.local.get(request);
  const data = recordTo(record, prefix);
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

// record
const prefix = 'settings' as const;

type SettingsRecord = {
  [Key in keyof Settings as `settings_${Key}`]: Settings[Key];
};

// key
const settingsRecordKeys: ReadonlyArray<keyof SettingsRecord> = [
  'settings_hostname',
  'settings_timezone',
  'settings_datetimeFormat',
] as const;

export const isSettingsRecordKey = (
  key: string,
): key is keyof SettingsRecord => {
  return (settingsRecordKeys as ReadonlyArray<string>).includes(key);
};

// storage listener
export type OnChangedSettings = {
  settings?: Partial<Settings>;
};

export const onChangedSettings = (
  changes: browser.Storage.StorageAreaOnChangedChangesType,
): OnChangedSettings => {
  const record = Object.entries(changes).reduce<Partial<SettingsRecord>>(
    (record, [key, { oldValue, newValue }]) => {
      if (
        isSettingsRecordKey(key) &&
        !equal(oldValue, newValue) &&
        newValue !== undefined
      ) {
        record[key] = newValue;
      }
      return record;
    },
    {},
  );
  const settings = recordTo(record, prefix) as Partial<Settings>;
  return {
    ...(Object.keys(settings).length > 0 && { settings }),
  };
};
