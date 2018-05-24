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
import { ITraversedDomElement, ITraversedDomTextNode } from "./TraversedDom";

export class ElementNode {

  private _element: ITraversedDomElement;
  private _layers = [];

  get layers(): IGroup[] { return this._layers; }

  constructor(element: ITraversedDomElement | ITraversedDomTextNode) {
    if(element.tagName === 'TEXT') {
      console.log('🚫 📖 Text is currently not supported!');
      return;
    }
    if (element.tagName === 'IMG' || 
        element.tagName === 'SVG') {
      console.log('🚫 🖼 Images are currently not supported!');
      return;
    }

    this._element = element as ITraversedDomElement;
    this.generate();
  }

  private generate() {
    const group = new Group(this.getSize());
    const shapeGroup = new ShapeGroup({...this.getSize(), x:0, y:0 });

    group.name = this._element.className || this._element.tagName.toLowerCase();
    shapeGroup.name = 'Background';
    shapeGroup.style = this.addStyles();
    shapeGroup.addLayer(this.addshape());
    group.addLayer(shapeGroup.generateObject())

    if (this._element.children && this._element.children.length > 0) {
      this._element.children.reverse().forEach(child => {
        const childNode = new ElementNode(child);
        const layers = childNode.layers
        if (layers.length > 0) {
          group.addLayer(layers);
        }
      })
    }

    console.log(group.generateObject().frame)

    this._layers.push(group.generateObject());
  }

  private addshape(): IRectangle {

    const options: IRectangleOptions = {
      width: this._element.boundingClientRect.width,
      height: this._element.boundingClientRect.height,
      cornerRadius: parseInt(this._element.styles.borderRadius),
    }
    const rectangle = new Rectangle(options);
    return rectangle.generateObject();
  }

  private addStyles(): IStyle {
    const style = new Style();
    const cs = this._element.styles;

    if(!cs) {
      return;
    }

    if (cs.backgroundColor) { style.addColorFill(cs.backgroundColor); }
    if (cs.borderWidth) { style.addBorder(cs.borderColor, parseInt(cs.borderWidth, 10)); }
    if (parseInt(cs.opacity, 10) < 1) { style.opacity = cs.opacity; }

    return style.generateObject();
  }

  private getSize(): IBounding {
    const parentBCR = this._element.parentRect;
    const bcr = this._element.boundingClientRect;

    if(Object.keys(parentBCR).length > 0) {
      const x = bcr.x - parentBCR.x;
      const y = bcr.y - parentBCR.y;
      return { 
        height: Math.round(bcr.height), 
        width: Math.round(bcr.width),
        x: Math.round(x), 
        y: Math.round(y),
      }
    }
    return BoundingClientRectToBounding(this._element.boundingClientRect);
  }
}
