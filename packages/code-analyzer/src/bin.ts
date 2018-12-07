import { main } from './main';
import { parseCommandlineArgs } from './utils';

export async function commandLineExecutor(): Promise<number> {
  const args = process.argv.slice(2);
  const { rootDir, library, inFile, outFile } = parseCommandlineArgs(args);

  return await main(rootDir, library, outFile, inFile, false) as number;
}

commandLineExecutor()
.then((code: number) => {
  process.exit(code);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
