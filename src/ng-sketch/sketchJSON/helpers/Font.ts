import { TextAlignment } from "./sketchConstants";

export function convertTextAlign(alignment: string) {
  switch(alignment) {
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
        .replace(/\s+/g, ' ');// collapse whitespace
    case 'pre-line':
      return text
        .replace(/(^[^\S\n]+)|([^\S\n]+$)/g, '')// trim but leave \n
        .replace(/[^\S\n]+/g, ' ')// collapse whitespace (except \n)
        .replace(/[^\S\n]?\n[^\S\n]?/g, '\n');// remove whitespace before & after \n
    default:
      // pre, pre-wrap
  }
  return text;
}
