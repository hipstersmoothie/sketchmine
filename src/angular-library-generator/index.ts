import { main } from './main';
import { resolve } from 'path';
import { AMP } from '../angular-meta-parser/meta-information';
import { readFile } from '@utils';
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

  let metaInformation: AMP.Result | string = await readFile(resolve(meta));
  try {
    metaInformation = JSON.parse(metaInformation) as AMP.Result;
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
