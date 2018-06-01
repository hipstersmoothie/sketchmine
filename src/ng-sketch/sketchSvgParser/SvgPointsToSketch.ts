import { MoveTo } from './models/MoveTo';
import { ISvgPoint } from './interfaces/ISvg';
import { LineTo } from './models/LineTo';
import { CurveTo } from './models/CurveTo';
import { ShapePath } from './models/ShapePath';
import { IBounding } from '../sketchJSON/interfaces/Base';
import { QuadraticCurveTo } from './models/QuadraticCurveTo';

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
      const prev = this.getPrevCurvePoint(i);
      const next = this.getNextCurvePoint(i);

      switch (cur.code) {
        case 'M':
          shapePath.addPoint(new MoveTo(prev, cur, next).generate());
          break;
        case 'S':  
        case 'C':
          shapePath.addPoint(new CurveTo(prev, cur, next).generate());
          break;
        case 'Q':
          shapePath.addPoint(new QuadraticCurveTo(prev, cur, next).generate());
          break;
        case 'L':
          shapePath.addPoint(new LineTo(prev, cur, next).generate());
          break;
        case 'H':
          shapePath.addPoint(new LineTo(prev, cur, next).generate());
          break;
        case 'V':
          shapePath.addPoint(new LineTo(prev, cur, next).generate());
          break;
        case 'Z':
          shapePath.close();
          break;
        default:
          console.log(`The SVG command: "${cur.code}" is not implemented yet! Sorry 🙁\n`);
          // console.log(JSON.stringify);
      }

      // console.log(JSON.stringify(shapePath.points[i], null, 2))
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
