import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';

import { Sketch } from '../../src/ng-sketch/sketchJSON/Sketch';
import * as unzip from 'unzip';
import { delFolder } from '../../src/utils/del-folder';
import { fileValidations } from './file-validations';
import { groupValidation } from './group';

describe('💎  Sketch File', () => {
  const fileName = 'dt-asset-lib';
  const testTmp = path.resolve('./tests/_tmp');
  const sketchFile = path.resolve(testTmp, `${fileName}.sketch`);

  before((done) => {
    delFolder(testTmp);
    const sketch = new Sketch(testTmp);
    sketch.write([]).then(() => {
      const stream = fs.createReadStream(sketchFile)
        .pipe(unzip.Extract({ path: path.resolve(testTmp, fileName) }))
        .on('close', done);
    });
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

  describe('\n    🚧  JSON validation:\n', () => {
    // general File Validations
    fileValidations();

    describe('\n\t🛠   Validating modules:\n', () => {
      groupValidation();
    });
  });

  after(() => {
    console.log(chalk`\n\t{grey 🗑  clean up tests workspace...}`);
    delFolder(testTmp);
  });

});
