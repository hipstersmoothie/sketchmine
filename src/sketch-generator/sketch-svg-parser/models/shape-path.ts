import { Base } from '@sketch-draw/models/base';
import { BooleanOperation } from '@sketch-draw/helpers/sketch-constants';
import { SketchBase, SketchObjectTypes, SketchCurvePoint, IBounding } from '@sketch-draw/interfaces';
import { SketchShapePath } from '@sketch-draw/interfaces/shape-path.interface';

export class ShapePath extends Base {

  points: SketchCurvePoint[] = [];
  private _closed: boolean = false;
  private _booleanOperation: number = BooleanOperation.None;

  set booleanOperation(op: number) { this._booleanOperation = op; }
  close() { this._closed = true; }

  constructor(bounding: IBounding) {
    super(bounding);
    super.className = SketchObjectTypes.ShapePath;
  }

  addPoint(point: SketchCurvePoint) {
    this.points.push(point);
  }

  generateObject(): SketchShapePath {
    const base: SketchBase = super.generateObject();

    return {
      ...base,
      frame: super.addFrame(),
      booleanOperation: this._booleanOperation, // Union, Substract, Difference Layers
      edited: true,
      isClosed: this._closed,
      pointRadiusBehaviour: 1,
      points: this.points,
    };
  }
}
