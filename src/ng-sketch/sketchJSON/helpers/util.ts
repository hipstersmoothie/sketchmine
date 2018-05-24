import * as fs from 'fs';
import * as path from 'path';
import { NSArchiveParser } from './NSArchiveParser';
import * as bplistParser from 'bplist-parser';
import * as normalizeColor from 'normalize-css-color';
import { IBounding } from '../interfaces/Base';

interface IRGBA { r: number; g: number; b: number; a: number; }

export function safeToLower(input: string | any): string | any {
  if (typeof input === 'string') {
    return input.toLowerCase();
  }

  return input;
}

export function BoundingClientRectToBounding(bcr: ClientRect | DOMRect): IBounding {
  return {
    height: bcr.height, 
    width: bcr.width, 
    x: bcr.left, 
    y: bcr.top
  };
}

export function cssToRGBA(input: string | any) {
  const nullableColor = normalizeColor(safeToLower(input));
  const colorInt = nullableColor === null ? 0x00000000 : nullableColor;

  return normalizeColor.rgba(colorInt) as IRGBA;
}

export function parseBorderRadius(borderRadius, width, height) {
  const matches = borderRadius.match(/^([0-9.]+)(.+)$/);

  // Sketch uses 'px' units for border radius, so we need to convert % to px
  if (matches && matches[2] === '%') {
    const baseVal = Math.max(width, height);
    const percentageApplied = baseVal * (parseInt(matches[1], 10) / 100);

    return Math.round(percentageApplied);
  }
  return parseInt(borderRadius, 10);
}

export function createDir(folder: string) {
  if (!folder) {
    throw new Error('Could not create the folder, no path provided!');
  }
  if (!fs.existsSync(path.resolve(folder))){
    fs.mkdirSync(path.resolve(folder));
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

/**
 * Returns NSArchive from Base64 encoded String+
 * @param b64 {string} Base64 bplist encoded String
 * @author BenjaminDobler https://raw.githubusercontent.com/BenjaminDobler/ng-sketch/dcfd27e903848f629bc19ab8a694991d311ee8a4/src/app/services/sketch.document.ts
 */
export function parseArchive(b64: string) {
  const buf = new Buffer( b64, 'base64');
  const obj = bplistParser.parseBuffer(buf);
  return obj;
  // const parser: NSArchiveParser = new NSArchiveParser();
  // return parser.parse(obj);
}
