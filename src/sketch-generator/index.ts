import { ElementFetcher } from './element-fetcher';
import { SG } from './index.d';
import { exec } from 'child_process';

process.env.SKETCH = 'open-close';
process.env.DEBUG = 'true';
// process.env.DEBUG_BROWSER = 'true';

const DEFAULT_CONFIG = require('./config.json') as SG.Config;

export async function main(): Promise<number> {
  /** close sketch */
  if (process.env.SKETCH === 'open-close') {
    exec(`osascript -e 'quit app "Sketch"'`);
  }
  const elementFetcher = new ElementFetcher(DEFAULT_CONFIG);
  await elementFetcher.collectElements();
  const code = await elementFetcher.generateSketchFile();
  return Promise.resolve(code);
}

/** Call the main function with command line args */
main().then((code: number) => {
  process.exit(code);
}).then((err) => {
  console.error(err);
  process.exit(1);
});
