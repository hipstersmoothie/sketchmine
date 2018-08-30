import { UUID } from '@sketch-draw/helpers/uuid';
import {
  ITraversedDomSvgNode,
  ITraversedDomImageNode,
  ITraversedDomTextNode,
  ITraversedDomElement,
} from './traversed-dom';

/**
 * @description
 * The visitor visits a node and pulls the information out that is later needed
 * for the .sketch file generation.
 */
export class DomVisitor {

  constructor(public hostElement: HTMLElement) {}

  visitElement(element): ITraversedDomElement {
    const className = (typeof element.className === 'string') ? element.className.split(' ').join('\/') : '';
    const tagName = element.tagName.toUpperCase();
    const el = {
      tagName,
      className,
      parentRect: (element.parentNode && element !== this.hostElement) ?
        element.parentNode.getBoundingClientRect() : {},
      boundingClientRect: element.getBoundingClientRect(),
      styles: this.getStyle(element),
    } as ITraversedDomElement;

    switch (tagName) {
      case 'SVG':
        (el as ITraversedDomSvgNode).html = element.outerHTML;
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
    const content = text.textContent.replace(/\n/gm, '');
    if (content.trim().length === 0) {
      return null;
    }
    return {
      tagName: 'TEXT',
      parentRect: (text.parentNode as HTMLElement).getBoundingClientRect() as DOMRect,
      styles: this.getStyle(text.parentNode),
      text: text.textContent,
    };
  }

  /**
   * Gathers the CSS Style Declaration of an Element
   * @param element Element
   * @returns CSSStyleDeclaration
   */
  getStyle(element): CSSStyleDeclaration {
    const style = JSON.parse(JSON.stringify(getComputedStyle(element)));
    return style;
  }
}
