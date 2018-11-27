import { SketchObjectTypes } from './base.interface';

export interface SketchCurvePoint {
  _class: SketchObjectTypes.CurvePoint;
  cornerRadius: number;
  curveFrom: string;
  curveMode: number;
  curveTo: string;
  hasCurveFrom: boolean;
  hasCurveTo: boolean;
  point: string;
}
