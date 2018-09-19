import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import * as extractZip from 'extract-zip';

import { delDir, createDir } from '@utils';
import { fileValidations } from './file-validations';
import { ElementFetcher } from '../../src/sketch-generator/element-fetcher';

const config = {
  args: {
    metaInformation: 'src/angular-meta-parser/_tmp/meta-information.json',
    host: `file:${path.join(process.cwd(), 'tests', 'fixtures', 'tile-default.html')}`,
    rootElement: 'app-root > * > *',
    library: false,
  },
  pages: [
    '',
  ],
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

const extract = promisify(extractZip);

describe('➡ Sketch File generation 💎', () => {
  const fileName = 'dt-asset-lib';
  const testTmp = path.resolve('./tests/_tmp');
  const sketchFile = path.join(testTmp, `${fileName}.sketch`);

  beforeAll(async () => {
    delDir(testTmp);
    createDir(testTmp);
    const elementFetcher = new ElementFetcher(config);
    await elementFetcher.collectElements();
    await elementFetcher.generateSketchFile(testTmp);
    await extract(sketchFile, { dir: path.join(testTmp, fileName) });
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
    // general File Validations
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
