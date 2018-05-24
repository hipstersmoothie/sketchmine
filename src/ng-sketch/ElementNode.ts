import { IBounding } from "./sketchJSON/interfaces/Base";
import { ShapeGroup } from "./sketchJSON/models/ShapeGroup";
import { Style } from "./sketchJSON/models/Style";
import { IStyle } from "./sketchJSON/interfaces/Style";
import { IShapeGroup } from "./sketchJSON/interfaces/ShapeGroup";
import { Rectangle } from "./sketchJSON/models/Rectangle";
import { parseBorderRadius, BoundingClientRectToBounding } from "./sketchJSON/helpers/util";
import { IRectangle, IRectangleOptions } from "./sketchJSON/interfaces/Rectangle";
import { Group } from "./sketchJSON/models/Group";
import { IGroup } from "./sketchJSON/interfaces/Group";
import { ITraversedDomElement } from "./TraversedDom";

export class ElementNode {

  private _element: ITraversedDomElement;
  private _layers = [];

  get layers(): IGroup[] { return this._layers; }

  constructor(element: ITraversedDomElement) {
    this._element = element;

    if (this._element.tagName === 'IMG' || 
        this._element.tagName === 'SVG') {
      console.log('🚫 🖼 Images are currently not supported!');
    }
    
    const group = new Group(this.getSize());
    group.name = element.tagName.toLowerCase();
    const shapeGroup = new ShapeGroup(this.getSize());
    shapeGroup.style = this.addStyles();

    shapeGroup.addLayer(this.addshape());

    console.log(shapeGroup);
    group.addLayer(shapeGroup.generateObject())
    this._layers.push(group.generateObject());
  }

  private addshape(): IRectangle {
    const options: IRectangleOptions = {
      width: this._element.boundingClientRect.width,
      height: this._element.boundingClientRect.height,
      cornerRadius: 3
    }
    const rectangle = new Rectangle(options);
    rectangle.name = 'Background';
    return rectangle.generateObject();
  }

  private addStyles(): IStyle {
    const style = new Style();
    const cs = this._element.styles;
    console.log(this._element.styles)

    if(!cs) {
      return;
    }

    if (cs.backgroundColor) {
      style.addColorFill(cs.backgroundColor);
    }

    if (cs.borderWidth) {
      style.addBorder(cs.borderColor, parseInt(cs.borderWidth, 10));
    }

    if (parseInt(cs.opacity, 10) < 1) {
      style.opacity = cs.opacity;
    }

    return style.generateObject();
  }

  private getSize(): IBounding {
    return BoundingClientRectToBounding(this._element.boundingClientRect);
  }
}
