import { MoveTo } from './models/MoveTo';
import { ISvgPoint, ISvg } from './interfaces/ISvg';
import { LineTo } from './models/LineTo';
import { CurveTo } from './models/CurveTo';
import { ShapePath } from './models/ShapePath';
import { IBounding } from '../sketchJSON/interfaces/Base';
import { QuadraticCurveTo } from './models/QuadraticCurveTo';
import chalk from 'chalk';

export class SvgPointsToSketch {
  static parse(points: ISvgPoint[], size: IBounding) {
    return new SvgPointsToSketch(points, size).trace();
  }

  constructor(
    private _points: ISvgPoint[], 
    private _size: IBounding
  ) {}

  private trace() {
    const shapePath: ShapePath = new ShapePath();
    shapePath.bounding = this._size;

    for(let i = 0, end = this._points.length-1; i <= end; i++) {
      const cur = this._points[i];
      const next = this.getNextCurvePoint(i);

      switch (cur.code) {
        case 'M':
          shapePath.addPoint(new MoveTo(cur, next).generate());
          break;
        case 'S':  
        case 'C':
          shapePath.addPoint(new CurveTo(cur, next).generate());
          break;
        case 'Q':
          shapePath.addPoint(new QuadraticCurveTo(cur, next).generate());
          break;
        case 'H':
        case 'V':
        case 'L':
          shapePath.addPoint(new LineTo(cur, next).generate());
          break;
        case 'Z':
          shapePath.close();
          break;
        default:
          console.log(chalk`{red The SVG command: "${cur.code}" is not implemented yet!} 😢 Sorry 🙁 \nTry to render without this Point...`);
      }
    }
    return shapePath.generateObject();
  }

  private isActionPoint(point: ISvgPoint): boolean {
    return ['M', 'm', 'z', 'Z'].includes(point.code);
  }

  /** 
   * getting the next Point that is not an Action point, to know if it is a curve or something else.
   * 
   * @param index number
   * @returns ISvgPoint
  */
  private getNextCurvePoint(index: number): ISvgPoint {
    let next: ISvgPoint;

    while(!next) {
      const p = this._points[index+1];
      if (p) {
        if (!this.isActionPoint(p)) {
          next = p;
        }
        index ++;
      }
      index = 0;
    }
    return next;
  }
}
