import { main } from './main';
import { resolve } from 'path';
import { Result as MetaResult } from '@sketchmine/code-analyzer';
import { readFile } from '@sketchmine/node-helpers';
import { parseCommandlineArgs } from './utils';

export async function commandLineExecutor(): Promise<number> {
  const config = await readFile('./config.json');
  try {
    JSON.parse(config);
  } catch (error) {
    throw Error(`Please provide a config.json in the root for the angular-library-generator:\n${error.message}`);
  }
  const args = process.argv.slice(2);
  const { meta, examples, appShell } = parseCommandlineArgs(args, JSON.parse(config));

  let metaInformation: MetaResult | string = await readFile(resolve(meta));
  try {
    metaInformation = JSON.parse(metaInformation) as MetaResult;
  } catch (error) {
    throw Error(`Failed to parse meta information as JSON!\n\n${error.message}`);
  }
  return await main(metaInformation, resolve(examples), appShell);
}

commandLineExecutor().then((code: number) => {
  process.exit(code);
}).then((err) => {
  console.error(err);
  process.exit(1);
});
