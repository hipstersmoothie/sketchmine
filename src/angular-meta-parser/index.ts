import { main } from './main';
import { readFile } from '@utils';
import { parseCommandlineArgs } from './utils';

export async function commandLineExecutor(): Promise<number> {
  const config = await readFile('./config.json');
  try {
    JSON.parse(config);
  } catch (error) {
    throw Error(`Please provide a default config.json in the root for the angular-meta-parser:\n${error.message}`);
  }
  const args = process.argv.slice(2);
  const { rootDir, library, inFile, outFile } = parseCommandlineArgs(args, JSON.parse(config));
  return await main(rootDir, library, outFile, inFile, false) as number;
}

commandLineExecutor().then((code: number) => {
  process.exit(code);
}).then((err) => {
  console.error(err);
  process.exit(1);
});
