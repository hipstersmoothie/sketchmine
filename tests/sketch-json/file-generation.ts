import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { promisify } from 'util';

import { Sketch } from '../../src/ng-sketch/sketch-draw';

import * as extractZip from 'extract-zip';

const extract = promisify(extractZip);

import * as unzip from 'unzipper';
import { delDir } from '../../src/utils/del-folder';
import { fileValidations } from './file-validations';
import { groupValidation } from './group';
import { ElementFetcher } from '../../src/ng-sketch/element-fetcher';

describe('➡ Sketch File generation 💎', () => {
  const fileName = 'dt-asset-lib';
  const testTmp = path.resolve('./tests/_tmp');
  const sketchFile = path.join(testTmp, `${fileName}.sketch`);

  before(async () => {
    delDir(testTmp);
    const elementFetcher = new ElementFetcher();
    elementFetcher.host = `file://${path.resolve(__dirname, '..', 'fixtures', 'test-page.html')}`;
    await elementFetcher.generateSketchFile([''], testTmp);
    await extract(sketchFile, { dir: path.join(testTmp, fileName) });
  });

  context('File structure:', () => {

    it('Generating .sketch file.', () => {
      expect(fs.existsSync(sketchFile), '.sketch file was not generated').to.be.true;
    });

    it('Filestructure contain all files', () => {
      expect(
        fs.existsSync(path.resolve(testTmp, fileName, 'user.json')),
        'The user.json is missing in the .sketch file',
      ).to.be.true;
      expect(
        fs.existsSync(path.resolve(testTmp, fileName, 'meta.json')),
        'The meta.json is missing in the .sketch file',
      ).to.be.true;
      expect(
        fs.existsSync(path.resolve(testTmp, fileName, 'document.json')),
        'The document.json is missing in the .sketch file',
      ).to.be.true;
      expect(
        fs.existsSync(path.resolve(testTmp, fileName, 'previews', 'preview.png')),
        'The previews/preview.png is missing in the .sketch file',
      ).to.be.true;
    });
  });

  describe('JSON validation: 🚧 \n', () => {
    // general File Validations
    fileValidations();

    describe('Validating modules: 🛠 \n', () => {
      groupValidation();
    });
  });

  after(() => {
    console.log(chalk`\n\t{grey 🗑  clean up tests workspace...}`);
    delDir(testTmp);
  });

});
