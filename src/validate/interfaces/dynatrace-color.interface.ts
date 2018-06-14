import { IColor } from '../../ng-sketch/sketchJSON/interfaces/style.interface';

export interface IDynatraceColorPalette {
  [key: string]: IDynatraceColor;
}

export interface IDynatraceColor {
  name: string;
  hex: string;
  cmyk: string;
  rgb?: string;
  pantone?: string;
  normalized?: IColor;
}
