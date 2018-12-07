import { main } from './main';
import { parseCommandlineArgs } from './helpers/parse-commandline-args';
import { readFile } from '@sketchmine/node-helpers';
import { Result } from '@sketchmine/code-analyzer';

/**
 * @description The CLI entry point. You need to provide a `config.json` with all
 * the necessary configuration.
 * @returns {number} process exit code.
 */
export async function commandLineExecutor(): Promise<number> {
  const args = process.argv.slice(2);
  const config = parseCommandlineArgs(args);

  // the meta option is optional in the main function
  let meta: Result;

  /**
   * you can provide the meta information, it will be used to detect
   * symbols from the library to reference them in the sketch file instead of redrawing
   * the same symbol twice.
  */
  if (config.metaInformation) {
    meta = JSON.parse(await readFile(config.metaInformation));
  }
  return await main(config, meta) as number;
}

/** Call the main function with command line args */
commandLineExecutor()
.then((code: number) => {
  process.exit(code);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
