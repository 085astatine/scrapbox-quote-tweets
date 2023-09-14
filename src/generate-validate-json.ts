import Ajv, { JSONSchemaType } from 'ajv';
import standaloneCode from 'ajv/dist/standalone';
import * as fs from 'fs';
import * as path from 'path';
import { tweetJSONSchema, tweetsJSONSchema } from './jsonschema/tweet';

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
    },
  });
  const validate = ajv.compile(schema);
  fs.writeFileSync(
    path.join(directory, `${output}.js`),
    standaloneCode(ajv, validate),
  );
  // generate .d.ts
  const code: string[] = [];
  code.push("import { ValidateFunction } from 'avj';");
  code.push(`${importCode};`);
  code.push('');
  code.push(`declare const validate: ValidateFunction<${typename}>;`);
  code.push(`export default validate;`);
  code.push('');
  fs.writeFileSync(path.join(directory, `${output}.d.ts`), code.join('\n'));
};

// Tweet
generate(
  tweetJSONSchema,
  'validate-tweet',
  'Tweet',
  "import { Tweet } from '../lib/tweet'",
);
// Tweet[]
generate(
  tweetsJSONSchema,
  'validate-tweets',
  'Tweet[]',
  "import { Tweet } from '../lib/tweet'",
);
