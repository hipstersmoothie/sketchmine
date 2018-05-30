import { CurvePointMode } from '../../sketchJSON/helpers/sketchConstants';
import { ISvgPoint, IPoint } from '../interfaces/ISvg';
import { ICurvePoint } from '../interfaces/ICurvePoint';
import { round } from '../../sketchJSON/helpers/util';

export class CurvePoint {

  constructor(
    private _lastP: ISvgPoint,
    private _curP: ISvgPoint,
    private _nextP: ISvgPoint
  ) {
  }

  get last(): ISvgPoint { return this._lastP; }
  get cur(): ISvgPoint { return this._curP; }
  get next(): ISvgPoint { return this._nextP; }

  protected isMoveTo(point: ISvgPoint): boolean { return point && point.code === 'M' || point && point.code === 'm'; }
  protected isLineTo(point: ISvgPoint): boolean { return point && point.code === 'L' || point && point.code === 'l'; }
  protected isCurveTo(point: ISvgPoint): boolean { return point && point.code === 'C' || point && point.code === 'c'; }
  protected isQuadratic(point: ISvgPoint): boolean { return point && point.code === 'Q' || point && point.code === 'q'; }
  protected isArc(point: ISvgPoint): boolean { return point && point.code === 'A' || point && point.code === 'a'; }

  protected pointEqalsPoint(point1: IPoint, point2: IPoint) {
    const x1 = round(point1.x);
    const y1 = round(point1.y);
    const x2 = round(point2.x);
    const y2 = round(point2.y);

    if (x1 == x2 && y1 == y2) {
      return true;
    }
    return false;
  }
}
