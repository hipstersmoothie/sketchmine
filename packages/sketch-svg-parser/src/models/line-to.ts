import { CurvePoint } from './curve-point';
import { CurvePointMode, SketchCurvePoint, SketchObjectTypes } from '@sketchmine/sketch-file-format';

export class LineTo extends CurvePoint {

  generate(): SketchCurvePoint {
    let hasCurveFrom = false;

    // check if next is a curve
    if (!isNaN(this.next.x1) &&
      !isNaN(this.next.y1) &&
      !super.pointEqalsPoint(
      { x: this.next.x1, y: this.next.y1 }, // Tangent control Point
      { x: this.cur.x, y: this.cur.y }, // Actual Point on curve
    )) {
      hasCurveFrom = true;
    }

    return {
      _class: SketchObjectTypes.CurvePoint,
      cornerRadius: 0,
      curveFrom: (hasCurveFrom) ? `{${this.next.x1}, ${this.next.y1}}` : `{${this.cur.x}, ${this.cur.y}}`,
      curveMode: CurvePointMode.Disconnected,
      curveTo: `{${this.cur.x}, ${this.cur.y}}`,
      hasCurveFrom,
      hasCurveTo: false, // cannot have curve to (linear line)
      point: `{${this.cur.x}, ${this.cur.y}}`,
    };
  }
}
