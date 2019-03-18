import { main } from './main';
import { parseCommandlineArgs } from './utils';

export async function commandLineExecutor(): Promise<number> {
  const args = process.argv.slice(2);
  const { rootDir, library, inFile, tsConfig, outFile, blackList } = parseCommandlineArgs(args);

  const ignoreFiles = blackList && blackList.length ? new Set(blackList) : null;
  return await main(rootDir, library, outFile, inFile, tsConfig, false, ignoreFiles) as number;
}

commandLineExecutor()
.then((code: number) => {
  process.exit(code);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
