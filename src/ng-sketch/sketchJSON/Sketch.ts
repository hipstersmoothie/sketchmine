import { copyFile } from '../../utils/copy-file';
import { createDir } from '../../utils/create-dir';
import { delDir } from '../../utils/del-folder';
import { Document } from './models/document';
import { generateSketchFile } from '../../utils/generate-sketch-file';
import { Meta } from './models/meta';
import { Page } from './models/page';
import { writeJSON } from '../../utils/write-json';
import * as fs from 'fs';
import * as path from 'path';

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
    return generateSketchFile(this._outDir, Sketch.FILE_NAME, Sketch.TMP_PATH);
  }

  /**
   * Cleans the _tmp folder
   */
  cleanup() {
    delDir(Sketch.TMP_PATH);
  }

  /**
   * Create Folder structure for the .sketch File Format
   */
  prepareFolders() {
    delDir(Sketch.TMP_PATH);
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
}
