import { cssToRGBA, IRGBA } from './util';

export type TextDecorationType =  'none' | 'line-through' | 'underline';
export type TextDecorationStyle = 'solid' | 'double';

export interface TextDecoration {
  type: TextDecorationType;
  style: TextDecorationStyle;
  color: IRGBA;
}

export function resolveTextDecoration(textDecoration: string): TextDecoration | null {
  const match = textDecoration.match(/^([\w-]+?)\s(\w+?)\s(.+)$/);

  if (!match || match[1] === 'none') { return null; }

  return {
    type: match[1] as TextDecorationType,
    style: match[2] as TextDecorationStyle,
    color: cssToRGBA(match[3]),
  };
}
