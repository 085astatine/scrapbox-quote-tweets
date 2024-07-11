import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import equal from 'fast-deep-equal';
import type { Dispatch } from 'redux';
import {
  type Hostname,
  type Settings,
  defaultSettings,
  validateSettingsFunctions,
} from '~/lib/settings';
import type { OnChangedSettings } from '~/lib/storage/settings';
import {
  type TweetTemplate,
  defaultTweetTemplate,
  validateTweetTemplate,
} from '~/lib/tweet/tweet-template';

// state
type EditingSettings = Partial<Settings>;
type EditingTweetTemplate = Partial<TweetTemplate>;
type SettingsErrors = Partial<
  Record<keyof Settings | keyof TweetTemplate, string[]>
>;

export type UpdateTrigger = 'none' | 'self' | 'interrupt';

export interface SettingsState {
  currentSettings: Settings;
  editingSettings: EditingSettings;
  currentTemplate: TweetTemplate;
  editingTemplate: EditingTweetTemplate;
  errors: SettingsErrors;
  updateTrigger: UpdateTrigger;
}

const initialSettingsState = (): SettingsState => {
  return {
    currentSettings: defaultSettings(),
    editingSettings: {},
    currentTemplate: defaultTweetTemplate(),
    editingTemplate: {},
    errors: {},
    updateTrigger: 'none',
  };
};

const settings = createSlice({
  name: 'settings',
  initialState: initialSettingsState(),
  reducers: {
    initialize(
      state: SettingsState,
      action: PayloadAction<{ settings: Settings; template: TweetTemplate }>,
    ): void {
      state.currentSettings = { ...action.payload.settings };
      state.editingSettings = {};
      state.currentTemplate = { ...action.payload.template };
      state.editingTemplate = {};
      state.errors = {};
      state.updateTrigger = 'none';
    },
    applyEdits(state: SettingsState): void {
      // reset errors
      state.errors = {};
      // validate editing value
      settingsKeys.forEach((key) => {
        validateEditingSettings(state, key);
      });
      templateKeys.forEach((key) => {
        if (key !== 'quote') {
          validateEditingTemplate(state, key);
        }
      });
      // update if theare is no error
      if (Object.keys(state.errors).length === 0) {
        state.currentSettings = {
          ...state.currentSettings,
          ...state.editingSettings,
        };
        state.editingSettings = {};
        state.updateTrigger = 'self';
      }
    },
    resetEdits(state: SettingsState): void {
      state.editingSettings = {};
      state.editingTemplate = {};
      state.errors = {};
    },
    resetUpdateTrigger(state: SettingsState): void {
      state.updateTrigger = 'none';
    },
    editHostname(state: SettingsState, action: PayloadAction<Hostname>): void {
      editSettings(state, 'hostname', action.payload);
    },
    editTimezone(state: SettingsState, action: PayloadAction<string>): void {
      editSettings(state, 'timezone', action.payload);
    },
    editDatetimeFormat(
      state: SettingsState,
      action: PayloadAction<string>,
    ): void {
      editSettings(state, 'datetimeFormat', action.payload);
    },
    editTemplate: <Key extends keyof TweetTemplate>(
      state: SettingsState,
      action: PayloadAction<{ type: Key; value: TweetTemplate[Key] }>,
    ): void => {
      editTemplate(state, action.payload.type, action.payload.value);
    },
    updateByInterrupt(
      state: SettingsState,
      action: PayloadAction<Partial<Settings>>,
    ): void {
      const previousSettings = { ...state.currentSettings };
      state.currentSettings = {
        ...state.currentSettings,
        ...action.payload,
      };
      settingsKeys.forEach((key) => {
        resetEditingValueByInterrupt(state, key, previousSettings);
      });
      switch (state.updateTrigger) {
        case 'none':
          if (Object.keys(state.editingSettings).length > 0) {
            state.updateTrigger = 'interrupt';
          }
          break;
        case 'self':
          state.updateTrigger = 'none';
          break;
      }
    },
  },
});

// reducer
export const settingsReducer = settings.reducer;

// actions
export const settingsActions: Readonly<typeof settings.actions> =
  settings.actions;

// storage listener
export const settingsStorageListener = (
  args: OnChangedSettings,
  dispatch: Dispatch,
): void => {
  // settings:*
  if (args.settings !== undefined && Object.keys(settings).length > 0) {
    dispatch(settingsActions.updateByInterrupt(args.settings));
  }
};

// utilities
const settingsKeys: ReadonlyArray<keyof Settings> = [
  'hostname',
  'timezone',
  'datetimeFormat',
] as const;

const templateKeys: ReadonlyArray<keyof TweetTemplate> = [
  'tweet',
  'footer',
  'entityText',
  'entityUrl',
  'entityHashtag',
  'entityCashtag',
  'entityMention',
  'mediaPhoto',
  'mediaVideo',
  'quote',
] as const;

const editSettings = <Key extends keyof Settings>(
  state: SettingsState,
  key: Key,
  value: Settings[Key],
): void => {
  if (!equal(state.currentSettings[key], value)) {
    state.editingSettings[key] = value;
  } else if (key in state.editingSettings) {
    delete state.editingSettings[key];
  }
};

const editTemplate = <Key extends keyof TweetTemplate>(
  state: SettingsState,
  key: Key,
  value: TweetTemplate[Key],
): void => {
  if (!equal(state.currentTemplate[key], value)) {
    state.editingTemplate[key] = value;
  } else if (key in state.editingTemplate) {
    delete state.editingTemplate[key];
  }
};

const validateEditingSettings = <Key extends keyof Settings>(
  state: SettingsState,
  key: Key,
): void => {
  if (state.editingSettings[key] !== undefined) {
    const validate = validateSettingsFunctions[key];
    if (validate !== undefined) {
      const result = validate(state.editingSettings[key]);
      if (!result.ok) {
        state.errors[key] = result.error;
      }
    }
  }
};

const validateEditingTemplate = <
  Key extends Exclude<keyof TweetTemplate, 'quote'>,
>(
  state: SettingsState,
  key: Key,
): void => {
  if (state.editingTemplate[key] !== undefined) {
    const result = validateTweetTemplate(key, state.editingTemplate[key]);
    if (!result.ok) {
      state.errors[key] = result.error;
    }
  }
};

const resetEditingValueByInterrupt = <Key extends keyof Settings>(
  state: SettingsState,
  key: Key,
  previousSettings: Settings,
): void => {
  if (equal(state.currentSettings[key], state.editingSettings[key])) {
    delete state.editingSettings[key];
    delete state.errors[key];
  } else if (!equal(state.currentSettings[key], previousSettings[key])) {
    state.editingSettings[key] = previousSettings[key];
  }
};
