/* eslint-disable @typescript-eslint/no-explicit-any */

export const toRecord = (data: any, prefix: string): unknown => {
  return Object.entries(data).reduce((record, [key, value]) => {
    // object
    if (value?.constructor === Object) {
      Object.assign(record, toRecord(value, `${prefix}_${key}`));
    } else {
      record[`${prefix}_${key}`] = value;
    }
    return record;
  }, {} as any);
};

export const recordTo = (
  record: Record<string, unknown>,
  prefix: string,
): unknown => {
  return Object.entries(record).reduce((data, [key, value]) => {
    if (key.startsWith(`${prefix}_`)) {
      const objectKey = key.substring(prefix.length + 1);
      const [head, tail] = objectKey.split('_', 2);
      if (tail !== undefined) {
        if (data[head] === undefined) {
          data[head] = {};
        }
        Object.assign(
          data[head],
          recordTo({ [key]: value }, `${prefix}_${head}`),
        );
      } else {
        data[objectKey] = value;
      }
    }
    return data;
  }, {} as any);
};
