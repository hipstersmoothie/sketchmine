import { ISvgPoint } from './interfaces/ISvgPoint';
import { CurvePoint } from './models/CurvePoint';
import { ICurvePoint } from './interfaces/ICurvePoint';
import { MoveTo } from './models/MoveTo';
import { LineTo } from './models/LineTo';
import { CurveTo } from './models/CurveTo';

export class SvgPointsToSketch {
  static parse(points: ISvgPoint[]) {
    return new SvgPointsToSketch(points);
  }

  private _offsetX: number;
  private _offsetY: number;

  constructor(private _points: ISvgPoint[]) {
    // Todo: provide offset later
    this._offsetX = 0;
		this._offsetY = 0;
    this.trace();
  }
  private trace() {
    const points: ICurvePoint[] = [];

    for(let i = 0, end = this._points.length; i < end; i++) {
      const cur = this._points[i];
      const prev = this.getPrevCurvePoint(i);
      const next = this.getNextCurvePoint(i);
      
      switch (cur.code) {
        case 'M':
          // points.push(new MoveTo(prev, cur, next).addPoint()); 
          break;
        case 'L':
          points.push(new LineTo(prev, cur, next).addPoint());
          break;
        case 'V':break;
        case 'H':break;
        case 'Q':break;
        case 'C':
          points.push(new CurveTo(prev, cur, next).addPoint());
          break;
        case 'Z':break;
      }
    }

    console.log(points);
  }
  private getPrevCurvePoint(index: number) {
    const prev = this._points[index-1];
    if (prev) {
      return prev;
    }
    return null;
  }
  private getNextCurvePoint(index: number): ISvgPoint {
    const next = this._points[index+1];
    if (next) {
      return next;
    }
    return null;
  }
}
