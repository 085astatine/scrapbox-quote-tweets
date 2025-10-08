import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { Dispatch } from 'redux';
import type { ScrapboxIcon } from '~/lib/settings';
import type { OnChangedSettings } from '~/lib/storage/settings';

// state
export type SettingsState = {
  scrapboxIcon: ScrapboxIcon;
};

// reducers
const _update = (
  state: SettingsState,
  action: PayloadAction<ScrapboxIcon>,
): void => {
  state.scrapboxIcon = action.payload;
};

// selectors
const _selectScrapboxIcon = (state: SettingsState): ScrapboxIcon => {
  return state.scrapboxIcon;
};

// slice
const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    scrapboxIcon: 'scrapbox' as const,
  },
  reducers: {
    update: _update,
  },
  selectors: {
    selectScrapboxIcon: _selectScrapboxIcon,
  },
});

// export
export const settingsReducer = settingsSlice.reducer;

export const settingsActions: Readonly<typeof settingsSlice.actions> =
  settingsSlice.actions;

export const { selectScrapboxIcon } = settingsSlice.selectors;

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
