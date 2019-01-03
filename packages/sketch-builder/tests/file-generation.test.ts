import { promisify } from 'util';
import { delDir, createDir } from '@sketchmine/node-helpers';
import { fileValidations } from './file-validations';
import { ElementFetcher } from '../src/element-fetcher';
import { resolve, dirname, basename, join } from 'path';
import { statSync } from 'fs';
import { SketchBuilderConfig } from '../src/config.interface';

const config: SketchBuilderConfig = {
  metaInformation: resolve('tests', 'fixtures', 'meta-information.json'),
  agent: require.resolve('@sketchmine/dom-agent'),
  url: `file:///${resolve('tests', 'fixtures', 'tile-default.html')}`,
  rootElement: 'app-root > * > *',
  outFile: resolve('./tests/_tmp/dt-asset-lib.sketch'),
  previewImage: 'assets/preview.png',
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

describe('[sketch-builder] › element-fetcher › try to generate .sketch file', () => {
  const fileName = 'dt-asset-lib';
  const testTmp = dirname(config.outFile);

  beforeAll(async () => {
    delDir(testTmp);
    createDir(testTmp);
    const elementFetcher = new ElementFetcher(config);
    await elementFetcher.fetchElements();
    await elementFetcher.generateSketchFile();
    await extract(config.outFile, { dir: join(testTmp, fileName) });
  });

  test('Generating .sketch file.', () => {
    expect(fileExists(config.outFile)).toBeTruthy();
  });

  test('Filestructure contain all files', () => {
    expect(fileExists(resolve(testTmp, fileName, 'user.json'))).toBeTruthy();
    expect(fileExists(resolve(testTmp, fileName, 'meta.json'))).toBeTruthy();
    expect(fileExists(resolve(testTmp, fileName, 'document.json'))).toBeTruthy();
    expect(fileExists(resolve(testTmp, fileName, 'previews', 'preview.png'))).toBeTruthy();
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
  const result = statSync(file);
  return result && result.size > 0;
}
