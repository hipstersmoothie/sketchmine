import { copyFile, createDir, delDir, generateSketchFile, writeJSON } from '@utils';
import { Document } from '@sketch-draw/models/document';
import { Meta } from '@sketch-draw/models/meta';
import { Page } from '@sketch-draw/models/page';
import * as path from 'path';
import chalk from 'chalk';

export class Sketch {
  private static FILE_NAME = 'dt-asset-lib';
  private static TMP_PATH = path.resolve('_tmp');
  private _outDir: string;

  constructor(outDir?: string) {
    this._outDir = outDir || './';
  }

  async write(pages: Page[]): Promise<any> {
    try {
      const doc = new Document(pages);
      const meta = new Meta(pages);

      await this.generateFolderStructure(pages, doc, meta);
      return generateSketchFile(this._outDir, Sketch.FILE_NAME, Sketch.TMP_PATH);
    } catch (error) {
      console.error(error);
    }
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
  private async generateFolderStructure (pages: Page[], doc: Document, meta: Meta) {
    try {
      if (process.env.DEBUG === 'true') {
        console.log(chalk`\n\n\t{yellow ——— GENERATING FOLDER STRUCTURE ———}\n`);
      }
      this.prepareFolders();
      await writeJSON(path.join(Sketch.TMP_PATH, 'document'), doc.generateObject());
      await writeJSON(path.join(Sketch.TMP_PATH, 'meta'), meta.generateObject());
      await writeJSON(path.join(Sketch.TMP_PATH, 'user'), {});

      pages.forEach(async (page) => {
        await writeJSON(path.join(Sketch.TMP_PATH, 'pages', page.objectID), page.generateObject());
      });

      const preview = path.resolve(__dirname, '..', '..', 'assets', 'preview.png');
      await copyFile(preview, path.join(Sketch.TMP_PATH, 'previews'));
    } catch (error) {
      console.error(error);
    }
  }
}
