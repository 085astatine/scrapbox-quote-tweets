import { ValidateFunction } from 'avj';
import { TweetID } from '~/lib/tweet';

declare const validate: ValidateFunction<TweetID[]>;
export default validate;
