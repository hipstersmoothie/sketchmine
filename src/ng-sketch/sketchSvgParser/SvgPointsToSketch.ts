import { ISvgPoint } from './interfaces/ISvgPoint';
import { CurvePoint } from './models/CurvePoint';
import { ICurvePoint } from './interfaces/ICurvePoint';
import { LineTo } from './models/LineTo';
import { CurveTo } from './models/CurveTo';
import { ShapePath } from './ShapePath';

export class SvgPointsToSketch {
  static parse(points: ISvgPoint[]) {
    return new SvgPointsToSketch(points).trace();
  }

  private _offsetX: number;
  private _offsetY: number;

  constructor(private _points: ISvgPoint[]) {
    // Todo: provide offset later
    this._offsetX = 0;
		this._offsetY = 0;
  }
  private trace() {
    const group  = [];
    let shapePath: ShapePath = null;
    console.log(this._points)

    for(let i = 0, end = this._points.length; i < end; i++) {
      const cur = this._points[i];
      const prev = this.getPrevCurvePoint(i);
      const next = this.getNextCurvePoint(i);

      switch (cur.code) {
        case 'M':
          // If new Shape beginns without closing the last
          if (shapePath !== null) {
            group.push(shapePath.generateObject());
            shapePath = null;
          }
          shapePath = new ShapePath(); 
          break;
        case 'C':
          shapePath.addPoint(new CurveTo(prev, cur, next).generate());
          break;
        case 'Z':
          shapePath.close();
          group.push(shapePath.generateObject());
          shapePath = null;
          break;
      }

      // Path is not closed with a Z command so return it
      if (i === end && shapePath !== null) {
        group.push(shapePath.generateObject());
        shapePath = null;
      }
    }
    return group;
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
