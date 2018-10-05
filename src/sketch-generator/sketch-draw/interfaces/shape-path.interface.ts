import { SketchBase } from './base.interface';
import { SketchCurvePoint } from './curve-point.interface';
import { BooleanOperation } from '../helpers';

export interface SketchShapePath extends SketchBase {
  booleanOperation: BooleanOperation;
  edited: boolean;
  isClosed: boolean;
  pointRadiusBehaviour: number;
  points: SketchCurvePoint[];
}
