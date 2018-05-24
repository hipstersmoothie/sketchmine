import { IBounding } from "./sketchJSON/interfaces/Base";
import { ShapeGroup } from "./sketchJSON/models/ShapeGroup";
import { Style } from "./sketchJSON/models/Style";
import { IStyle } from "./sketchJSON/interfaces/Style";
import { IShapeGroup } from "./sketchJSON/interfaces/ShapeGroup";
import { Rectangle } from "./sketchJSON/models/Rectangle";
import { parseBorderRadius } from "./sketchJSON/helpers/util";
import { IRectangle, IRectangleOptions } from "./sketchJSON/interfaces/Rectangle";
import { Group } from "./sketchJSON/models/Group";
import { IGroup } from "./sketchJSON/interfaces/Group";

export class ElementNode {

  private _element: IElement;
  private _layers = [];

  get layers(): IGroup[] { return this._layers; }

  constructor(element: IElement) {
    this._element = element;

    if (this._element.tagName === 'IMG' || 
        this._element.tagName === 'SVG') {
      console.log('🚫 🖼 Images are currently not supported!');
    }
    
    const group = new Group(this.getBounding());
    group.name = element.name;
    const shapeGroup = new ShapeGroup(this.getBounding());
    shapeGroup.style = this.addStyles();

    shapeGroup.addLayer(this.addshape());
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
    const cs = this._element.style;
    console.log(this._element.style)

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

  private getBounding(): IBounding {
    const rect: ClientRect | DOMRect = this._element.boundingClientRect;

    return {
      width: rect.right - rect.left,
      height: rect.bottom - rect.top,
      y: rect.top,
      x: rect.left,
    }
  }
}
