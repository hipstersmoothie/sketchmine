import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { IDocument } from '../../src/ng-sketch/sketchJSON/interfaces/Document';

export function namingValidation() {

  context('Check symbols naming', () => {
    let document: IDocument;

    before((done) => {
      const file = path.resolve('tests', 'fixtures', 'document.json');
      fs.readFile(file, { encoding: 'utf-8' }, (err, data: string) => {
        if (!err) {
          document = JSON.parse(data);
          done();
        } else {
          console.log(chalk`{bgRed Failed reading document.json`, err);
        }
      });
    });

    it('document.json ', () => {

    });
  });
}
