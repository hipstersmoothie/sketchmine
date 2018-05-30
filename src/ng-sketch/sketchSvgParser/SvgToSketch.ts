import { ISvgPointGroup, ISvg } from './interfaces/ISvg';
import { IShapeGroup } from './interfaces/ShapeGroup';
import { ShapeGroup } from './models/ShapeGroup';
import { IBounding } from '../sketchJSON/interfaces/Base';
import { SvgPointsToSketch } from './SvgPointsToSketch';

export class SvgToSketch {
  
  constructor(private _svgObject: ISvg) { }

  generateObject(): any[] {
    const size: IBounding = {... this._svgObject.size, x: 0, y: 0};
    const shapeGroupLayers = [];

    this._svgObject.shapes.forEach(shape => {
      shapeGroupLayers.push(SvgPointsToSketch.parse(shape.points));
    })
    
    return shapeGroupLayers;
  }
}
