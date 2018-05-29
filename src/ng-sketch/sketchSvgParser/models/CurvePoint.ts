import { CurvePointMode } from '../../sketchJSON/helpers/sketchConstants';
import { ISvgPoint } from '../interfaces/ISvgPoint';
import { ICurvePoint } from '../interfaces/ICurvePoint';


export class CurvePoint {
  protected _lastP: ISvgPoint;
  protected _curP: ISvgPoint;
  protected _nextP: ISvgPoint;

  protected basePoint: ICurvePoint;

  constructor(last: ISvgPoint, cur: ISvgPoint, next: ISvgPoint) {

    this._lastP = last;
    this._curP = cur;
    this._nextP = next;
    this.basePoint = {
      _class: 'curvePoint',
      cornerRadius: 0,
      curveFrom: `{${this._lastP.x}, ${this._lastP.y}}`,
      curveMode: CurvePointMode.Straight,
      curveTo: `{${this._lastP.x}, ${this._lastP.y}}`,
      hasCurveTo: false,
      hasCurveFrom: false,
      point: `{${this._lastP.x}, ${this._lastP.y}}`,
    }
  }

  get last(): ISvgPoint { return this._lastP; }
  get cur(): ISvgPoint { return this._curP; }
  get next(): ISvgPoint { return this._nextP; }

  protected isMoveTo(point: ISvgPoint): boolean { return point && point.code === 'M' || point && point.code === 'm'; }
  protected isLineTo(point: ISvgPoint): boolean { return point && point.code === 'L' || point && point.code === 'l'; }
  protected isCurveTo(point: ISvgPoint): boolean { return point && point.code === 'C' || point && point.code === 'c'; }
  protected isQuadratic(point: ISvgPoint): boolean { return point && point.code === 'Q' || point && point.code === 'q'; }
  protected isArc(point: ISvgPoint): boolean { return point && point.code === 'A' || point && point.code === 'a'; }

}
