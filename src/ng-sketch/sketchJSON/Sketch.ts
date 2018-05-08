import * as fs from 'fs';
import * as path from 'path';
import * as rimraf from 'rimraf';
import * as archiver from 'archiver';
import { createDir, writeJSON } from './helpers/util';
import { SketchPage } from "./models/SketchPage";
import { SketchDocument } from "./models/SketchDocument";
import { SketchMeta } from "./models/SketchMeta";
import { Page } from './interfaces/Page';
import { Document } from './interfaces/Document';
import { Meta } from './interfaces/Meta';

export class Sketch {
  private static _folder = 'dt-asset-lib';

  constructor() {
    this.write();
  }

  write() {
    const pages = [new SketchPage()];
    const doc = new SketchDocument(pages);
    const meta = new SketchMeta(pages);

    this.generateFolder(pages, doc, meta);
  }

  private async cleanup() {
    await  rimraf(Sketch._folder, () => {});
    await rimraf(`${Sketch._folder}.sketch`, () => {});
  }

  private generateFolder (pages: SketchPage[], doc: SketchDocument, meta: SketchMeta) {
    try {
      createDir(Sketch._folder);
      createDir(path.join(Sketch._folder, 'pages'));
      createDir(path.join(Sketch._folder, 'previews'));

      writeJSON(path.join(Sketch._folder, 'document'), doc.generateObject());
      writeJSON(path.join(Sketch._folder, 'meta'), meta.generateObject());
      writeJSON(path.join(Sketch._folder, 'user'), {});

      pages.forEach(page => {
        writeJSON(path.join(Sketch._folder, 'pages', page.objectID), page.generateObject())
      })

      const image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkBAMAAACCzIhnAAAAG1BMVEXMzMyWlpacnJy+vr6jo6PFxcW3t7eqqqqxsbHbm8QuAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAiklEQVRYhe3QMQ6EIBAF0C+GSInF9mYTs+1ewRsQbmBlayysKefYO2asXbbYxvxHQj6ECQMAEREREf2NQ/fCtp5Zky6vtRMkSJEzhyISynWJnzH6Z8oQlzS7lEc/fLmmQUSvc16OrCPqRl1JePxQYo1ZSWVj9nxrrOb5esw+eXdvzTWfTERERHRXH4tWFZGswQ2yAAAAAElFTkSuQmCC';
      
      let data = image.replace(/^data:image\/png;base64,/, "");
      data  +=  data.replace('+', ' ');
      
      var buff = new Buffer(data,'base64');
      
      const stream = fs.createWriteStream(path.join(Sketch._folder, 'previews', 'preview.png'));
      stream.write(buff);
      stream.on("end", () => {
        stream.end();
      });

    } catch(error) {
      console.error(error);
    }

    this.generateFile();
  }

  private generateFile() {
    const output = fs.createWriteStream(`${Sketch._folder}.sketch`);
    const archive = archiver('zip');
    
    output.on('close',  () => {
        console.log(`\n✅ Sketch file was successfully generated with: ${archive.pointer()} total bytes\n`);
    });

    archive.on('warning', function(err) {
      if (err.code === 'ENOENT') {
        // log warning
      } else {
        // throw error
        throw err;
      }
    });
    
    archive.on('error', (err) =>{
        throw err;
    });
    
    archive.pipe(output);
    archive.directory(path.join(Sketch._folder), false);
    archive.finalize();}

}
