import Ajv, { type JSONSchemaType, _ } from 'ajv';
import standaloneCode from 'ajv/dist/standalone';
import * as fs from 'fs';
import * as path from 'path';
import { deletedTweetIDsJSONSchema } from './jsonschema/deleted-tweet-id';
import { settingsJSONSchema } from './jsonschema/settings';
import {
  tweetIDsJSONSchema,
  tweetJSONSchema,
  tweetsJSONSchema,
} from './jsonschema/tweet';
import {
  trashboxSortJSONSchema,
  tweetSortJSONSchema,
} from './jsonschema/tweet-sort';
import { tweetTemplateJSONSchema } from './jsonschema/tweet-template';
import formats from './validate-json/formats';

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
  ajv.addFormat('uri', formats.uri);
  ajv.addFormat('iri', formats.iri);
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
  "import { Tweet } from '~/lib/tweet/types'",
);
// Tweet[]
generate(
  tweetsJSONSchema,
  'validate-tweets',
  'Tweet[]',
  "import { Tweet } from '~/lib/tweet/types'",
);
// TweetID[]
generate(
  tweetIDsJSONSchema,
  'validate-tweet-ids',
  'TweetID[]',
  "import { TweetID } from '~/lib/tweet/types'",
);
// DeletedTweetID[]
generate(
  deletedTweetIDsJSONSchema,
  'validate-deleted-tweet-ids',
  'DeletedTweetID[]',
  "import { DeletedTweetID } from '~/lib/tweet/types'",
);
// Settings
generate(
  settingsJSONSchema,
  'validate-settings',
  'Settings',
  "import { Settings } from '~/lib/settings'",
);
// TweetTemplate
generate(
  tweetTemplateJSONSchema,
  'validate-tweet-template',
  'TweetTemplate',
  "import { TweetTemplate } from '~/lib/tweet/tweet-template'",
);
// TweetSort
generate(
  tweetSortJSONSchema,
  'validate-tweet-sort',
  'TweetSort',
  "import { TweetSort } from '~/lib/tweet/types'",
);
// TrashboxSort
generate(
  trashboxSortJSONSchema,
  'validate-trashbox-sort',
  'TrashboxSort',
  "import { TrashboxSort } from '~/lib/trashbox'",
);
