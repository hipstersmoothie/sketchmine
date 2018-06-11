import * as fs from 'fs';
import * as path from 'path';
import * as archiver from 'archiver';
import { createDir, bytesToSize } from './helpers/util';
import { copyFile } from './helpers/utils/copy-file';
import { delFolder } from './helpers/utils/del-folder';
import { writeJSON } from './helpers/utils/write-json';
import { Page } from './models/Page';
import { Document } from './models/Document';
import { Meta } from './models/Meta';
import { IPage } from './interfaces/Page';
import { IDocument } from './interfaces/Document';
import { IMeta } from './interfaces/Meta';
import { SymbolMaster } from './models/SymbolMaster';
import { Group } from './models/Group';
import { Rectangle } from './models/Rectangle';
import { Style } from './models/Style';
import { Text } from './models/Text';
import chalk from 'chalk';

export class Sketch {
  private static FILE_NAME = 'dt-asset-lib';
  private static TMP_PATH = path.resolve('_tmp');
  private _outDir: string;

  constructor(outDir?: string) {
    this._outDir = outDir || './';
  }

  write(pages: Page[]): Promise<any> {
    const doc = new Document(pages);
    const meta = new Meta(pages);

    this.generateFolderStructure(pages, doc, meta);
    return this.generateFile();
  }

  /**
   * Cleans the _tmp folder
   */
  cleanup() {
    delFolder(Sketch.TMP_PATH);
  }

  /**
   * Create Folder structure for the .sketch File Format
   */
  prepareFolders() {
    delFolder(Sketch.TMP_PATH);
    createDir(Sketch.TMP_PATH);
    createDir(path.join(Sketch.TMP_PATH, 'pages'));
    createDir(path.join(Sketch.TMP_PATH, 'previews'));
    createDir(path.join(Sketch.TMP_PATH, 'images'));
  }

  /**
   * Generates a Folder in the Sketchapp open file format hierarchy.
   * from the given pages with the meta
   *
   * @param pages Page[]
   * @param doc Document
   * @param meta Meta
   */
  private generateFolderStructure (pages: Page[], doc: Document, meta: Meta) {
    try {
      if (!fs.existsSync(Sketch.TMP_PATH)) {
        this.prepareFolders();
      }
      writeJSON(path.join(Sketch.TMP_PATH, 'document'), doc.generateObject());
      writeJSON(path.join(Sketch.TMP_PATH, 'meta'), meta.generateObject());
      writeJSON(path.join(Sketch.TMP_PATH, 'user'), {});

      pages.forEach((page) => {
        writeJSON(path.join(Sketch.TMP_PATH, 'pages', page.objectID), page.generateObject());
      });

      const preview = path.resolve(__dirname, '..', '..', 'assets', 'preview.png');
      copyFile(preview, path.join(Sketch.TMP_PATH, 'previews'));

    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Generate the .sketch file from the previously created Folder.
   * returns promise to check when the sketch file was generated
   * @returns Promise<any>
   */
  private generateFile(): Promise<any> {
    return new Promise((resolve, reject) => {
      createDir(this._outDir);
      const output = fs.createWriteStream(path.resolve(this._outDir, `${Sketch.FILE_NAME}.sketch`));
      const archive = archiver('zip');

      output.on('close',  () => {
        console.log(
          chalk`\n✅ \t{greenBright Sketch file}: {magenta ${Sketch.FILE_NAME}.sketch} – `,
          chalk`was successfully generated with: {cyan ${bytesToSize(archive.pointer())}}\n`,
          chalk`\tIn the folder: {grey ${path.resolve(this._outDir)}/}`,
        );

        if (!process.env.DEBUG) {
          this.cleanup();
        }
        resolve();
      });

      archive.on('warning', (err) => {
        if (err.code === 'ENOENT') {
          if (process.env.DEBUG) {
            console.log('Sketch-File could not be written: ENOENT', err);
          }
        } else {
          reject(err);
        }
      });

      archive.on('error', (err) => {
        reject(err);
      });

      archive.pipe(output);
      archive.directory(path.join(Sketch.TMP_PATH), false);
      archive.finalize();
    });
  }
}
