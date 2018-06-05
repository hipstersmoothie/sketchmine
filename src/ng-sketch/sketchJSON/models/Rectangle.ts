import { Base } from './Base';
import { IPath, IPoint, IRectangleOptions, IRectangle } from '../interfaces/Rectangle';
import { ICurvePoint } from '../../sketchSvgParser/interfaces/ICurvePoint';
import { IBounding, IBase } from '../interfaces/Base';

export class Rectangle extends Base {
  private _cornerRadius: number[];
  private _width: number;
  private _height: number;

  constructor(options: IRectangleOptions) {
    super();
    super.class = 'rectangle';
    this._cornerRadius = this.convertRadius(options.cornerRadius); // topLeft, topRight, bottomRight, bottomLeft
    super.bounding =  {
      height: options.height,
      width: options.width,
      x: 0,
      y: 0,
    } as IBounding;
  }

  private convertRadius(radius: number | number[]): number[] {
    if (!radius) {
      return [0, 0, 0, 0];
    }

    if (typeof radius === 'number') {
      return [radius, radius, radius, radius];
    }
    return radius;
  }

  private addPath(): IPath {
    return {
      _class: 'path',
      isClosed: true,
      pointRadiusBehaviour: 1,
      points: this.curvePoints(),
    };
  }

  private curvePoints(): ICurvePoint[] {
    const points: ICurvePoint[] = [];
    for (let i = 0, max = 4; i < 4; i += 1) {
      let point = { x: 0, y: 0 };
      switch (i) {
        case 1:
          point = { x: 1, y: 0 }; break;
        case 2:
          point = { x: 1, y: 1 }; break;
        case 3:
          point = { x: 0, y: 1 }; break;
      }
      points.push(this.curvePoint(point, this._cornerRadius[i]));
    }
    return points;
  }

  private curvePoint(point: IPoint, radius: number): ICurvePoint {
    return {
      _class: 'curvePoint',
      cornerRadius: radius || 0,
      curveFrom: `{${point.x}, ${point.y}}`,
      curveMode: 1,
      curveTo: `{${point.x}, ${point.y}}`,
      hasCurveFrom: false,
      hasCurveTo: false,
      point: `{${point.x}, ${point.y}}`,
    };
  }

  generateObject(): IRectangle {
    const base: IBase = super.generateObject();

    return {
      ...base,
      points: this.curvePoints(),
      path: this.addPath(),
      frame: super.addFrame('rect'),
      edited: false,
      booleanOperation: -1,
      isClosed: true,
      pointRadiusBehaviour: 0,
      fixedRadius: 0,
      hasConvertedToNewRoundCorners: true,
    } as any;
  }
}
