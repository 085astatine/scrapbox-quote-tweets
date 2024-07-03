import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import equal from 'fast-deep-equal';
import { Dispatch } from 'redux';
import {
  Hostname,
  Settings,
  TrashboxSort,
  defaultSettings,
  validateFunctions,
} from '~/lib/settings';
import { StorageListenerArguments } from '~/lib/storage/listener';
import { TweetSort } from '~/lib/tweet/types';

// state
type EditingSettings = Partial<Omit<Settings, 'tweetSort' | 'trashboxSort'>>;

type SettingsErrors = Partial<Record<keyof EditingSettings, string[]>>;

export type UpdateTrigger = 'none' | 'self' | 'interrupt';

export interface SettingsState {
  current: Settings;
  editing: EditingSettings;
  errors: SettingsErrors;
  updateTrigger: UpdateTrigger;
}

const initialSettingsState = (): SettingsState => {
  return {
    current: defaultSettings(),
    editing: {},
    errors: {},
    updateTrigger: 'none',
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
      state.updateTrigger = 'none';
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
        state.updateTrigger = 'self';
      }
    },
    resetEdits(state: SettingsState): void {
      state.editing = {};
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
    updateByInterrupt(
      state: SettingsState,
      action: PayloadAction<Partial<Settings>>,
    ): void {
      const previousState = { ...state.current };
      state.current = {
        ...state.current,
        ...action.payload,
      };
      editingSettingsKeys.forEach((key) => {
        resetEditingValueByInterrupt(state, key, previousState);
      });
      switch (state.updateTrigger) {
        case 'none':
          if (Object.keys(state.editing).length > 0) {
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
  args: StorageListenerArguments,
  dispatch: Dispatch,
): void => {
  // settings:*
  if (args.settings !== undefined && Object.keys(settings).length > 0) {
    dispatch(settingsActions.updateByInterrupt(args.settings));
  }
};

// utilities
const editingSettingsKeys: ReadonlyArray<keyof EditingSettings> = [
  'hostname',
  'timezone',
  'datetimeFormat',
] as const;

const editSettings = <Key extends keyof EditingSettings>(
  state: SettingsState,
  key: Key,
  value: EditingSettings[Key],
): void => {
  if (!equal(state.current[key], value)) {
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
    const validate = validateFunctions[key];
    if (validate !== undefined) {
      const result = validate(state.editing[key]);
      if (!result.ok) {
        state.errors[key] = result.error;
      }
    }
  }
};

const resetEditingValueByInterrupt = <Key extends keyof EditingSettings>(
  state: SettingsState,
  key: Key,
  previousState: Settings,
): void => {
  if (equal(state.current[key], state.editing[key])) {
    delete state.editing[key];
    delete state.errors[key];
  } else if (!equal(state.current[key], previousState[key])) {
    state.editing[key] = previousState[key];
  }
};
