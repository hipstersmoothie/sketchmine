import { CurvePoint } from '@sketch-svg-parser/models/curve-point';
import { ICurvePoint } from '@sketch-svg-parser/interfaces';
import { CurvePointMode } from '@sketch-draw/helpers/sketch-constants';

export class LineTo extends CurvePoint {

  generate(): ICurvePoint {
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
      _class: 'curvePoint',
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
