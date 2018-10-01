import { UUID } from '@sketch-draw/helpers/uuid';
import {
  ITraversedDomSvgNode,
  ITraversedDomImageNode,
  ITraversedDomTextNode,
  ITraversedDomElement,
} from './traversed-dom';

/**
 * The property keys that are used to identify if the element
 * has default styling behaviours for the background.
 * uses the values from `new StyleDeclaration()`.
 */
const DEFAULT_STYLING_VALUES = [
  'backgroundColor',
  'backgroundImage',
  'borderWidth',
  'boxShadow',
  'padding',
];

/**
 * use class for this, because class can used as interface
 * for return types and you can iterate over the keys with
 * `Object.keys(new StyleDeclaration())` – reduces redundant code
 * of an array and an interface.
 *
 * @description
 * Interface for the used properties of the CSSStyleDeclaration that is gathered
 * with the `getComputedStyle(element: HTMLElement)` function
 */
export class StyleDeclaration {
  backgroundColor = 'rgba(0, 0, 0, 0)';
  backgroundImage = 'none';
  borderTop = '0px none rgb(0, 0, 0)';
  borderLeft = '0px none rgb(0, 0, 0)';
  borderBottom = '0px none rgb(0, 0, 0)';
  borderRight = '0px none rgb(0, 0, 0)';
  borderColor = 'rgb(0, 0, 0)';
  borderRadius = '0px';
  borderWidth = '0px';
  boxShadow = 'none';
  padding = '0px';
  color = 'rgb(0, 0, 0)';
  display = 'block';
  fill = 'rgb(0, 0, 0)';
  fontFamily = 'Helvetica Neue';
  fontSize = '16px';
  fontStyle = 'normal';
  fontWeight = '400';
  lineHeight = 'normal';
  opacity = '1';
  strokeWidth = '1px';
  transform = 'none';
  visibility = 'visible';
  whiteSpace = 'normal';
}

/**
 * @description abstract class that a visitor has to implement
 */
export abstract class Visitor {
  abstract visitElement(element: HTMLElement): ITraversedDomElement;
  abstract visitText(text: Node): ITraversedDomTextNode;
}

type elementNode = HTMLElement | SVGSVGElement | HTMLImageElement;

export interface StyleOptions {
  styles: StyleDeclaration;
  isHidden: boolean;
  hasDefaultStyling: boolean;
}

/**
 * @description
 * The visitor visits a node and pulls the information out that is later needed
 * for the .sketch file generation.
 */
export class DomVisitor implements Visitor {

  constructor(public hostElement: HTMLElement) {}

  visitElement(element: elementNode): ITraversedDomElement {
    const className = (typeof element.className === 'string') ? element.className.split(' ').join('\/') : '';
    const tagName = element.tagName.toUpperCase();
    const parent = element.parentElement;
    const parentRect: DOMRect | null =
      (parent && element !== this.hostElement) ? this.getRect(parent as HTMLElement) : null;
    const options = this.getStyle(element);
    const el = {
      tagName,
      className,
      parentRect,
      boundingClientRect: this.getRect(element as HTMLElement),
      styles: !options.hasDefaultStyling && !options.isHidden ? options.styles : null,
      isHidden: options.isHidden,
    } as ITraversedDomElement;

    switch (tagName) {
      case 'SVG':
        (el as ITraversedDomSvgNode).html = element.outerHTML;
        el.styles = options.styles;
        break;
      case 'PATH':
        el.styles = options.styles;
        break;
      case 'IMG':
        const src = element.getAttribute('src');
        const id = UUID.generate();
        (el as ITraversedDomImageNode).src = `images/${id}.${src.split('.').pop()}`;
        (el as ITraversedDomImageNode).name = src;
        /** TODO: make image asset helper a singleton */
        // images.addAsset(src, id);
        break;
    }

    return el;
  }

  /**
   * Gathers information about a Textnode
   * @param text TextNode
  */
  visitText(text: Node): ITraversedDomTextNode {
    /**
     * filter empty text nodes with linebreaks
     */
    const content = text.textContent.replace(/\n/gm, '');
    if (content.trim().length === 0) {
      return null;
    }
    const options = this.getStyle(text.parentNode as elementNode);
    return {
      tagName: 'TEXT',
      parentRect: this.getRect(text.parentNode as HTMLElement),
      styles: !options.isHidden ? options.styles : null,
      isHidden: options.isHidden,
      text: text.textContent,
    };
  }

  /**
   * returns a DOMRect from an element
   * @param element HTMLElement
   */
  getRect(element: HTMLElement): DOMRect {
    const bcr = element.getBoundingClientRect() as DOMRect;
    /**
     * In case of we return the result with `.evaluate` properties of DOM object
     * are not enumerable and won't get serialized so we have to manual assign them.
     * @example https://github.com/segmentio/nightmare/issues/723#issuecomment-232666629
     * */
    return {
      x: bcr.x,
      y: bcr.y,
      width: bcr.width,
      height: bcr.height,
      top: bcr.top,
      right: bcr.right,
      bottom: bcr.bottom,
      left: bcr.left,
    } as DOMRect;
  }

  isHidden(style: StyleDeclaration) {
    if (style.visibility === 'hidden' || style.display === 'none') {
      return true;
    }
    return false;
  }

  /**
   * Gathers the CSS Style Declaration of an Element
   * @param element Element
   * @param textNode boolean that checks if it is a textnode (for default styling ignore on text node)
   * @returns StyleDeclaration or null if it has default styling
   */
  getStyle(element: elementNode): StyleOptions {
    const defaultStyling = new Set<boolean>();
    const styles = new StyleDeclaration();
    const tempStyle = getComputedStyle(element);
    for (const key of Object.keys(styles)) {
      defaultStyling.add(DEFAULT_STYLING_VALUES.includes(key) && styles[key] !== tempStyle[key]);
      styles[key] = tempStyle[key];
    }

    return {
      styles,
      isHidden: this.isHidden(styles),
      hasDefaultStyling: defaultStyling.size < 2,
    };
  }
}
