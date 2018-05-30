import { CurvePoint } from "./CurvePoint";
import { ICurvePoint } from "../interfaces/ICurvePoint";
import { CurvePointMode } from "../../sketchJSON/helpers/sketchConstants";
import { ISvgPoint, IPoint } from "../interfaces/ISvgPoint";
import { round, arrayContentEquals } from "../../sketchJSON/helpers/util";

export class CurveTo extends CurvePoint {

  constructor(last: ISvgPoint, cur: ISvgPoint, next: ISvgPoint) {
    super(last, cur, next);
  }

  generate(): ICurvePoint {
    const point = this.cur;
    const last = this.last;
    const next = this.next;
    let hasCurveTo = false;
    let hasCurveFrom = false;

    // Check if the point equals the point of the control Point from the tangent 
    // to decide if it as has curveFrom (otherwise it is a Point without tangent)
    if(next.x1 && next.y1 &&
      !super.pointEqalsPoint(
      {x: next.x1, y: next.y1}, // Tangent control Point
      {x: point.x, y: point.y}  // Actual Point on curve
    )) {
      hasCurveFrom = true;
    }

    // check the same for the other Tangent Point of the curve
    if(point.x2 && point.y2 &&
      !super.pointEqalsPoint(
      {x: point.x2, y: point.y2}, // Tangent control Point
      {x: point.x, y: point.y}  // Actual Point on curve
    )) {
      hasCurveTo = true;
    }

    return {
      _class: 'curvePoint',
      cornerRadius: 0,
      curveFrom: (hasCurveFrom)? `{${next.x1}, ${next.y1}}` : `{${point.x}, ${point.y}}`,
      curveMode: CurvePointMode.Disconnected,
      curveTo: (hasCurveTo)? `{${point.x2}, ${point.y2}}`: `{${point.x}, ${point.y}}`,
      hasCurveFrom,
      hasCurveTo,
      point: `{${point.x}, ${point.y}}`,
    }
  }
}
