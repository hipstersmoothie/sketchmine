import { TextAlignment } from './sketch-constants';

export function resolveTextAlign(align: string): TextAlignment {
  switch (align) {
    case 'center':
      return TextAlignment.Center;
    case 'end':
    case 'right':
      return TextAlignment.Right;
    case 'justify':
    case 'justify-all':
      return TextAlignment.Justified;
    default:
      return TextAlignment.Left;
  }
}
