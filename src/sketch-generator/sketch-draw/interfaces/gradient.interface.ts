import { SketchObjectTypes } from './base.interface';
import { SketchColor } from './color.interface';

export interface SketchGradient {
  _class: SketchObjectTypes.Gradient;
  elipseLength: number;
  from: string; /** @example "{0.5, 0}" */
  gradientType: number;
  stops: SketchGradientStop[];
  to: string; /** @example "{0.5, 1}" */
}

export interface SketchGradientStop {
  _class: SketchObjectTypes.GradientStop;
  color: SketchColor;
  position: number; /** @example number between 0 and 1 */
}
