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
      // hostname (base URL)
      if ('hostname' in state.editing) {
        const result = validateHostname(state.editing.hostname);
        if (!result.ok) {
          state.errors.hostname = result.error;
        }
      }
      // timezone
      if ('timezone' in state.editing) {
        const result = validateTimezone(state.editing.timezone);
        if (!result.ok) {
          state.errors.timezone = result.error;
        }
      }
      // datetimeFormat: no validation
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

// reducer
export const settingsReducer = settings.reducer;

// actions
export const settingsActions: Readonly<typeof settings.actions> =
  settings.actions;
