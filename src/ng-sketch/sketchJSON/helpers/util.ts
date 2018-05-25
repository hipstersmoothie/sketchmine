import * as fs from 'fs';
import * as path from 'path';
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
    height: Math.round(bcr.height), 
    width: Math.round(bcr.width),
    x: Math.round(bcr.left), 
    y: Math.round(bcr.top),
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

export function calcPadding(padding: string, bcr: IBounding): IBounding {
  const spaces = padding.split(' ');
  const bounding = {...bcr, x: 0, y: 0 };
  switch (spaces.length) {
    case 1: 
      bounding.x = parseInt(spaces[0], 10);
      bounding.y = parseInt(spaces[0], 10);
      bounding.height -= parseInt(spaces[0], 10) * 2;
      bounding.width -= parseInt(spaces[0], 10) * 2; break
    case 2: 
      bounding.x = parseInt(spaces[1], 10);
      bounding.y = parseInt(spaces[0], 10);
      bounding.height -= parseInt(spaces[0], 10) * 2;
      bounding.width -= parseInt(spaces[1], 10) * 2; break
    case 3: 
      bounding.x = parseInt(spaces[1], 10);
      bounding.y = parseInt(spaces[0], 10);
      bounding.height -= parseInt(spaces[0], 10) + parseInt(spaces[2], 10);
      bounding.width -= parseInt(spaces[1], 10) * 2; break
    case 4: 
      bounding.x = parseInt(spaces[3], 10);
      bounding.y = parseInt(spaces[0], 10);
      bounding.height -= parseInt(spaces[0], 10) + parseInt(spaces[2], 10);
      bounding.width -= parseInt(spaces[1], 10) + parseInt(spaces[3], 10); break
  }
  return bounding;
}
