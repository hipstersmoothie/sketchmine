import { SketchObjectTypes } from './base.interface';

export interface SketchColor {
  _class: SketchObjectTypes.Color;
  alpha: number;
  blue: number;
  green: number;
  red: number;
}
