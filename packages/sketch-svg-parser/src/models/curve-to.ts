import { CurvePoint } from './curve-point';
import { CurvePointMode, SketchCurvePoint, SketchObjectTypes } from '@sketchmine/sketch-file-format';

export class CurveTo extends CurvePoint {

  generate(): SketchCurvePoint {
    let hasCurveTo = false;
    let hasCurveFrom = false;

    // Check if the point equals the point of the control Point from the tangent
    // to decide if it as has curveFrom (otherwise it is a Point without tangent)
    if (!isNaN(this.next.x1) &&
      !isNaN(this.next.y1) &&
      !super.pointEqalsPoint(
      { x: this.next.x1, y: this.next.y1 }, // Tangent control Point
      { x: this.cur.x, y: this.cur.y }, // Actual Point on curve
    )) {
      hasCurveFrom = true;
    }

    // check the same for the other Tangent Point of the curve
    if (!isNaN(this.cur.x2) &&
      !isNaN(this.cur.y2) &&
      !super.pointEqalsPoint(
      { x: this.cur.x2, y: this.cur.y2 }, // Tangent control Point
      { x: this.cur.x, y: this.cur.y },  // Actual Point on curve
    )) {
      hasCurveTo = true;
    }

    const curvePoint: SketchCurvePoint = {
      _class: SketchObjectTypes.CurvePoint,
      cornerRadius: 0,
      curveFrom: (hasCurveFrom) ? `{${this.next.x1}, ${this.next.y1}}` : `{${this.cur.x}, ${this.cur.y}}`,
      curveMode: CurvePointMode.Disconnected,
      curveTo: (hasCurveTo) ? `{${this.cur.x2}, ${this.cur.y2}}` : `{${this.cur.x}, ${this.cur.y}}`,
      hasCurveFrom,
      hasCurveTo,
      point: `{${this.cur.x}, ${this.cur.y}}`,
    };

    // if it is a smooth curve the next reflect the last control point
    if (this.isSmoothCurveTo(this.next)) {
      const point = {  x: this.cur.x2, y: this.cur.y2 };
      const reflector = { x: this.cur.x, y: this.cur.y };
      const ref = this.reflectTrough(point, reflector);

      curvePoint.hasCurveFrom = true;
      curvePoint.curveMode = CurvePointMode.Mirrored;
      curvePoint.curveFrom = `{${ref.x}, ${ref.y}}`;
    }

    return curvePoint;
  }
}
