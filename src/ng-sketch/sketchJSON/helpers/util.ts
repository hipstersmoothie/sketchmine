import * as fs from 'fs';
import * as path from 'path';
const normalizeColor = require('normalize-css-color');

// var normalizeColor: any

interface IRGBA { r: number; g: number; b: number; a: number; }

export function safeToLower(input: string | any): string | any {
  if (typeof input === 'string') {
    return input.toLowerCase();
  }

  return input;
}

export function cssToRGBA(input: string | any) {
  const nullableColor = normalizeColor(safeToLower(input));
  const colorInt = nullableColor === null ? 0x00000000 : nullableColor;

  return normalizeColor.rgba(colorInt) as IRGBA;
}

export function createDir(folder: string) {
  if (!folder) {
    throw new Error('Could not create the folder, no path provided!');
  }
  if (!fs.existsSync(path.resolve(folder))){
    fs.mkdirSync(path.resolve(folder));
  }
}

export function cleanDir(folder: string) {
  if (!folder) {
    throw new Error('Could not create the folder, no path provided!');
  }
  if (fs.existsSync(path.resolve(folder))) {
    // TODO: Clean folder first
  }
}

export function writeJSON(filename: string, content: Object | string) {
  content = (typeof content === 'string')? content : JSON.stringify(content);
  fs.writeFile(`${filename}.json`, content, 'utf8', () => {});
}

export function delFolder(dir: string) {
  if( fs.existsSync(dir) ) {
    fs.readdirSync(dir).forEach((file,index) => {
      const curPath = path.join(dir, file);
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        delFolder(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dir);
  }
};
