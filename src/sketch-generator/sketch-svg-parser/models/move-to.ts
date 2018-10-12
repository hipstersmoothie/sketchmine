import { CurvePoint } from './curve-point';
import { CurvePointMode } from '../../sketch-draw/helpers/sketch-constants';
import { SketchCurvePoint, SketchObjectTypes } from '../../sketch-draw/interfaces';

export class MoveTo extends CurvePoint {

  /**
   * Todo : implement hasCurveTo and curveTo
   *        - need to check the last point if it is a curve
   */
  generate(): SketchCurvePoint {
    const hasCurveTo = false;

    // Check if the next point has the properties x1 and y1 (tangent controll points)
    // then you know that it has a curve from
    const hasCurveFrom = ['x1', 'y1'].every(key => Object.keys(this.next).includes(key));

    return {
      _class: SketchObjectTypes.CurvePoint,
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
