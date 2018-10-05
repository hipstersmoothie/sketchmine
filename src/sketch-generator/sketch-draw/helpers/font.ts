import { TextAlignment } from './sketch-constants';

const textWeights = {
  lighter: 200,
  normal: 400,
  bold: 700,
  bolder: 900,
  initial: 400,
  inherit: 400,
};

export type fontStyle = 'normal' | 'italic' | 'oblique' | 'initial' | 'inherit';

export function convertTextAlign(alignment: string) {
  switch (alignment) {
    case 'center': return TextAlignment.Center;
    case 'right': return TextAlignment.Right;
    case 'left': return TextAlignment.Left;
    case 'justified': return TextAlignment.Justified;
  }
  return 0;
}

export function fixWhiteSpace(text: string, whiteSpace: string) {
  switch (whiteSpace) {
    case 'normal':
    case 'nowrap':
      return text
        .trim()
        .replace(/\n/g, ' ')// replace newline characters with space
        .replace(/\s+/g, ' '); // collapse whitespace
    case 'pre-line':
      return text
        .replace(/(^[^\S\n]+)|([^\S\n]+$)/g, '')// trim but leave \n
        .replace(/[^\S\n]+/g, ' ')// collapse whitespace (except \n)
        .replace(/[^\S\n]?\n[^\S\n]?/g, '\n'); // remove whitespace before & after \n
    default:
      // pre, pre-wrap
  }
  return text;
}

export function fontMapping(
  fontFamily: string,
  fontWeight: string,
  style: fontStyle = 'normal',
): string {
  const weight = convertFontWeightToNumber(fontWeight);

  if (fontFamily !== 'BerninaSansWeb') {
    return fontFamily;
  }

  if (weight === 900 && style === 'italic') { return 'BerninaSans-ExtraboldItalic'; }
  if (weight === 900) { return 'BerninaSans-Extrabold'; }
  if (weight === 700 && style === 'italic') { return 'BerninaSans-BoldItalic'; }
  if (weight === 700) { return 'BerninaSans-Bold'; }
  if (weight === 600 && style === 'italic') { return 'BerninaSans-SemiboldItalic'; }
  if (weight === 600) { return 'BerninaSans-Semibold'; }
  if (weight === 400 && style === 'italic') { return 'BerninaSans-Italic'; }
  if (weight === 400) { return 'BerninaSans'; }
  if (weight === 300 && style === 'italic') { return 'BerninaSans-LightItalic'; }
  if (weight === 300) { return 'BerninaSans-Light'; }

  return 'BerninaSans';
}

export function convertFontWeightToNumber(fontWeight: string): number {
  if (Object.keys(textWeights).includes(fontWeight)) {
    if (fontWeight === 'initial' || fontWeight === 'inherit') {
      return 400;
    }
    return textWeights[fontWeight] || 400;
  }
  return parseInt(fontWeight, 10);
}
