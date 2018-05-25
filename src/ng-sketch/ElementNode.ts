import { IBounding } from "./sketchJSON/interfaces/Base";
import { ShapeGroup } from "./sketchJSON/models/ShapeGroup";
import { Style } from "./sketchJSON/models/Style";
import { IStyle } from "./sketchJSON/interfaces/Style";
import { IShapeGroup } from "./sketchJSON/interfaces/ShapeGroup";
import { Rectangle } from "./sketchJSON/models/Rectangle";
import { parseBorderRadius, BoundingClientRectToBounding, calcPadding } from "./sketchJSON/helpers/util";
import { IRectangle, IRectangleOptions } from "./sketchJSON/interfaces/Rectangle";
import { Group } from "./sketchJSON/models/Group";
import { IGroup } from "./sketchJSON/interfaces/Group";
import { ITraversedDomElement, ITraversedDomTextNode } from "./TraversedDom";
import { Text } from "./sketchJSON/models/Text";

export class ElementNode {
  private _layers = [];

  get layers(): IGroup[] { return this._layers; }

  constructor(element: ITraversedDomElement | ITraversedDomTextNode) {
    switch(element.tagName) {
      case 'TEXT': 
        this.generateText(element as ITraversedDomTextNode); 
        break;
      case 'IMG':
        console.log('🚫 🖼 Images are currently not supported!'); break;
      case 'SVG':
        console.log('🚫 🖼 Images are currently not supported!'); break;
      default:
        this.generate(element as ITraversedDomElement);
    }
  }

  private generateText(element: ITraversedDomTextNode) {
    const bcr = BoundingClientRectToBounding(element.parentRect);
    const paddedBCR = calcPadding(element.styles.padding, bcr);
    console.log(bcr)
    console.log(paddedBCR)
    const text = new Text(paddedBCR, element.styles);
    text.text = element.text;
    this._layers.push(text.generateObject());
  }


  private generate(element: ITraversedDomElement) {
    const size = this.getSize(element);
    const group = new Group(size);
    const shapeGroup = new ShapeGroup({...size, x:0, y:0 });

    group.name = element.className || element.tagName.toLowerCase();
    shapeGroup.name = 'Background';
    shapeGroup.style = this.addStyles(element);
    shapeGroup.addLayer(this.addshape(element));
    group.addLayer(shapeGroup.generateObject())

    if (element.children && element.children.length > 0) {
      element.children.reverse().forEach(child => {
        const childNode = new ElementNode(child);
        const layers = childNode.layers
        if (layers.length > 0) {
          group.addLayer(layers);
        }
      })
    }
    this._layers.push(group.generateObject());
  }

  private addshape(element: ITraversedDomElement): IRectangle {

    const options: IRectangleOptions = {
      width: element.boundingClientRect.width,
      height: element.boundingClientRect.height,
      cornerRadius: parseInt(element.styles.borderRadius),
    }
    const rectangle = new Rectangle(options);
    return rectangle.generateObject();
  }

  private addStyles(element: ITraversedDomElement): IStyle {
    const style = new Style();
    const cs = element.styles;

    if(!cs) {
      return;
    }

    if (cs.backgroundColor) { style.addColorFill(cs.backgroundColor); }
    if (cs.borderWidth) { style.addBorder(cs.borderColor, parseInt(cs.borderWidth, 10)); }
    if (parseInt(cs.opacity, 10) < 1) { style.opacity = cs.opacity; }

    return style.generateObject();
  }

  private getSize(element: ITraversedDomElement): IBounding {
    const parentBCR = element.parentRect;
    const bcr = element.boundingClientRect;

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
    return BoundingClientRectToBounding(element.boundingClientRect);
  }
}
