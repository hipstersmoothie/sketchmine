import { IBounding, ShapePath } from '@sketchmine/sketch-file-format';
import { Logger } from '@sketchmine/node-helpers';
import { CurveTo } from './models/curve-to';
import { isActionPoint } from './util/point';
import { ISvgPoint, ISvgShape } from './interfaces';
import { LineTo } from './models/line-to';
import { MoveTo } from './models/move-to';
import { QuadraticCurveTo } from './models/quadratic-curve-to';
import chalk from 'chalk';

const log = new Logger();

export class SvgPointsToSketch {
  static parse(shape: ISvgShape, size: IBounding) {
    return new SvgPointsToSketch(shape, size).trace();
  }

  constructor(private _shape: ISvgShape, private _size: IBounding) {}

  private trace() {
    const points: ISvgPoint[] = this._shape.points;
    const shapePath: ShapePath = new ShapePath(this._size);
    shapePath.bounding = this._size;

    if (points.length === 1) {
      log.error('The SVG Shape has only one Point!');
      return shapePath.generateObject();
    }

    for (let i = 0, end = points.length - 1; i <= end; i += 1) {
      const cur = points[i];
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
          log.error(
            chalk`{red The SVG command: "${cur.code}" is not implemented yet!} 😢 Sorry 🙁
            Try to render without this Point...`,
          );
      }
    }
    return shapePath.generateObject();
  }

  /**
   * getting the next Point that is not an Action point, to know if it is a curve or something else.
   *
   * @param index number
   * @returns ISvgPoint
  */
  private getNextCurvePoint(index: number): ISvgPoint {
    let next: ISvgPoint;
    let i = index;
    let runs = 0; // to prevent endless loops

    while (!next && runs < 2) {
      const p = this._shape.points[i + 1];
      if (p) {
        /**
         * in second run through points the last point can be an action point
         * this can occure when the points array only consists out of action points like
         * [M (moveto), Z (closepath)]
         * [M (moveto)
         * [Z (closepath)]
         */
        if (!isActionPoint(p) || runs > 0) {
          next = p;
        }
        i += 1;
      }
      i = 0;
      runs += 1;
    }
    return next;
  }
}
