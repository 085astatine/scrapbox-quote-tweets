import { defaultTimezone, isValidTimezone } from './datetime';
import { TrashboxSort } from './trashbox';
import { TweetSort } from './tweet/types';

export const hostnames = ['x.com', 'twitter.com'] as const;

export type Hostname = (typeof hostnames)[number];

export interface Settings {
  hostname: Hostname;
  timezone: string;
  datetimeFormat: string;
  tweetSort: TweetSort;
  trashboxSort: TrashboxSort;
}

export const defaultSettings = (): Settings => {
  return {
    hostname: 'x.com',
    timezone: defaultTimezone(),
    datetimeFormat: 'YYYY/MM/DD HH:mm:ss',
    tweetSort: {
      key: 'created_time',
      order: 'desc',
    },
    trashboxSort: {
      key: 'deleted_time',
      order: 'desc',
    },
  };
};

// hostname
export const baseURL = (hostname: string): string => {
  return `https://${hostname}`;
};

export const isHostname = (value: string): value is Hostname => {
  return (hostnames as ReadonlyArray<string>).includes(value);
};

// validate functions
interface ValidationSuccess {
  ok: true;
}

interface SettingsValueValidationFailure {
  ok: false;
  error: string[];
}

interface SettingsValidationFailure {
  ok: false;
  errors: {
    [key in keyof Settings]?: string[];
  };
}

export type ValidateSettingsValueResult =
  | ValidationSuccess
  | SettingsValueValidationFailure;

export type ValidateSettingsResult =
  | ValidationSuccess
  | SettingsValidationFailure;

export const validateHostname = (
  value: string,
): ValidateSettingsValueResult => {
  if (!isHostname(value)) {
    return {
      ok: false,
      error: [`${value} is not valid hostname`],
    };
  }
  return { ok: true };
};

export const validateTimezone = (
  value: string,
): ValidateSettingsValueResult => {
  if (!isValidTimezone(value)) {
    return {
      ok: false,
      error: [
        `"${value}" is not valid timezone.`,
        'Please enter the time zone in the IANA database.',
        'Examples: "UTC", "Asia/Tokyo", "America/New_York"',
      ],
    };
  }
  return { ok: true };
};

type ValidateFunctions = {
  [key in keyof Settings]?: (
    value: Settings[key] extends string ? string : Settings[key],
  ) => ValidateSettingsValueResult;
};

export const validateFunctions: ValidateFunctions = {
  hostname: validateHostname,
  timezone: validateTimezone,
} as const;

export const validateSettings = (
  settings: Settings,
): ValidateSettingsResult => {
  const keys = ['hostname', 'timezone'] as const;
  const errors: SettingsValidationFailure['errors'] = {};
  keys.forEach((key) => {
    const validate = validateFunctions[key];
    if (validate !== undefined) {
      const result = validate(settings[key]);
      if (!result.ok) {
        errors[key] = result.error;
      }
    }
  });
  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }
  return { ok: true };
};
