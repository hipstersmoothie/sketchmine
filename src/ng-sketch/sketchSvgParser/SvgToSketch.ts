import { ISvgPointGroup, ISvg } from './interfaces/ISvg';
import { IShapeGroup } from './interfaces/ShapeGroup';
import { ShapeGroup } from './models/ShapeGroup';
import { IBounding } from '../sketchJSON/interfaces/Base';
import { SvgPointsToSketch } from './SvgPointsToSketch';
import { Style } from '../sketchJSON/models/Style';
import { IStyle } from '../sketchJSON/interfaces/Style';

export class SvgToSketch {

  constructor(private _svgObject: ISvg) { }

  generateObject(): any[] {

    const size: IBounding = { ...this._svgObject.size, x: 0, y: 0 };
    const shapeGroupLayers = [];
    const groupLayers = [];

    this._svgObject.shapes.forEach((shape) => {
      // if the paths/rects or Elements have different styles like varying fills
      // it is not possible to group them so we need a own shape group for each fill/style
      if (this.hasDifferentStyles()) {
        const shapeGroup = new ShapeGroup(size);
        shapeGroup.addLayer(SvgPointsToSketch.parse(shape, size));
        shapeGroup.name = 'SVG';
        shapeGroup.style = addSvgShapeStyle(shape);
        groupLayers.push(shapeGroup.generateObject());
        return;
      }
      shapeGroupLayers.push(SvgPointsToSketch.parse(shape, size));
    });

    if (!this.hasDifferentStyles()) {
      const shapeGroup = new ShapeGroup(size);
      shapeGroup.name = 'SVG';
      shapeGroup.layers = shapeGroupLayers;
      groupLayers.push(shapeGroup.generateObject());
    }

    // console.log(groupLayers);
    return groupLayers;
  }

  /**
   * Checks if some styles are set on the svg shapes
   */
  private hasDifferentStyles(): boolean {
    return !this._svgObject.shapes.every(shape => shape.style.size === 0);
  }
}

function addSvgShapeStyle(shape: ISvgPointGroup): IStyle {
  const _s = shape.style;
  const style = new Style();

  const fill = _s.get('fill');
  if (fill && fill !== 'inherit') {
    style.addColorFill(fill, parseInt(_s.get('fillOpacity'), 10) || 1);
  }
  if (_s.get('stroke')) {
    style.addBorder(_s.get('stroke'), parseInt(_s.get('strokeWidth'), 10));
  }
  return style.generateObject();
}
