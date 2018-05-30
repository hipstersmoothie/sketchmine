import { MoveTo } from './models/MoveTo';
import { ISvgPoint } from './interfaces/ISvgPoint';
import { LineTo } from './models/LineTo';
import { CurveTo } from './models/CurveTo';
import { ShapePath } from './models/ShapePath';

export class SvgPointsToSketch {
  static parse(points: ISvgPoint[]) {
    return new SvgPointsToSketch(points).trace();
  }

  constructor(private _points: ISvgPoint[]) {}

  private trace() {
    const shapePath: ShapePath = new ShapePath();

    for(let i = 0, end = this._points.length-1; i <= end; i++) {
      const cur = this._points[i];
      const prev = this.getPrevCurvePoint(i);
      const next = this.getNextCurvePoint(i);

      switch (cur.code) {
        case 'M':
          shapePath.addPoint(new MoveTo(prev, cur, next).generate());
          break;
        case 'C':
          shapePath.addPoint(new CurveTo(prev, cur, next).generate());
          break;
        case 'L':
          shapePath.addPoint(new LineTo(prev, cur, next).generate());
          break;
        case 'Z':
          shapePath.close();
          break;
      }
    }
    return shapePath.generateObject();
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
