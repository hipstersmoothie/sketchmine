import { CurvePoint } from '@sketch-svg-parser/models/curve-point';
import { ICurvePoint } from '@sketch-svg-parser/interfaces';
import { CurvePointMode } from '@sketch-draw/helpers/sketch-constants';

export class QuadraticCurveTo extends CurvePoint {

  generate(): ICurvePoint {

    return {
      _class: 'curvePoint',
      cornerRadius: 0,
      curveFrom: `{${this.cur.x1}, ${this.cur.y1}}`,
      curveMode: CurvePointMode.Disconnected,
      curveTo:`{${this.cur.x1}, ${this.cur.y1}}`,
      hasCurveFrom: true,
      hasCurveTo: true,
      point: `{${this.cur.x}, ${this.cur.y}}`,
    };
  }
}
