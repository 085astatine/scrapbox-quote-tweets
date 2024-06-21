import { getElement } from '~/lib/dom';

export const isPromotionTweet = (article: Element): boolean => {
  return getElement('self::article//a/time', article) === null;
};

export const isInQuotedTweet = (element: Element): boolean => {
  return getElement('ancestor::div[@role="link"]', element) !== null;
};
