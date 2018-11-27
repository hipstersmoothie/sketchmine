import { SketchColor } from './color.interface';
import { FillType, PatternFillType } from '../helpers';
import { SketchObjectTypes } from './base.interface';
import { SketchGradient } from './gradient.interface';

export interface SketchFill {
  _class: SketchObjectTypes.Fill;
  isEnabled: boolean;
  color: SketchColor;
  fillType: FillType;
  gradient?: SketchGradient;
  noiseIndex: 0;
  noiseIntensity: 0;
  patternFillType: PatternFillType;
  patternTileScale: 1;
}
