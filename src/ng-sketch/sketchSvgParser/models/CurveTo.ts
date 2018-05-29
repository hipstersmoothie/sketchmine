import { CurvePoint } from "./CurvePoint";
import { ICurvePoint } from "../interfaces/ICurvePoint";
import { CurvePointMode } from "../../sketchJSON/helpers/sketchConstants";
import { ISvgPoint } from "../interfaces/ISvgPoint";

export class CurveTo extends CurvePoint {

  constructor(last: ISvgPoint, cur: ISvgPoint, next: ISvgPoint) {
    super(last, cur, next);
  }

  addPoint(): ICurvePoint {
    const point = {
      ...this.basePoint,
      point: `{${this._lastP.x}, ${this._lastP.y}}`
    } 


    if (this.isCurveTo(this._lastP)) {
      return {
        ...point,
        curveFrom: `{${this._curP.x1}, ${this._curP.y1}}`,
        curveTo: `{${this._lastP.x2}, ${this._lastP.y2}}`,
        hasCurveTo: true,
        hasCurveFrom: true,
        point: `{${this._lastP.x}, ${this._lastP.y}}`,
      }
    }

    if (this._lastP.code === 'M') {
      return {
        ...point,
        curveFrom: `{${this._curP.x1}, ${this._curP.y1}}`,
        curveTo: `{${this._lastP.x}, ${this._lastP.y}}`,
        hasCurveTo: true,
        hasCurveFrom: true,
      }
    }
  }
}
