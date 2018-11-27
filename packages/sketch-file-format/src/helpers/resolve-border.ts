import { StyleDeclaration } from '@sketchmine/dom-agent';

export type BorderStyle  =
  'none' |
  'hidden' |
  'dotted' |
  'dashed' |
  'solid' |
  'double' |
  'groove' |
  'ridge' |
  'inset' |
  'outset';

export interface Border {
  width: number;
  style: BorderStyle;
  color: string;
}

/**
 * converts Border String in Border Object
 * @param {string} border 13px solid rgb(0, 0, 255)
 * @returns {Border} Object with width style and color
 * @see https://regex101.com/r/5QtZ6i/2/
 */
export function borderStringToObject(border: string): Border {
  const b = border.match(/(^\d+?px)\s(\w+?)\s(.+)$/);
  return {
    width: parseInt(b[1], 10),
    style: b[2] as BorderStyle,
    color: b[3],
  };
}

export function resolveBorder(style: StyleDeclaration): Border | (Border | null)[] | null {

  const borders = [
    style.borderTop,
    style.borderRight,
    style.borderBottom,
    style.borderLeft,
  ];
  const border = new Set<string>(borders);

  if (border.size === 1) {
    const b = borderStringToObject(borders[0]);
    if (b.width === 0 || b.style === 'none') {
      return null;
    }
    return b;
  }

  const allBorders: (Border | null)[] = borders.map((b: string) => {
    const singleBorder = borderStringToObject(b);
    if (singleBorder.width === 0 || singleBorder.style === 'none') {
      return null;
    }
    return singleBorder;
  });

  if (allBorders.every(b => b === null)) {
    return null;
  }
  return allBorders;
}
