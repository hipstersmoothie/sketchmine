import { Style } from './sketchJSON/models/style';
import { IStyle } from './sketchJSON/interfaces/style.interface';
import { Rectangle } from './sketchJSON/models/rectangle';
import { boundingClientRectToBounding, calcPadding } from './sketchJSON/helpers/util';
import { IRectangle, IRectangleOptions } from './sketchJSON/interfaces/rectangle.interface';
import { Group } from './sketchJSON/models/group';
import { IGroup } from './sketchJSON/interfaces/group.interface';
import {
  ITraversedDomElement,
  ITraversedDomTextNode,
  ITraversedDomSvgNode,
  ITraversedDomImageNode,
} from './traversed-dom.interface';
import { Text } from './sketchJSON/models/text';
import chalk from 'chalk';
import { IBounding } from './sketchJSON/interfaces/Base';
import { ShapeGroup } from './sketchSvgParser/models/shape-group';
import { SvgParser } from './sketchSvgParser/svg-parser';
import { SvgToSketch } from './sketchSvgParser/svg-to-sketch';
import { SvgStyle } from './sketchSvgParser/interfaces/svg.interface';
import { addStyle, overrideSvgStyle } from './sketchSvgParser/util/styles';
import { Bitmap } from './sketchJSON/models/bitmap';

export class ElementNode {
  private _layers = [];

  get layers(): IGroup[] { return this._layers; }

  constructor(element: ITraversedDomElement | ITraversedDomTextNode | ITraversedDomSvgNode) {
    if (!element) {
      return;
    }
    switch (element.tagName) {
      case 'TEXT':
        this.generateText(element as ITraversedDomTextNode);
        break;
      case 'IMG':
        this.generateIMG(element as ITraversedDomImageNode);
        break;
      case 'SVG':
        this.generateSVG(element as ITraversedDomSvgNode);
        break;
      default:
        this.generate(element as ITraversedDomElement);
    }
  }

  private generateIMG(element: ITraversedDomImageNode) {
    if (process.env.DEBUG) {
      console.log(chalk`\tAdd Image 🖼\t{grey ${element.src}}`);
    }
    const size = this.getSize(element);
    const image = new Bitmap(size);
    image.src = element.src;
    image.name = element.name;
    this._layers.push(image.generateObject());
  }

  private generateSVG(element: ITraversedDomSvgNode) {
    if (process.env.DEBUG) {
      console.log(chalk`\tAdd SVG 🖼 ...`);
    }
    const size = this.getSize(element);
    const svgObject = SvgParser.parse(element.html, size.width, size.height);
    // svgObject.shapes.map(shape => overrideSvgStyle(shape.style, element.styles));
    // const styles = this.addStyles(element);

    const svg = new SvgToSketch(svgObject);
    svg.styles = element.styles;

    this._layers.push(...svg.generateObject());
  }

  private generateText(element: ITraversedDomTextNode) {
    const bcr = boundingClientRectToBounding(element.parentRect);
    const paddedBCR = calcPadding(element.styles.padding, bcr);
    if (process.env.DEBUG) {
      console.log(chalk`\tAdd Text 📝  with Text: "{yellowBright ${element.text}}"`, paddedBCR);
    }
    const text = new Text(paddedBCR, element.styles);
    text.text = element.text;
    this._layers.push(text.generateObject());
  }

  private generate(element: ITraversedDomElement) {
    const size = this.getSize(element);
    const group = new Group(size);
    group.name = element.className || element.tagName.toLowerCase();

    // add Background shape only if it has styling
    if (!this.hasDefaultStyling(element.styles)) {
      // shape Group in group always starts at x:0, y:0
      const shapeGroup = new ShapeGroup({ ...size, x:0, y:0 });
      shapeGroup.name = 'Background';
      shapeGroup.style = this.addStyles(element);
      shapeGroup.addLayer(this.addshape(element));
      group.addLayer(shapeGroup.generateObject());
    }

    if (element.children && element.children.length > 0) {
      element.children.reverse().forEach((child) => {
        const childNode = new ElementNode(child);
        const layers = childNode.layers;
        if (layers.length > 0) {
          group.addLayer(layers);
        }
      });
    }
    this._layers.push(group.generateObject());
  }

  private hasDefaultStyling(styles: CSSStyleDeclaration) {
    const DEFAULT_VALUES = {
      backgroundColor: 'rgba(0, 0, 0, 0)',
      backgroundImage: 'none',
      borderWidth: '0px',
      boxShadow: 'none',
    };

    return Object.keys(DEFAULT_VALUES).every((key) => {
      const defaultValue = DEFAULT_VALUES[key];
      const value = styles[key];

      return defaultValue === value;
    });
  }

  private addshape(element: ITraversedDomElement): IRectangle {

    const options: IRectangleOptions = {
      width: element.boundingClientRect.width,
      height: element.boundingClientRect.height,
      cornerRadius: parseInt(element.styles.borderRadius, 10),
    };
    const rectangle = new Rectangle(options);
    return rectangle.generateObject();
  }

  private addStyles(element: ITraversedDomElement): IStyle {
    const style = new Style();
    const cs = element.styles;

    if (!cs) {  return; }
    if (cs.backgroundColor) { style.addColorFill(cs.backgroundColor); }
    if (cs.borderWidth) { style.addBorder(cs.borderColor, parseInt(cs.borderWidth, 10)); }
    if (parseInt(cs.opacity, 10) < 1) { style.opacity = cs.opacity; }

    return style.generateObject();
  }

  private getSize(element: ITraversedDomElement | ITraversedDomSvgNode): IBounding {
    const parentBCR = element.parentRect;
    const bcr = element.boundingClientRect;

    if (process.env.DEBUG && element.className) {
      console.log(
        chalk`\t{magentaBright ${element.className}} | {yellowBright ${element.tagName}}`,
        boundingClientRectToBounding(element.boundingClientRect),
      );
    }

    if (Object.keys(parentBCR).length > 0) {
      const x = bcr.x - parentBCR.x;
      const y = bcr.y - parentBCR.y;
      return {
        height: Math.round(bcr.height),
        width: Math.round(bcr.width),
        x: Math.round(x),
        y: Math.round(y),
      };
    }
    return boundingClientRectToBounding(element.boundingClientRect);
  }
}
