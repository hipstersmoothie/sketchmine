import { ICurvePoint } from '../interfaces/curve-point.interface';
import { Base } from '../../sketchJSON/models/base';
import { BooleanOperation } from '../../sketchJSON/helpers/sketch-constants';
import { IBase } from '../../sketchJSON/interfaces/base.interface';

export class ShapePath extends Base {

  private _points: ICurvePoint[] = [];
  private _closed: boolean = false;
  private _booleanOperation: number = BooleanOperation.None;

  set booleanOperation(op: number) { this._booleanOperation = op; }
  get points(): ICurvePoint[] { return this._points; }
  close() { this._closed = true; }

  constructor() {
    super();
    super.class = 'shapePath';
  }

  addPoint(point: ICurvePoint) {
    this._points.push(point);
  }

  generateObject(): any {
    const base: IBase = super.generateObject();

    return {
      ...base,
      frame: super.addFrame('rect'),
      booleanOperation: this._booleanOperation, // Union, Substract, Difference Layers
      edited: true,
      isClosed: this._closed,
      pointRadiusBehaviour: 1,
      points: this._points,
    };
  }
}
