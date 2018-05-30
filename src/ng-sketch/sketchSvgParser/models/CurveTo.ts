import { CurvePoint } from "./CurvePoint";
import { ICurvePoint } from "../interfaces/ICurvePoint";
import { CurvePointMode } from "../../sketchJSON/helpers/sketchConstants";
import { ISvgPoint } from "../interfaces/ISvgPoint";
import { round, arrayContentEquals } from "../../sketchJSON/helpers/util";

/**
 * Curve Defiition:
 * 
 * @example 
 *    { 
 *      ...
 *      curveFrom: poit.x2,
 *      curvoTo: last.x1,
 *      point: poinnt.x,
 *    }
 */
export class CurveTo extends CurvePoint {

  constructor(last: ISvgPoint, cur: ISvgPoint, next: ISvgPoint) {
    super(last, cur, next);
  }

  generate(): ICurvePoint {
    const point = this.cur;
    const last = this.last;
    const hasCurveTo = !!(last.x1);
    const hasCurveFrom = !!(point.x2);

    return {
      _class: 'curvePoint',
      cornerRadius: 0,
      curveFrom: `{${point.x2}, ${point.y2}}`,
      curveMode: CurvePointMode.Disconnected,
      curveTo: `{${last.x1}, ${last.y1}}`,
      hasCurveFrom,
      hasCurveTo,
      point: `{${point.x}, ${point.y}}`,
    }





    // if (this.isCurveTo(this._lastP)) {
    //   return {
    //     _class: 'curvePoint',
    //     cornerRadius: 0,
    //     curveFrom: `{${this._curP.x1}, ${this._curP.y1}}`,
    //     curveMode: CurvePointMode.Disconnected,
    //     curveTo: `{${this._lastP.x2}, ${this._lastP.y2}}`,
    //     hasCurveTo,
    //     hasCurveFrom,
    //     point: `{${this._lastP.x}, ${this._lastP.y}}`,
    //   }
    // }

    // if (this._lastP.code === 'M') {
    //   return {
    //     _class: 'curvePoint',
    //     cornerRadius: 0,
    //     curveFrom: `{${this._curP.x1}, ${this._curP.y1}}`,
    //     curveMode: CurvePointMode.Disconnected,
    //     curveTo: `{${this._lastP.x}, ${this._lastP.y}}`,
    //     hasCurveTo,
    //     hasCurveFrom,
    //     point: `{${this._lastP.x}, ${this._lastP.y}}`,
    //   }
    // }
  }
}
