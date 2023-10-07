export const formatTCoURL = (url: string): string => {
  try {
    const address = new URL(url);
    if (address.hostname === 't.co') {
      return `${address.origin}${address.pathname}`;
    }
  } catch (error) {
    if (!(error instanceof TypeError)) {
      throw error;
    }
  }
  return url;
};

export const formatTwimgURL = (url: string): string => {
  try {
    const address = new URL(url);
    if (address.hostname === 'pbs.twimg.com') {
      const format = address.searchParams.get('format');
      if (format !== null) {
        return `${address.origin}${address.pathname}.${format}`;
      }
    }
  } catch (error) {
    if (!(error instanceof TypeError)) {
      throw error;
    }
  }
  return url;
};
