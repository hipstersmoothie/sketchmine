import { ISvgPointGroup, ISvg } from './interfaces/ISvg';
import { IShapeGroup } from './interfaces/ShapeGroup';
import { ShapeGroup } from './models/ShapeGroup';

export class SvgToSketch {
  
  constructor(private _svgObject: ISvg) {

  }



  // generateObject(): IShapeGroup {
  //   return new ShapeGroup({...this._svgObject.size, x: 0, y: 0 })
  // }
}

// for(let i = 0, max = this._paths.length-1; i <= max; i++) {
//   const path = this._paths[i];
//   // only one Path no need for ShapeGroup
//   if (max === 0) {

//   } else {
//     const size: IBounding = { width: this._width, height: this._height, x: 0, y: 0 };
//     const shapegroup = new ShapeGroup(size);
//   }
// }

// private toSketch() {
//   this._paths.forEach(path => {
//     const resized = this.resizeCoordinates(path);
//     SvgPointsToSketch.parse(resized);
//   })
// }
