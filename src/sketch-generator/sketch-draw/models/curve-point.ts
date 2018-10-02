import { IPoint, SketchObjectTypes, SketchCurvePoint } from '../interfaces';
import { CurvePointMode } from '../helpers';

export class CurvePoint {

  radius = 0;
  curveMode = CurvePointMode.Disconnected;
  hasCurveFrom: boolean;
  hasCurveTo: boolean;
  constructor(private point: IPoint, private curveFrom: IPoint, private curveTo: IPoint) {
    this.hasCurveFrom = !!(this.point.x !== this.curveFrom.x || this.point.y !== this.curveFrom.y);
    this.hasCurveTo = !!(this.point.x !== this.curveTo.x || this.point.y !== this.curveTo.y);
  }

  generateObject(): SketchCurvePoint {
    return {
      _class: SketchObjectTypes.CurvePoint,
      cornerRadius: this.radius,
      curveFrom: `{${this.curveFrom.x}, ${this.curveFrom.y}}`,
      curveMode: this.curveMode,
      curveTo: `{${this.curveTo.x}, ${this.curveTo.y}}`,
      hasCurveFrom: false,
      hasCurveTo: false,
      point: `{${this.point.x}, ${this.point.y}}`,
    };
  }
}
