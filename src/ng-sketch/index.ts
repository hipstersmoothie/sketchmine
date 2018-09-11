import { ElementFetcher } from './element-fetcher';
import { SG } from './index.d';
import { exec } from 'child_process';
import * as path from 'path';
import * as puppeteer from 'puppeteer';

const NAVIGATION = require(path.join(process.cwd(), 'dist', 'sketch-library', 'navigation.json'));

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
  const options: puppeteer.LaunchOptions = Object.assign(
    { headless: false, devtools: true },
    DEFAULT_CONFIG.chrome,
  );
  const browser = await puppeteer.launch(options);
  const url = 'http://localhost:4200/DtButtonColorMainComponent';

  await elementFetcher.getPage(browser, url);
  await browser.close();

  const code = 0;
  return Promise.resolve(code);
}

/** Call the main function with command line args */
main().then((code: number) => {
  process.exit(code);
}).then((err) => {
  console.error(err);
  process.exit(1);
});
