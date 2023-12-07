export type Hostname = 'twitter.com' | 'x.com';

export interface Settings {
  hostname: Hostname;
}

export const baseURL = (hostname: string): string => {
  return `https://${hostname}`;
};
