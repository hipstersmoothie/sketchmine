import { IBounding } from '../interfaces';

const normalizeCssColor = require('normalize-css-color');

export interface IRGBA { r: number; g: number; b: number; a: number; }

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

export function cssToRGBA(input: string | any): IRGBA {
  const nullableColor = normalizeCssColor(safeToLower(input));
  const colorInt = nullableColor === null ? 0x00000000 : nullableColor;

  return normalizeCssColor.rgba(colorInt);
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

/**
 * Compares two maps if the key value pares are equal
 *
 * @param map1 Map<any, any>
 * @param map2 Map<any, any>
 * @returns boolean
 */
export function compareMaps(map1: Map<any, any>, map2: Map<any, any>): boolean {
  if (map1.size !== map2.size) {
    return false;
  }
  let testVal;
  for (const [key, val] of map1) {
    testVal = map2.get(key);
    // in cases of an undefined value, make sure the key
    // actually exists on the object so there are no false positives
    if (testVal !== val || (testVal === undefined && !map2.has(key))) {
      return false;
    }
  }
  return true;
}
