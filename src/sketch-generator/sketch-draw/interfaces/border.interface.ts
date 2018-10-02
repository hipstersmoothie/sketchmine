import { SketchColor } from './color.interface';
import { FillType } from '../helpers';
import { SketchObjectTypes } from './base.interface';

export interface SketchBorder {
  _class: SketchObjectTypes.Border;
  isEnabled: boolean;
  color: SketchColor;
  fillType: FillType;
  position: number;
  thickness: number;
}
