import { main } from './main';
import { SketchBuilderConfig } from './config.interface';
import { readFile } from '@sketchmine/node-helpers';
import * as AMP from '@sketchmine/code-analyzer';

export async function commandLineExecutor(): Promise<number> {
  const config = require('./config.json') as SketchBuilderConfig;
  let meta: AMP.Result;

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
