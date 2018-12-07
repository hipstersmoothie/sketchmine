import { Base } from './base';
import { IBounding, SketchObjectTypes, SketchCurvePoint, SketchRectangle, SketchBase } from '../interfaces';
import { CurvePoint } from './curve-point';
import { CurvePointMode, BooleanOperation } from '../helpers';

export class Rectangle extends Base {

  cornerRadius: number[];
  constructor(bounding: IBounding, cornerRadius: number | number[]) {
    super(bounding);
    super.className = SketchObjectTypes.Rectangle;
    this.cornerRadius = convertBorderRadiusToArray(cornerRadius); // topLeft, topRight, bottomRight, bottomLeft
  }

  private addRectanglePoints(): SketchCurvePoint[] {
    const points: SketchCurvePoint[] = [];
    for (let i = 0, max = 4; i < max; i += 1) {
      let point = { x: 0, y: 0 };
      switch (i) {
        case 1:
          point = { x: 1, y: 0 }; break;
        case 2:
          point = { x: 1, y: 1 }; break;
        case 3:
          point = { x: 0, y: 1 }; break;
      }
      const curvePoint = new CurvePoint(point, point, point);
      curvePoint.curveMode = CurvePointMode.Straight;
      curvePoint.radius = this.cornerRadius[i];
      points.push(curvePoint.generateObject());
    }
    return points;
  }

  generateObject(): SketchRectangle {
    const base: SketchBase = super.generateObject();

    return {
      ...base,
      booleanOperation: BooleanOperation.None,
      edited: false,
      fixedRadius: 0,
      frame: super.addFrame(),
      hasConvertedToNewRoundCorners: true,
      isClosed: true,
      pointRadiusBehaviour: 0,
      points: this.addRectanglePoints(),
    };
  }
}

/**
 * Converts border radius to safe array of numbers
 * @param radius number for all radii or array of [topLeft, topRight, bottomRight, bottomLeft]
 */
export function convertBorderRadiusToArray(radius: number | number[]): number[] {
  if (!radius) {
    return [0, 0, 0, 0];
  }

  if (typeof radius === 'number') {
    return [radius, radius, radius, radius];
  }
  return radius;
}
