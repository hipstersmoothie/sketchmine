import { SketchObjectTypes } from './base.interface';
import { FillType } from '../helpers';

export interface SketchColor {
  _class: SketchObjectTypes.Color;
  alpha: number;
  blue: number;
  green: number;
  red: number;
}

export interface SketchColorBase {
  _class: SketchObjectTypes;
  color: SketchColor;
  isEnabled: boolean;
  fillType: FillType;
}
