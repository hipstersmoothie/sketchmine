import { CurvePoint } from "./CurvePoint";
import { ICurvePoint } from "../interfaces/ICurvePoint";
import { CurvePointMode } from "../../sketchJSON/helpers/sketchConstants";
import { round, arrayContentEquals } from "../../sketchJSON/helpers/util";

export class MoveTo extends CurvePoint {

  /**
   * Todo : implement hasCurveTo and curveTo
   *        - need to check the last point if it is a curve
   */   
  generate(): ICurvePoint {
    let hasCurveTo = false;
    let hasCurveFrom = false;
    
    // Check if the next point has the properties x1 and y1 (tangent controll points)
    // then you know that it has a curve from
    hasCurveFrom = ['x1', 'y1'].every((key) => Object.keys(this.next).includes(key) );

    return {
      _class: 'curvePoint',
      cornerRadius: 0,
      curveFrom: (hasCurveFrom)? `{${this.next.x1}, ${this.next.y1}}`: `{${this.cur.x}, ${this.cur.x}}`,
      curveMode: CurvePointMode.Disconnected,
      curveTo: `{${this.cur.x}, ${this.cur.x}}`,
      hasCurveFrom,
      hasCurveTo,
      point: `{${this.cur.x}, ${this.cur.y}}`,
    };
  }
}
