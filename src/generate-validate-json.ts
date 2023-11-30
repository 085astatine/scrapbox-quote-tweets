import Ajv, { JSONSchemaType, _ } from 'ajv';
import addFormats from 'ajv-formats';
// @ts-expect-error ajv-formats-draft2019 has no .d.ts file
import addFormatsDraft2019 from 'ajv-formats-draft2019';
import standaloneCode from 'ajv/dist/standalone';
import * as fs from 'fs';
import * as path from 'path';
import { deletedTweetIDsListJSONSchema } from './jsonschema/deleted-tweets';
import {
  tweetIDsJSONSchema,
  tweetJSONSchema,
  tweetsJSONSchema,
} from './jsonschema/tweet';

const generate = <T>(
  schema: JSONSchemaType<T>,
  output: string,
  typename: string,
  importCode: string,
) => {
  console.log(`generate: ${typename}`);
  // directory
  const directory = path.join(__dirname, 'validate-json');
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
  // generate validate code
  const ajv = new Ajv({
    allErrors: true,
    discriminator: true,
    code: {
      source: true,
      formats: _`require("./formats")`,
    },
  });
  addFormats(ajv, ['uri']);
  addFormatsDraft2019(ajv, { formats: ['iri'] });
  const validate = ajv.compile(schema);
  fs.writeFileSync(
    path.join(directory, `${output}.js`),
    standaloneCode(ajv, validate),
  );
  // generate .d.ts
  const code: string[] = [];
  code.push("import { ErrorObject } from 'ajv';");
  code.push(`${importCode};`);
  code.push('');
  code.push('declare const validate: {');
  code.push(`  (data: unknown): data is ${typename};`);
  code.push('  errors: ErrorObject[] | null;');
  code.push('};');
  code.push(`export default validate;`);
  code.push('');
  fs.writeFileSync(path.join(directory, `${output}.d.ts`), code.join('\n'));
};

// Tweet
generate(
  tweetJSONSchema,
  'validate-tweet',
  'Tweet',
  "import { Tweet } from '~/lib/tweet'",
);
// Tweet[]
generate(
  tweetsJSONSchema,
  'validate-tweets',
  'Tweet[]',
  "import { Tweet } from '~/lib/tweet'",
);
// TweetID[]
generate(
  tweetIDsJSONSchema,
  'validate-tweet-ids',
  'TweetID[]',
  "import { TweetID } from '~/lib/tweet'",
);
// DeletedTweetIDs[]
generate(
  deletedTweetIDsListJSONSchema,
  'validate-deleted-tweet-ids-list',
  'DeletedTweetIDs[]',
  "import { DeletedTweetIDs } from '~/lib/tweet'",
);
