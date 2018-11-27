import { copyFile, createDir, delDir, generateSketchFile, writeJSON } from '@utils';
import { Document } from '@sketch-draw/models/document';
import { Meta } from '@sketch-draw/models/meta';
import { Page } from '@sketch-draw/models/page';
import { dirname, resolve, basename, join } from 'path';
import chalk from 'chalk';

const config = require(`${process.cwd()}/config/app.json`);

export class Sketch {
  private static TMP_PATH = resolve('_sketch_tmp');
  private _outDir: string;
  private _fileName: string;

  constructor(outFile?: string) {
    this._outDir = dirname(outFile) || './';
    this._fileName = basename(outFile, '.sketch') || 'dt-asset-lib';
  }

  async write(pages: Page[]): Promise<any> {
    const doc = new Document(pages);
    const meta = new Meta(pages);

    await this.generateFolderStructure(pages, doc, meta);
    return generateSketchFile(this._outDir, this._fileName, Sketch.TMP_PATH);
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
    createDir(join(Sketch.TMP_PATH, 'pages'));
    createDir(join(Sketch.TMP_PATH, 'previews'));
    createDir(join(Sketch.TMP_PATH, 'images'));
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
    if (process.env.DEBUG === 'true') {
      console.log(chalk`\n\n\t{yellow ——— GENERATING FOLDER STRUCTURE ———}\n`);
    }
    this.prepareFolders();
    await writeJSON(join(Sketch.TMP_PATH, 'document'), doc.generateObject());
    await writeJSON(join(Sketch.TMP_PATH, 'meta'), meta.generateObject());
    await writeJSON(join(Sketch.TMP_PATH, 'user'), {});

    pages.forEach(async (page) => {
      await writeJSON(join(Sketch.TMP_PATH, 'pages', page.objectID), page.generateObject());
    });

    const preview = join(process.cwd(), config.sketchGenerator.previewImage);
    await copyFile(preview, join(Sketch.TMP_PATH, 'previews'));
  }
}
