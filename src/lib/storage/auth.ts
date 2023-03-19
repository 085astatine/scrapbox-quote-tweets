import browser from 'webextension-polyfill';

const keyBearerToken = 'bearer_token';

export const saveBearerToken = async (token: string): Promise<void> => {
  // set to storage
  await browser.storage.local.set({ [keyBearerToken]: token });
};

export const loadBearerToken = async (): Promise<string | null> => {
  // load from storage
  const token = await browser.storage.local
    .get(keyBearerToken)
    .then((record) => record[keyBearerToken]);
  return token ?? null;
};

export const deleteBearerToken = async (): Promise<void> => {
  // remove from storage
  await browser.storage.local.remove(keyBearerToken);
};
