import { SketchColorBase } from './color.interface';
import { PatternFillType } from '../helpers';
import { SketchGradient } from './gradient.interface';

export interface SketchFill extends SketchColorBase {
  gradient?: SketchGradient;
  noiseIndex: 0;
  noiseIntensity: 0;
  patternFillType: PatternFillType;
  patternTileScale: 1;
}
