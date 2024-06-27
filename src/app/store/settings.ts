import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
  Hostname,
  Settings,
  TrashboxSort,
  defaultSettings,
  validateHostname,
  validateTimezone,
} from '~/lib/settings';
import { TweetSort } from '~/lib/tweet/types';

// state
type EditingSettings = Partial<Omit<Settings, 'tweetSort' | 'trashboxSort'>>;

type SettingsErrors = Partial<Record<keyof EditingSettings, string[]>>;

export interface SettingsState {
  current: Settings;
  editing: EditingSettings;
  errors: SettingsErrors;
}

const initialSettingsState = (): SettingsState => {
  return {
    current: defaultSettings(),
    editing: {},
    errors: {},
  };
};

const settings = createSlice({
  name: 'settings',
  initialState: initialSettingsState(),
  reducers: {
    initialize(state: SettingsState, action: PayloadAction<Settings>): void {
      state.current = { ...action.payload };
      state.editing = {};
      state.errors = {};
    },
    applyEdits(state: SettingsState): void {
      // reset errors
      state.errors = {};
      // validate editing value
      editingSettingsKeys.forEach((key) => {
        validateEditingValue(state, key);
      });
      // update if theare is no error
      if (Object.keys(state.errors).length === 0) {
        state.current = {
          ...state.current,
          ...state.editing,
        };
        state.editing = {};
      }
    },
    resetEdits(state: SettingsState): void {
      state.editing = {};
      state.errors = {};
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
    updateTweetSort(
      state: SettingsState,
      action: PayloadAction<TweetSort>,
    ): void {
      state.current.tweetSort = action.payload;
    },
    updateTrashboxSort(
      state: SettingsState,
      action: PayloadAction<TrashboxSort>,
    ): void {
      state.current.trashboxSort = action.payload;
    },
  },
});

// reducer
export const settingsReducer = settings.reducer;

// actions
export const settingsActions: Readonly<typeof settings.actions> =
  settings.actions;

// utilities
const editingSettingsKeys: ReadonlyArray<keyof EditingSettings> = [
  'hostname',
  'timezone',
  'datetimeFormat',
] as const;

const validateFunctions = {
  hostname: validateHostname,
  timezone: validateTimezone,
  datetimeFormat: () => ({ ok: true as const }),
} as const;

const editSettings = <Key extends keyof EditingSettings>(
  state: SettingsState,
  key: Key,
  value: EditingSettings[Key],
): void => {
  if (state.current[key] !== value) {
    state.editing[key] = value;
  } else if (key in state.editing) {
    delete state.editing[key];
  }
};

const validateEditingValue = <Key extends keyof EditingSettings>(
  state: SettingsState,
  key: Key,
): void => {
  if (state.editing[key] !== undefined) {
    const result = validateFunctions[key](state.editing[key]);
    if (!result.ok) {
      state.errors[key] = result.error;
    }
  }
};
