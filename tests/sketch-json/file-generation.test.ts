import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

import { delDir, createDir } from '@utils';
import { fileValidations } from './file-validations';
import { ElementFetcher } from '../../src/sketch-generator/element-fetcher';

const config = {
  metaInformation: 'dist/sketch-library/src/assets/meta-information.json',
  host: {
    protocol: 'file',
    name: `${path.join(process.cwd(), 'tests', 'fixtures')}`,
    port: null,
  },
  rootElement: 'app-root > * > *',
  pages: ['tile-default.html'],
  outFile: path.resolve('./tests/_tmp/dt-asset-lib.sketch'),
  chrome: {
    defaultViewport: {
      width: 800,
      height: 600,
      deviceScaleFactor: 1,
      isMobile: false,
      hasTouch: false,
      isLandscape: false,
    },
  },
};

const extract = promisify(require('extract-zip'));

describe('➡ Sketch File generation 💎', () => {
  const fileName = 'dt-asset-lib';
  const testTmp = path.dirname(config.outFile);
  const sketchFile = path.basename(config.outFile);

  beforeAll(async () => {
    delDir(testTmp);
    createDir(testTmp);
    const elementFetcher = new ElementFetcher(config);
    await elementFetcher.collectElements();
    await elementFetcher.generateSketchFile();
    await extract(config.outFile, { dir: path.join(testTmp, fileName) });
  });

  describe('File structure:', () => {

    it('Generating .sketch file.', () => {
      expect(fileExists(sketchFile)).toBeTruthy();
    });

    it('Filestructure contain all files', () => {
      expect(fileExists(path.resolve(testTmp, fileName, 'user.json'))).toBeTruthy();
      expect(fileExists(path.resolve(testTmp, fileName, 'meta.json'))).toBeTruthy();
      expect(fileExists(path.resolve(testTmp, fileName, 'document.json'))).toBeTruthy();
      expect(fileExists(path.resolve(testTmp, fileName, 'previews', 'preview.png'))).toBeTruthy();
    });
  });

  describe('JSON validation: 🚧 \n', () => {
    /** general File Validations */
    fileValidations();
  });

  afterAll(() => {
    delDir(testTmp);
  });

});

function fileExists(file: string): boolean {
  const result = fs.statSync(file);
  return result && result.size > 0;
}
