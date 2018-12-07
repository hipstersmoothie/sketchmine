import { IPoint, SketchObjectTypes, SketchCurvePoint } from '../interfaces';
import { CurvePointMode } from '../helpers/sketch-constants';

export class CurvePoint {

  radius = 0;
  curveMode = CurvePointMode.Disconnected;
  hasCurveFrom: boolean;
  hasCurveTo: boolean;
  curveFrom: IPoint;
  curveTo: IPoint;
  constructor(private point: IPoint, curveFrom?: IPoint, curveTo?: IPoint) {
    this.curveFrom = !curveFrom ? this.point : curveFrom;
    this.curveTo = !curveTo ? this.point : curveTo;
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
