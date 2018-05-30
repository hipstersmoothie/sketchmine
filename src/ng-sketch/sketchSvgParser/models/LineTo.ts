import { CurvePoint } from "./CurvePoint";
import { ICurvePoint } from "../interfaces/ICurvePoint";
import { CurvePointMode } from "../../sketchJSON/helpers/sketchConstants";

export class LineTo extends CurvePoint {

  generate(): ICurvePoint {
    let hasCurveTo = false;
    let hasCurveFrom = false;
    
    return {
      _class: 'curvePoint',
      cornerRadius: 0,
      curveFrom: `{${this.cur.x}, ${this.cur.x}}`,
      curveMode: CurvePointMode.Disconnected,
      curveTo: `{${this.cur.x}, ${this.cur.x}}`,
      hasCurveFrom,
      hasCurveTo,
      point: `{${this.cur.x}, ${this.cur.y}}`,
    };
  }
}
