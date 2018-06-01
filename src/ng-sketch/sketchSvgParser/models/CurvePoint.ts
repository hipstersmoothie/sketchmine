import { CurvePointMode } from '../../sketchJSON/helpers/sketchConstants';
import { ISvgPoint, IPoint } from '../interfaces/ISvg';
import { ICurvePoint } from '../interfaces/ICurvePoint';
import { round } from '../../sketchJSON/helpers/util';

export class CurvePoint {

  constructor(
    private _curP: ISvgPoint,
    private _nextP: ISvgPoint
  ) { }

  get cur(): ISvgPoint { return this._curP; }
  get next(): ISvgPoint { return this._nextP; }

  protected isMoveTo(point: ISvgPoint): boolean { return point && point.code === 'M' || point && point.code === 'm'; }
  protected isLineTo(point: ISvgPoint): boolean { return point && point.code === 'L' || point && point.code === 'l'; }
  protected isCurveTo(point: ISvgPoint): boolean { return point && point.code === 'C' || point && point.code === 'c'; }
  protected isSmoothCurveTo(point: ISvgPoint): boolean { return point && point.code === 'S' || point && point.code === 's'; }
  protected isQuadratic(point: ISvgPoint): boolean { return point && point.code === 'Q' || point && point.code === 'q'; }
  protected isArc(point: ISvgPoint): boolean { return point && point.code === 'A' || point && point.code === 'a'; }

  /**
   * Reflects a Point through another Point 
   * used to calc the Smoothcurve tangent from the previeous 2. Control point
   * reflect through the startPoint
   * -> Note should have different curve mode (2. for mirrored)
   * returns the mirrored Point
   * 
   * @param point IPoint
   * @param reflectPoint ISvgPoint
   * @returns ISvgPoint
   */
  protected reflectTrough(point: IPoint, reflectPoint: IPoint) {
    const dx = reflectPoint.x - point.x;
    const dy = reflectPoint.y - point.y;

    const x = dx + reflectPoint.x;
    const y = dy + reflectPoint.y;
    return {x,y};
  }

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
