import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import equal from 'fast-deep-equal';
import type { Dispatch } from 'redux';
import {
  type Settings,
  defaultSettings,
  settingsKeys,
  validateSettingsFunctions,
} from '~/lib/settings';
import type { OnChangedSettings } from '~/lib/storage/settings';
import type { OnChangedTweetTemplate } from '~/lib/storage/tweet-template';
import {
  type TweetTemplate,
  defaultTweetTemplate,
  tweetTemplateKeys,
  validateTweetTemplate,
} from '~/lib/tweet/tweet-template';

// state
export type SettingsErrors = Partial<Record<keyof Settings, string[]>>;
export type TemplateErrors = Partial<Record<keyof TweetTemplate, string[]>>;

export type UpdateTrigger = 'none' | 'self' | 'interrupt';

export type SettingsState = {
  currentSettings: Settings;
  editingSettings: Partial<Settings>;
  settingsErrors: SettingsErrors;
  currentTemplate: TweetTemplate;
  editingTemplate: Partial<TweetTemplate>;
  templateErrors: TemplateErrors;
  updateTrigger: UpdateTrigger;
};

const initialSettingsState = (): SettingsState => {
  return {
    currentSettings: defaultSettings(),
    editingSettings: {},
    settingsErrors: {},
    currentTemplate: defaultTweetTemplate(),
    editingTemplate: {},
    templateErrors: {},
    updateTrigger: 'none',
  };
};

// reducers
const _initialize = (
  state: SettingsState,
  action: PayloadAction<{ settings: Settings; template: TweetTemplate }>,
): void => {
  state.currentSettings = { ...action.payload.settings };
  state.editingSettings = {};
  state.settingsErrors = {};
  state.currentTemplate = { ...action.payload.template };
  state.editingTemplate = {};
  state.templateErrors = {};
  state.updateTrigger = 'none';
};

const _applyEdits = (state: SettingsState): void => {
  // reset errors
  state.settingsErrors = {};
  state.templateErrors = {};
  // validate editing value
  settingsKeys.forEach((key) => {
    validateEditingSettings(state, key);
  });
  tweetTemplateKeys.forEach((key) => {
    if (key !== 'quote') {
      validateEditingTemplate(state, key);
    }
  });
  // update if theare is no error
  if (
    Object.keys(state.settingsErrors).length === 0 &&
    Object.keys(state.templateErrors).length === 0
  ) {
    state.currentSettings = {
      ...state.currentSettings,
      ...state.editingSettings,
    };
    state.editingSettings = {};
    state.currentTemplate = {
      ...state.currentTemplate,
      ...state.editingTemplate,
    };
    state.editingTemplate = {};
    state.updateTrigger = 'self';
  }
};

const _resetEdits = (state: SettingsState): void => {
  state.editingSettings = {};
  state.settingsErrors = {};
  state.editingTemplate = {};
  state.templateErrors = {};
};

const _resetUpdateTrigger = (state: SettingsState): void => {
  state.updateTrigger = 'none';
};

const _editSettings = <Key extends keyof Settings>(
  state: SettingsState,
  {
    payload: { type, value },
  }: PayloadAction<{ type: Key; value: Settings[Key] }>,
): void => {
  if (!equal(state.currentSettings[type], value)) {
    state.editingSettings[type] = value;
  } else if (type in state.editingSettings) {
    delete state.editingSettings[type];
  }
};

const _editTemplate = <Key extends keyof TweetTemplate>(
  state: SettingsState,
  {
    payload: { type, value },
  }: PayloadAction<{ type: Key; value: TweetTemplate[Key] }>,
): void => {
  if (!equal(state.currentTemplate[type], value)) {
    state.editingTemplate[type] = value;
  } else if (type in state.editingTemplate) {
    delete state.editingTemplate[type];
  }
};

const _updateByInterrupt = (
  state: SettingsState,
  action: PayloadAction<{
    settings?: Partial<Settings>;
    template?: Partial<TweetTemplate>;
  }>,
): void => {
  // update settings
  if (action.payload.settings !== undefined) {
    const previous = { ...state.currentSettings };
    state.currentSettings = {
      ...state.currentSettings,
      ...action.payload.settings,
    };
    settingsKeys.forEach((key) => {
      resetEditingSettingsByInterrupt(state, key, previous);
    });
  }
  // update template
  if (action.payload.template !== undefined) {
    const previous = { ...state.currentTemplate };
    state.currentTemplate = {
      ...state.currentTemplate,
      ...action.payload.template,
    };
    tweetTemplateKeys.forEach((key) => {
      resetEditingTemplateByInterrupt(state, key, previous);
    });
  }
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
};

// slice
const settings = createSlice({
  name: 'settings',
  initialState: initialSettingsState(),
  reducers: {
    initialize: _initialize,
    applyEdits: _applyEdits,
    resetEdits: _resetEdits,
    resetUpdateTrigger: _resetUpdateTrigger,
    editSettings: _editSettings,
    editTemplate: _editTemplate,
    updateByInterrupt: _updateByInterrupt,
  },
});

// reducer
export const settingsReducer = settings.reducer;

// actions
export const settingsActions: Readonly<typeof settings.actions> =
  settings.actions;

// storage listener
export const settingsStorageListener = (
  args: OnChangedSettings & OnChangedTweetTemplate,
  dispatch: Dispatch,
): void => {
  // settings & tweetTemplate
  const settings: Partial<Settings> = args.settings || {};
  const template: Partial<TweetTemplate> = args.tweetTemplate || {};
  const update = {
    ...(Object.keys(settings).length > 0 && { settings }),
    ...(Object.keys(template).length > 0 && { template }),
  };
  if (Object.keys(update).length > 0) {
    dispatch(settingsActions.updateByInterrupt(update));
  }
};

// utilities
const validateEditingSettings = <Key extends keyof Settings>(
  state: SettingsState,
  key: Key,
): void => {
  if (state.editingSettings[key] !== undefined) {
    const validate = validateSettingsFunctions[key];
    if (validate !== undefined) {
      const result = validate(state.editingSettings[key]);
      if (!result.ok) {
        state.settingsErrors[key] = result.error;
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
      state.templateErrors[key] = result.error;
    }
  }
};

const resetEditingSettingsByInterrupt = <Key extends keyof Settings>(
  state: SettingsState,
  key: Key,
  previous: Settings,
): void => {
  if (equal(state.currentSettings[key], state.editingSettings[key])) {
    delete state.editingSettings[key];
    delete state.settingsErrors[key];
  } else if (!equal(state.currentSettings[key], previous[key])) {
    state.editingSettings[key] = previous[key];
  }
};

const resetEditingTemplateByInterrupt = <Key extends keyof TweetTemplate>(
  state: SettingsState,
  key: Key,
  previous: TweetTemplate,
): void => {
  if (equal(state.currentTemplate[key], state.editingTemplate[key])) {
    delete state.editingTemplate[key];
    delete state.templateErrors[key];
  } else if (!equal(state.currentTemplate[key], previous[key])) {
    state.editingTemplate[key] = previous[key];
  }
};
