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

/**
 * Rounds a number to a float with default 4 digits after the comma
 *
 * @param num number
 * @param round number -> Digits after the comma
 */
export function round(num: number, round: number = 4) {
  return parseFloat(num.toFixed(round));
}

/**
 * Check if the values of an array are equal
 *
 * @param array any
 */
export function arrayContentEquals(array: any[]) {
  if (!array.length) {
    return true;
  }
  return !array.filter((element) => {
    return element !== array[0];
  }).length;
}

export function boundingClientRectToBounding(bcr: ClientRect | DOMRect): IBounding {
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
  if (!fs.existsSync(path.resolve(folder))) {
    fs.mkdirSync(path.resolve(folder));
  }
}

export function writeJSON(filename: string, content: Object | string) {
  const _content = (typeof content === 'string') ? content : JSON.stringify(content);
  fs.writeFile(`${filename}.json`, _content, 'utf8', () => {});
}

export function delFolder(dir: string) {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach((file, index) => {
      const curPath = path.join(dir, file);
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        delFolder(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dir);
  }
}

export function bytesToSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) {
    return '0 Byte';
  }
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const pow = bytes / Math.pow(1024, i);
  return `${Math.round(pow)} ${sizes[i]}`;
}

export function calcPadding(padding: string, bcr: IBounding): IBounding {
  const spaces = padding.split(' ');
  const bounding = { ...bcr, x: 0, y: 0 };
  switch (spaces.length) {
    case 1:
      bounding.x = parseInt(spaces[0], 10);
      bounding.y = parseInt(spaces[0], 10);
      bounding.height -= parseInt(spaces[0], 10) * 2;
      bounding.width -= parseInt(spaces[0], 10) * 2; break;
    case 2:
      bounding.x = parseInt(spaces[1], 10);
      bounding.y = parseInt(spaces[0], 10);
      bounding.height -= parseInt(spaces[0], 10) * 2;
      bounding.width -= parseInt(spaces[1], 10) * 2; break;
    case 3:
      bounding.x = parseInt(spaces[1], 10);
      bounding.y = parseInt(spaces[0], 10);
      bounding.height -= parseInt(spaces[0], 10) + parseInt(spaces[2], 10);
      bounding.width -= parseInt(spaces[1], 10) * 2; break;
    case 4:
      bounding.x = parseInt(spaces[3], 10);
      bounding.y = parseInt(spaces[0], 10);
      bounding.height -= parseInt(spaces[0], 10) + parseInt(spaces[2], 10);
      bounding.width -= parseInt(spaces[1], 10) + parseInt(spaces[3], 10); break;
  }
  return bounding;
}
