import { CurvePoint } from "./CurvePoint";
import { ICurvePoint } from "../interfaces/ICurvePoint";
import { CurvePointMode } from "../../sketchJSON/helpers/sketchConstants";
import { round, arrayContentEquals } from "../../sketchJSON/helpers/util";

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
    }
  }
}
