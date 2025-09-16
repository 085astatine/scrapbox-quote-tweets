import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { Dispatch } from 'redux';
import type { ScrapboxIcon } from '~/lib/settings';
import type { OnChangedSettings } from '~/lib/storage/settings';

// state
export type SettingsState = {
  scrapboxIcon: ScrapboxIcon;
};

// reducers
const update = (
  state: SettingsState,
  action: PayloadAction<ScrapboxIcon>,
): void => {
  state.scrapboxIcon = action.payload;
};

// slice
const slice = createSlice({
  name: 'settings',
  initialState: {
    scrapboxIcon: 'scrapbox' as const,
  },
  reducers: {
    update,
  },
});

// reducer
export const settingsReducer = slice.reducer;

// actions
export const settingsActions: Readonly<typeof slice.actions> = slice.actions;

// storage listener
export const settingsStorageListener = (
  args: OnChangedSettings,
  dispatch: Dispatch,
): void => {
  // settings.scrapboxIcon
  if (args?.settings?.scrapboxIcon !== undefined) {
    dispatch(settingsActions.update(args?.settings?.scrapboxIcon));
  }
};
