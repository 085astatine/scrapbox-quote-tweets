import {
  InvalidTimezoneError,
  isValidTimezone,
  validateTimezone,
} from '~/lib/tweet/tweet-date';

describe('tweet-date/validate', () => {
  test('UTC', () => {
    const timezone = 'UTC';
    expect(isValidTimezone(timezone)).toBe(true);
    expect(() => validateTimezone(timezone)).not.toThrow(InvalidTimezoneError);
  });
  test('Asia/Tokyo', () => {
    const timezone = 'Asia/Tokyo';
    expect(isValidTimezone(timezone)).toBe(true);
    expect(() => validateTimezone(timezone)).not.toThrow(InvalidTimezoneError);
  });
  test('Invalid', () => {
    const timezone = "Pacific/R'lyeh";
    expect(isValidTimezone(timezone)).toBe(false);
    try {
      expect(() => validateTimezone(timezone)).toThrow(InvalidTimezoneError);
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(InvalidTimezoneError);
      if (error instanceof InvalidTimezoneError) {
        expect(error.timezone).toBe(timezone);
      }
    }
  });
});
