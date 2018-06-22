import { ISvgPoint } from '../interfaces/svg.interface';
import { Point } from './point';

/**
 * Converts a circle in 4 anchorpoints to render them in Sketch
 *
 * @param cx number
 * @param cy number
 * @param radius number
 * @returns ISvgPoint[]
 * @description https://stackoverflow.com/questions/1734745/how-to-create-circle-with-b%C3%A9zier-curves
 * @example
 * <circle fill="inherit" cx="256" cy="256.00006" r="44.00003"></circle>
 */
export class Circle {

  private static BEZIER_CONTROL_POINT = (4 / 3) * Math.tan(Math.PI / 8);

  constructor(
    private _cx: number,
    private _cy: number,
    private _r: number,
  ) { }

  generate(): ISvgPoint[] {
    const offsetX = this._cx - this._r;
    const offsetY = this._cy - this._r;
    const dimension =  this._r * 2;
    const start = 0;
    const halfDimension = this._r;
    const controlPointOffset = halfDimension * Circle.BEZIER_CONTROL_POINT;

    const moveTo = new Point('M', { x: start, y: halfDimension });

    // curve to Top Middle
    const c1 = new Point(
      'C',
      { x: halfDimension, y: start },
      { x: start, y: halfDimension - controlPointOffset },
      { x: halfDimension - controlPointOffset, y: start },
    );

    // curve to Middle Right
    const c2 = new Point(
      'C',
      { x: dimension, y: halfDimension },
      { x: halfDimension + controlPointOffset, y: start },
      { x: dimension, y: halfDimension - controlPointOffset },
    );

    // curve to Bottom Middle
    const c3 = new Point(
      'C',
      { x: halfDimension, y: dimension },
      { x: dimension, y: halfDimension + controlPointOffset },
      { x: halfDimension + controlPointOffset, y: dimension },
    );

    // curve back to Middle Left
    const c4 = new Point(
      'C',
      { x: start, y: halfDimension },
      { x: halfDimension - controlPointOffset, y: dimension },
      { x: start, y: halfDimension + controlPointOffset },
    );

    const close = new Point('Z');

    moveTo.addOffset(offsetX, offsetY);
    c1.addOffset(offsetX, offsetY);
    c2.addOffset(offsetX, offsetY);
    c3.addOffset(offsetX, offsetY);
    c4.addOffset(offsetX, offsetY);

    return([
      moveTo.generate(),
      c1.generate(),
      c2.generate(),
      c3.generate(),
      c4.generate(),
      close.generate(),
    ]);
  }
}
