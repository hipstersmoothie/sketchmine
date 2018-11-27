import { main } from './main';
import { join } from 'path';
import { readFile } from '@sketchmine/helpers';
import { parseCommandlineArgs } from './utils';
import minimist, { ParsedArgs } from 'minimist';
import { displayHelp } from './utils/display-help';

const DEFAULT_CONFIG = join(__dirname, 'config.json');

export async function commandLineExecutor(): Promise<number> {
  const args: ParsedArgs = minimist(process.argv.slice(2));
  if (args.help || args.h) {
    displayHelp();
    return 0;
  }
  const configFile = args.c ? args.c : args.config ? args.config : DEFAULT_CONFIG;
  const config = await readFile(configFile);
  try {
    JSON.parse(config);
  } catch (error) {
    throw Error(`Please provide a default config.json in the root for the angular-meta-parser:\n${error.message}`);
  }
  const { rootDir, library, inFile, outFile } = parseCommandlineArgs(args, JSON.parse(config));
  return await main(rootDir, library, outFile, inFile, false) as number;
}

commandLineExecutor().then((code: number) => {
  process.exit(code);
}).then((err) => {
  console.error(err);
  process.exit(1);
});
