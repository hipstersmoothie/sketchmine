import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { IDocument, IMeta } from '@sketch-draw/interfaces';

const FOLDER_NAME = 'dt-asset-lib';
const TEST_TMP = path.resolve('./tests/_tmp');
const DOCUMENT_JSON = path.resolve(TEST_TMP, FOLDER_NAME, 'document.json');
const META_JSON = path.resolve(TEST_TMP, FOLDER_NAME, 'meta.json');

export function fileValidations() {
  let document: IDocument;
  let pagesFiles: string[];

  describe('Pages are correctly registerd', () => {
    beforeAll((done) => {
      fs.readFile(DOCUMENT_JSON, { encoding: 'utf-8' }, (err, data: string) => {
        if (!err) {
          document = JSON.parse(data);
          done();
        } else {
          console.log('Failed reading document.json\n', err.message);
        }
      });
    });

    beforeAll((done) => {
      const pages = path.resolve(TEST_TMP, FOLDER_NAME, 'pages');
      fs.readdir(pages, (err, files) => {
        pagesFiles = files;
        if (err) {
          throw Error(err.message);
        }
        done();
      });
    });
    it('document.json has pages array', () => {
      expect(document.pages instanceof Array).toBe(true);
      expect(document.pages.length).toBeGreaterThan(0);
    });

    it('pages array matches the size of jsons', () => {
      expect(pagesFiles.length).toEqual(document.pages.length);
    });

    it('pages id matches the file name', () => {
      pagesFiles.forEach((page) => {
        const id = page.replace('.json', '');
        const pages = document.pages.map(registerdPage => registerdPage._ref.replace('pages\/', ''));
        expect(pages.includes(id)).toBeTruthy();
      });
    });
  });

  describe('Validate meta.json', () => {
    let meta: IMeta;

    beforeAll((done) => {
      fs.readFile(META_JSON, { encoding: 'utf-8' }, (err, data: string) => {
        if (!err) {
          meta = JSON.parse(data);
          done();
        } else {
          console.log('Failed reading document.json', err);
        }
      });
    });

    it('Artbords and symbols are registerd in meta.json', () => {
      const pageAndArtboardKeys = Object.keys(meta.pagesAndArtboards);
      expect(pageAndArtboardKeys.length).toEqual(pagesFiles.length);
    });

    it('Bernina Sans is registered', () => {
      expect(meta.fonts.includes('BerninaSans')).toBeTruthy();
    });
  });
}
