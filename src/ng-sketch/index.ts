import { ElementFetcher } from './element-fetcher';
import { exec } from 'child_process';

const pages = [
  // '/icon/icon--agent',
  // '/icon/icon--richface',
  // '/button/button--icon',
  // '/button/button--primary',
  // '/button/button--secondary',
  '/tile/tile--default',
];

process.env.SKETCH = 'open-close';
process.env.DEBUG = 'true';
// process.env.DEBUG_BROWSER = 'true';

try {
  // close running sketch app
  if (process.env.SKETCH === 'open-close') {
    exec(`osascript -e 'quit app "Sketch"'`);
  }

  const elementFetcher = new ElementFetcher();
  elementFetcher.host = 'http://localhost:4200';
  elementFetcher.generateSketchFile(pages)
    .then(code => process.exit(code));
} catch (error) {
  process.exit(1);
  throw error;
}
