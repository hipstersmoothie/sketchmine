import { Base } from './base';
import { BooleanOperation } from '../helpers/sketch-constants';
import { SketchBase, SketchObjectTypes, SketchCurvePoint, SketchShapePath, IBounding } from '../interfaces';

export class ShapePath extends Base {

  points: SketchCurvePoint[] = [];
  booleanOperation: BooleanOperation = BooleanOperation.None;
  private _closed: boolean = false;

  constructor(bounding: IBounding) {
    super(bounding);
    super.className = SketchObjectTypes.ShapePath;
  }

  close() {
    this._closed = true;
  }

  addPoint(point: SketchCurvePoint) {
    this.points.push(point);
  }

  generateObject(): SketchShapePath {
    const base: SketchBase = super.generateObject();

    return {
      ...base,
      frame: super.addFrame(),
      booleanOperation: this.booleanOperation, // Union, Substract, Difference Layers
      edited: true,
      isClosed: this._closed,
      pointRadiusBehaviour: 1,
      points: this.points,
    };
  }
}
