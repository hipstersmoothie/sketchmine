import { IPoint, ISvgPoint } from '@sketch-svg-parser/interfaces';

export class Point {

  static COMMAND_LIST = {
    M: 'moveto',
    L: 'lineto',
    V: 'vertical lineto',
    H: 'horizontal lineto',
    C: 'curveto',
    S: 'smooth curveto',
    Q: 'quadratic curveto',
    T: 'smooth quadratic curveto',
    A: 'elliptical arc',
    Z: 'closepath',
  };

  constructor(
    private _code: string,
    private _point?: IPoint,
    private _c1?: IPoint,
    private _c2?: IPoint,
    private _last?: IPoint,
  ) {}

  addOffset(x: number, y: number) {
    if (this._point) {
      this._point.x += x;
      this._point.y += y;
    }

    if (this._c1) {
      this._c1.x += x;
      this._c1.y += y;
    }

    if (this._c2) {
      this._c2.x += x;
      this._c2.y += y;
    }

    if (this._last) {
      this._last.x += x;
      this._last.y += y;
    }
  }

  generate(): ISvgPoint {
    const code = this._code.toUpperCase();
    const point = {
      code,
      command: Point.COMMAND_LIST[code],
      relative: false,
    } as ISvgPoint;

    if (this._point) {
      point.x = this._point.x;
      point.y = this._point.y;
    }

    if (this._c1) {
      point.x1 = this._c1.x;
      point.y1 = this._c1.y;
    }

    if (this._c2) {
      point.x2 = this._c2.x;
      point.y2 = this._c2.y;
    }

    if (this._last) {
      point.x0 = this._last.x;
      point.y0 = this._last.y;
    }

    return point;
  }

}
