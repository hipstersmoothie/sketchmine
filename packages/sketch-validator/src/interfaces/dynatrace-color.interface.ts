import { SketchColor } from '@sketchmine/sketch-file-format';

export interface IDynatraceColorPalette {
  [key: string]: IDynatraceColor;
}

export interface IDynatraceColor {
  name: string;
  hex: string;
  cmyk: string;
  rgb?: string;
  pantone?: string;
  normalized?: SketchColor;
}
