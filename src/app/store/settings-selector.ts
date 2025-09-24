import { createSelector } from '@reduxjs/toolkit';
import {
  type Hostname,
  type Settings,
  baseURL,
  settingsKeys,
} from '~/lib/settings';
import {
  type TextTemplateKey,
  type TweetTemplate,
  tweetTemplateKeys,
} from '~/lib/tweet/tweet-template';
import type { TweetToStringOption } from '~/lib/tweet/tweet-to-string';
import { fallbackToEmptyArray } from '~/lib/utility';
import type { State } from '.';
import type { TemplateErrors, UpdateTrigger } from './settings';

// types
export type EditStatus = 'none' | 'updated' | 'invalid';

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

// settings update trigger
export const selectSettingsUpdateTrigger = (state: State): UpdateTrigger => {
  return state.settings.updateTrigger;
};

// settings editor
export const selectSettingsEditStatus = createSelector(
  [
    (state: State): boolean =>
      Object.keys(state.settings.editingSettings).length > 0,
    (state: State): boolean =>
      Object.keys(state.settings.settingsErrors).length > 0,
  ],
  (isUpdated: boolean, hasError: boolean): EditStatus => {
    return (
      hasError ? 'invalid'
      : isUpdated ? 'updated'
      : 'none'
    );
  },
);

// template edtor
export const selectTemplateEditStatus = createSelector(
  [
    (state: State): boolean =>
      Object.keys(state.settings.editingTemplate).length > 0,
    (state: State): boolean =>
      Object.keys(state.settings.templateErrors).length > 0,
  ],
  (isUpdated: boolean, hasError: boolean): EditStatus => {
    return (
      hasError ? 'invalid'
      : isUpdated ? 'updated'
      : 'none'
    );
  },
);

const templateEntityKeys: ReadonlyArray<TextTemplateKey> = [
  'entityText',
  'entityUrl',
  'entityHashtag',
  'entityCashtag',
  'entityMention',
] as const;
export const selectTemplateEntitiesEditStatus = createSelector(
  [
    (state: State): Partial<TweetTemplate> => state.settings.editingTemplate,
    (state: State): TemplateErrors => state.settings.templateErrors,
  ],
  (editing: Partial<TweetTemplate>, errors: TemplateErrors): EditStatus => {
    const isUpdated = !templateEntityKeys.every((key) => !(key in editing));
    const hasError = !templateEntityKeys.every((key) => !(key in errors));
    return (
      hasError ? 'invalid'
      : isUpdated ? 'updated'
      : 'none'
    );
  },
);

const templateMediaKeys: ReadonlyArray<TextTemplateKey> = [
  'mediaPhoto',
  'mediaVideo',
] as const;
export const selectTemplateMediaEditStatus = createSelector(
  [
    (state: State): Partial<TweetTemplate> => state.settings.editingTemplate,
    (state: State): TemplateErrors => state.settings.templateErrors,
  ],
  (editing: Partial<TweetTemplate>, errors: TemplateErrors): EditStatus => {
    const isUpdated = !templateMediaKeys.every((key) => !(key in editing));
    const hasError = !templateMediaKeys.every((key) => !(key in errors));
    return (
      hasError ? 'invalid'
      : isUpdated ? 'updated'
      : 'none'
    );
  },
);

// depend on settings
export const selectIsSettingsEdited = (state: State): boolean => {
  return (
    Object.keys(state.settings.editingSettings).length > 0 ||
    Object.keys(state.settings.editingTemplate).length > 0
  );
};

export const selectBaseURL = createSelector(
  [selectSettings.hostname],
  (hostname: Hostname): string => {
    return baseURL(hostname);
  },
);

export const selectTweetToStringOption = createSelector(
  [
    selectSettings.hostname,
    selectSettings.timezone,
    selectSettings.datetimeFormat,
  ],
  (
    hostname: Hostname,
    timezone: string,
    datetimeFormat: string,
  ): TweetToStringOption => {
    return { hostname, timezone, datetimeFormat };
  },
);
