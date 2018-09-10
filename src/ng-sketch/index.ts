import { ElementFetcher } from './element-fetcher';
import { exec } from 'child_process';
import * as path from 'path';

const NAVIGATION = require(path.join(process.cwd(), 'dist', 'sketch-library', 'navigation.json'));

process.env.SKETCH = 'open-close';
process.env.DEBUG = 'true';
// process.env.DEBUG_BROWSER = 'true';

try {
  // close running sketch app
  if (process.env.SKETCH === 'open-close') {
    exec(`osascript -e 'quit app "Sketch"'`);
  }

  const elementFetcher = new ElementFetcher();
  elementFetcher.host = 'http://localhost:4200/';
  elementFetcher.generateSketchFile(NAVIGATION.urls)
    .then(code => process.exit(code));
} catch (error) {
  process.exit(1);
  throw error;
}
