import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { IDocument } from '../../src/ng-sketch/sketchJSON/interfaces/Document';

export function fileValidations() {
  const testTmp = path.resolve('./tests/_tmp');

  context('Pages are correctly registerd', () => {
    let document: IDocument;
    let pagesFiles: string[];

    before((done) => {
      const file = path.resolve(testTmp, 'dt-asset-lib', 'document.json');
      fs.readFile(file, { encoding: 'utf-8' }, (err, data: string) => {
        if (!err) {
          document = JSON.parse(data);
          done();
        } else {
          console.log(chalk`{bgRed Failed reading document.json`, err);
        }
      });
    });

    before((done) => {
      const pages = path.resolve(testTmp, 'dt-asset-lib', 'pages');
      fs.readdir(pages, (err, files) => {
        pagesFiles = files;
        done();
      });
    });
    // "pages": [{
    //   "_class": "MSJSONFileReference",
    //   "_ref_class": "MSImmutablePage",
    //   "_ref": "pages\/605E2E12-53B8-4125-84F3-E2D218213A1B"
    // }]
    // }
    it('document.json has pages array', () => {
      expect(document.pages).to.be.an('array');
      expect(
        document.pages.length,
        'No Pages registered!',
      ).to.be.greaterThan(0);
    });

    it('pages array matches the size of jsons', () => {
      expect(pagesFiles.length).to.equal(document.pages.length);
    });

    it('pages id matches the file name', () => {
      pagesFiles.forEach((page) => {
        const pages = document.pages.map(registerdPage => registerdPage._ref_class.replace('pages\/', ''));
        expect(pages.includes(page)).to.be('true');
      });
    });
  });

  context('Artbords and symbols are registerd in meta.json', () => {
    // "pagesAndArtboards": {
    //   "605E2E12-53B8-4125-84F3-E2D218213A1B": {
    //     "name": "Symbols",
    //     "artboards": {
    //       "CEEE8C1D-9483-4E3C-8E0C-80C1A6D8C539": {
    //         "name": "icon\/icon--agent"
    //       },
    //       "47A46D21-066E-4D12-9486-BFD53014F558": {
    //         "name": "icon\/icon--richface"
    //       },
    //       "AB9A68DA-3328-45CE-A798-1F053C468E12": {
    //         "name": "button\/button--icon"
    //       },
    //       "C0D524A1-6B15-4A86-A8FD-52DE231EEE36": {
    //         "name": "button\/button--primary"
    //       },
    //       "DD393E0F-02BF-496F-8AC3-3CC1B2862C75": {
    //         "name": "button\/button--secondary"
    //       },
    //       "7DB3A0F6-A06B-4621-B227-50FB1FA487EE": {
    //         "name": "tile\/tile--default"
    //       }
    //     }
    //   }
    // },
    it('Symbols artboard is registerd', () => {

    });

    it('Artboards are registered for each symbol', () => {

    });
  });

  context('Check if fonts are registerd in meta.json', () => {
    // "fonts": ["BerninaSans-Regular"],
    it('Bernina Sans is registered', () => {

    });
  });
}
