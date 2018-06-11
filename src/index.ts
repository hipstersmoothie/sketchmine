import { ElementFetcher } from './ng-sketch/ElementFetcher';
import { SvgParser } from './ng-sketch/sketchSvgParser/SvgParser';
import { Sketch } from 'ng-sketch/sketchJSON/Sketch';
import { Page } from 'ng-sketch/sketchJSON/models/Page';
import { EXDEV } from 'constants';
import { exec } from 'child_process';

const pages = [
  '/icon/icon--agent',
  '/icon/icon--richface',
  '/button/button--icon',
  '/button/button--primary',
  '/button/button--secondary',
  '/tile/tile--default',
];

process.env.DEBUG = 'true';
// process.env.DEBUG_BROWSER = 'true';

try {
  // close running sketch app
  exec(`osascript -e 'quit app "Sketch"'`);

  const elementFetcher = new ElementFetcher();
  elementFetcher.host = 'http://localhost:4200';
  elementFetcher.generateSketchFile(pages);
} catch (error) {
  throw error;
}
