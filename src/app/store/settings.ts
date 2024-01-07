import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { isValidTimezone } from '~/lib/datetime';
import {
  Hostname,
  Settings,
  defaultSettings,
  isHostname,
} from '~/lib/settings';
import { DeletedTweetsSort, TweetSort } from '~/lib/tweet/sort-tweets';

// state
type EditingSettings = Partial<
  Omit<Settings, 'tweetSort' | 'deletedTweetsSort'>
>;

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

export const settings = createSlice({
  name: 'settings',
  initialState: initialSettingsState(),
  reducers: {
    initialize(state: SettingsState, action: PayloadAction<Settings>): void {
      state.current = { ...action.payload };
      state.editing = {};
      state.errors = {};
    },
    update(state: SettingsState): void {
      // reset errors
      state.errors = {};
      // hostname (base URL)
      if ('hostname' in state.editing) {
        const hostname = state.editing.hostname;
        if (!isHostname(hostname)) {
          state.errors.hostname = [`"${hostname}" is not valid hostname.`];
        }
      }
      // timezone
      if ('timezone' in state.editing) {
        const timezone = state.editing.timezone;
        if (!isValidTimezone(timezone)) {
          state.errors.timezone = [
            `"${timezone}" is not valid timezone.`,
            'Please input the time zone in the IANA database.',
            'Examples: "UTC", "Asia/Tokyo", "America/New_York"',
          ];
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
    reset(state: SettingsState): void {
      state.editing = {};
      state.errors = {};
    },
    updateHostname(
      state: SettingsState,
      action: PayloadAction<Hostname>,
    ): void {
      editSettings(state, 'hostname', action.payload);
    },
    updateTimezone(state: SettingsState, action: PayloadAction<string>): void {
      editSettings(state, 'timezone', action.payload);
    },
    updateDatetimeFormat(
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
    updateDeletedTweetsSort(
      state: SettingsState,
      action: PayloadAction<DeletedTweetsSort>,
    ): void {
      state.current.deletedTweetsSort = action.payload;
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

// actions
export const settingsActions: Readonly<typeof settings.actions> =
  settings.actions;
