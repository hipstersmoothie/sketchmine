import { main } from './main';
import { SketchGenerator } from './sketch-generator';
import { readFile } from '@utils';
import { AMP } from '../angular-meta-parser/meta-information';

export async function commandLineExecutor(): Promise<number> {
  const config = require('./config.json') as SketchGenerator.Config;
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
