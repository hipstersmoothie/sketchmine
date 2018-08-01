import { CurvePoint } from '@sketch-svg-parser/models/curve-point';
import { ICurvePoint } from '@sketch-svg-parser/interfaces';
import { CurvePointMode } from '@sketch-draw/helpers/sketch-constants';

export class MoveTo extends CurvePoint {

  /**
   * Todo : implement hasCurveTo and curveTo
   *        - need to check the last point if it is a curve
   */
  generate(): ICurvePoint {
    const hasCurveTo = false;
    let hasCurveFrom = false;

    // Check if the next point has the properties x1 and y1 (tangent controll points)
    // then you know that it has a curve from
    hasCurveFrom = ['x1', 'y1'].every(key => Object.keys(this.next).includes(key));

    return {
      _class: 'curvePoint',
      cornerRadius: 0,
      curveFrom: (hasCurveFrom) ? `{${this.next.x1}, ${this.next.y1}}` : `{${this.cur.x}, ${this.cur.y}}`,
      curveMode: CurvePointMode.Disconnected,
      curveTo: `{${this.cur.x}, ${this.cur.y}}`,
      hasCurveFrom,
      hasCurveTo,
      point: `{${this.cur.x}, ${this.cur.y}}`,
    };
  }
}
