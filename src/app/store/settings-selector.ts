import { type Settings, settingsKeys } from '~/lib/settings';
import {
  type TweetTemplate,
  tweetTemplateKeys,
} from '~/lib/tweet/tweet-template';
import { fallbackToEmptyArray } from '~/lib/utility';
import type { State } from '.';

// settings: current
type SettingsSelectors = {
  [Key in keyof Settings]: (state: State) => Settings[Key];
};

export const selectSettings: Readonly<SettingsSelectors> = settingsKeys.reduce(
  (selectors, key) =>
    Object.assign(selectors, {
      [key]: (state: State) => state.settings.currentSettings[key],
    }),
  {} as SettingsSelectors,
);

// settings: editings
type EditingSettingsSelectors = {
  [Key in keyof Settings]: (state: State) => Partial<Settings>[Key];
};

export const selectEditingSettings: Readonly<EditingSettingsSelectors> =
  settingsKeys.reduce(
    (selectors, key) =>
      Object.assign(selectors, {
        [key]: (state: State) => state.settings.editingSettings[key],
      }),
    {} as EditingSettingsSelectors,
  );

// settings: error
type SettingsErrorSelectors = {
  [Key in keyof Settings]: (state: State) => string[];
};

export const selectSettingsError: Readonly<SettingsErrorSelectors> =
  settingsKeys.reduce(
    (selectors, key) =>
      Object.assign(selectors, {
        [key]: (state: State) =>
          fallbackToEmptyArray(state.settings.settingsErrors[key] ?? []),
      }),
    {} as SettingsErrorSelectors,
  );

// tweet-template: currnt
type TweetTemplateSelectors = {
  [Key in keyof TweetTemplate]: (state: State) => TweetTemplate[Key];
};

export const selectTemplate: Readonly<TweetTemplateSelectors> =
  tweetTemplateKeys.reduce(
    (selectors, key) =>
      Object.assign(selectors, {
        [key]: (state: State) => state.settings.currentTemplate[key],
      }),
    {} as TweetTemplateSelectors,
  );

// tweet-template: editing
type EditingTweetTemplateSelectors = {
  [Key in keyof TweetTemplate]: (state: State) => Partial<TweetTemplate>[Key];
};

export const selectEditingTemplate: Readonly<EditingTweetTemplateSelectors> =
  tweetTemplateKeys.reduce(
    (selectors, key) =>
      Object.assign(selectors, {
        [key]: (state: State) => state.settings.editingTemplate[key],
      }),
    {} as EditingTweetTemplateSelectors,
  );

// tweet-template: error
type TweetTemplateErrorsSelectors = {
  [Key in keyof TweetTemplate]: (state: State) => string[];
};

export const selectTemplateError: Readonly<TweetTemplateErrorsSelectors> =
  tweetTemplateKeys.reduce(
    (selectors, key) =>
      Object.assign(selectors, {
        [key]: (state: State) =>
          fallbackToEmptyArray(state.settings.templateErrors[key] ?? []),
      }),
    {} as TweetTemplateErrorsSelectors,
  );
