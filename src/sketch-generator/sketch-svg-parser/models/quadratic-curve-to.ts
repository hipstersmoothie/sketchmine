import { CurvePoint } from '@sketch-svg-parser/models/curve-point';
import { CurvePointMode } from '@sketch-draw/helpers/sketch-constants';
import { SketchObjectTypes, SketchCurvePoint } from '../../sketch-draw/interfaces';

export class QuadraticCurveTo extends CurvePoint {

  generate(): SketchCurvePoint {

    return {
      _class: SketchObjectTypes.CurvePoint,
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
