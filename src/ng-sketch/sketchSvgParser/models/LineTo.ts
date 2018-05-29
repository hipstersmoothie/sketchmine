import { CurvePoint } from "./CurvePoint";
import { ICurvePoint } from "../interfaces/ICurvePoint";
import { CurvePointMode } from "../../sketchJSON/helpers/sketchConstants";
import { ISvgPoint } from "../interfaces/ISvgPoint";

export class LineTo extends CurvePoint {

  constructor(last: ISvgPoint, cur: ISvgPoint, next: ISvgPoint) {
    super(last, cur, next);
  }

  addPoint(): ICurvePoint {
    const point = {
      ...this.basePoint,
      point: `{${this._lastP.x}, ${this._lastP.y}}`
    } 

    if (super.isMoveTo(this._lastP)) {
      return {
        ...point,
        curveFrom: `{${this._lastP.x}, ${this._lastP.y}}`,
        curveTo: `{${this._lastP.x}, ${this._lastP.y}}`,
      }
    }

    if (this.isCurveTo(this._lastP)) {
      return {
        ...point,
        curveTo: `{${this._lastP.x2}, ${this._lastP.y2}}`,
        hasCurveFrom: false,
        hasCurveTo: true,
      }
    }

    if (this.isLineTo(this._lastP)) {
      return {
        ...point,
        curveFrom: `{${this._lastP.x}, ${this._lastP.y}}`,
        curveMode: CurvePointMode.Straight,
        curveTo: `{${this._lastP.x}, ${this._lastP.y}}`,
        hasCurveTo: true,
        hasCurveFrom: false,
      }
    }
  }
}
