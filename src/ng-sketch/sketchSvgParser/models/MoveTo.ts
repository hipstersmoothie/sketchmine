import { CurvePoint } from "./CurvePoint";
import { ICurvePoint } from "../interfaces/ICurvePoint";
import { CurvePointMode } from "../../sketchJSON/helpers/sketchConstants";
import { ISvgPoint } from "../interfaces/ISvgPoint";
import { round, arrayContentEquals } from "../../sketchJSON/helpers/util";

export class MoveTo extends CurvePoint {

  constructor(last: ISvgPoint, cur: ISvgPoint, next: ISvgPoint) {
    super(last, cur, next);
  }

  /**
   * Todo : implement hasCurveTo and curveTo
   *        - need to check the last point if it is a curve
   */   
  generate(): ICurvePoint {
    const point = this.cur;
    const last = this.last;
    const next = this.next;
    let hasCurveTo = false;
    let hasCurveFrom = false;

    // Check if next exists and if it has tangent Points
    if (next && next.x1 && next.y1) {
      hasCurveFrom = true
    }

    return {
      _class: 'curvePoint',
      cornerRadius: 0,
      curveFrom: (hasCurveFrom)? `{${next.x1}, ${next.y1}}`: `{${point.x}, ${point.x}}`,
      curveMode: CurvePointMode.Disconnected,
      curveTo: `{${point.x}, ${point.x}}`,
      hasCurveFrom,
      hasCurveTo,
      point: `{${point.x}, ${point.y}}`,
    };
  }
}
