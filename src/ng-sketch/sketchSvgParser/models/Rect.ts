import { IPoint, ISvgPoint } from '../interfaces/svg.interface';
import { Point } from './point';

/**
 * Converts a rect in 4 Lines
 *
 * @param width number
 * @param height number
 * @param x number
 * @param y number
 * @returns ISvgPoint[]
 * @example
 * 	<rect width="1" height="2" x="0" fill="#008d46" />
 */
export class Rect {

  constructor(
    private _width: number,
    private _height: number,
    private _x: number,
    private _y: number,
  ) { }

  generate(): ISvgPoint[] {

    const moveTo = new Point('M', { x: 0, y: 0 });

    const c1 = new Point('L', { x: this._width, y: 0 });
    const c2 = new Point('L', { x: this._width, y: this._height });
    const c3 = new Point('L', { x: 0, y: this._height });
    const close = new Point('Z');

    const offsetX = (!isNaN(this._x)) ? this._x : 0;
    const offsetY = (!isNaN(this._y)) ? this._y : 0;

    moveTo.addOffset(offsetX, offsetY);
    c1.addOffset(offsetX, offsetY);
    c2.addOffset(offsetX, offsetY);
    c3.addOffset(offsetX, offsetY);

    return([
      moveTo.generate(),
      c1.generate(),
      c2.generate(),
      c3.generate(),
      // c4.generate(),
      close.generate(),
    ]);
  }
}
