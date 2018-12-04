import { main } from './main';
import { SketchBuilderConfig } from './config.interface';
import { readFile } from '@sketchmine/node-helpers';
import { Result } from '@sketchmine/code-analyzer';
import { resolve } from 'path';

export async function commandLineExecutor(): Promise<number> {
  const confPath = resolve('./config.json');
  const config = require(confPath) as SketchBuilderConfig;
  let meta: Result;

  if (config.metaInformation) {
    meta = JSON.parse(await readFile(config.metaInformation));
  }
  return await main(config, meta) as number;
}

/** Call the main function with command line args */
commandLineExecutor().then((code: number) => {
  process.exit(code);
}).then((err) => {
  console.error(err);
  process.exit(1);
});
