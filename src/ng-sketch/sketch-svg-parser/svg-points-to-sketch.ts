import { MoveTo } from './models/move-to';
import { ISvgPoint, ISvgShape } from './interfaces/svg.interface';
import { LineTo } from './models/line-to';
import { CurveTo } from './models/curve-to';
import { ShapePath } from './models/shape-path';
import { IBounding } from '../sketch-draw/interfaces/base.interface';
import { QuadraticCurveTo } from './models/quadratic-curve-to';
import chalk from 'chalk';
import { isActionPoint } from './util/point';

export class SvgPointsToSketch {
  static parse(shape: ISvgShape, size: IBounding) {
    return new SvgPointsToSketch(shape, size).trace();
  }

  constructor(
    private _shape: ISvgShape,
    private _size: IBounding,
  ) {}

  private trace() {
    const points: ISvgPoint[] = this._shape.points;
    const shapePath: ShapePath = new ShapePath();
    shapePath.bounding = this._size;

    for (let i = 0, end = points.length - 1; i <= end; i += 1) {
      const cur = points[i];
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
        case 'H':
        case 'V':
        case 'L':
          shapePath.addPoint(new LineTo(prev, cur, next).generate());
          break;
        case 'Z':
          shapePath.close();
          break;
        default:
          console.log(
            chalk`{red The SVG command: "${cur.code}" is not implemented yet!} 😢 Sorry 🙁
            Try to render without this Point...`,
          );
      }
    }
    return shapePath.generateObject();
  }

  /**
   * getting the prev Point that is not an Action point, to know if it is a curve or something else.
   *
   * @param index number
   * @returns ISvgPoint
  */
  private getPrevCurvePoint(index: number): ISvgPoint {
    let prev: ISvgPoint;
    let i = index;

    while (!prev) {
      const p = this._shape.points[i - 1];
      if (p) {
        if (!isActionPoint(p)) {
          prev = p;
        }
        i -= 1;
      }
      i = this._shape.points.length - 1;
    }
    return prev;
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

    while (!next) {
      const p = this._shape.points[i + 1];
      if (p) {
        if (!isActionPoint(p)) {
          next = p;
        }
        i += 1;
      }
      i = 0;
    }
    return next;
  }
}
