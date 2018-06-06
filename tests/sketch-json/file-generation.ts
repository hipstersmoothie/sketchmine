import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';

import { Sketch } from '../../src/ng-sketch/sketchJSON/Sketch';

describe('Sketch', () => {

  context('File structure:', () => {
    before(() => {
      const sketch = new Sketch('tests');
      sketch.write([]);
    });

    it('.sketch File was successfully generated!', () => {
      expect(fs.existsSync('./tests/dt-asset-lib.sketch')).to.be.true;
    });
  });

});
