import { UUID } from '@sketchmine/helpers';
import {
  ITraversedDomSvgNode,
  ITraversedDomImageNode,
  ITraversedDomTextNode,
  ITraversedDomElement,
  Visitor,
} from './public-api';

import { elementNode } from './interfaces';
import { getClassName, getRect, getStyle } from './helpers';

/**
 * @description
 * The visitor visits a node and pulls the information out that is later needed
 * for the .sketch file generation.
 */
export class DomVisitor implements Visitor {

  hasNestedSymbols = [];
  constructor(public hostElement: HTMLElement, public selectors: string[]) {}

  visitBeforeOrAfterElement(element: HTMLElement, type: ':after' | ':before'): ITraversedDomElement {

    const parent = element.parentElement;
    const parentRect: DOMRect = getRect(parent);
    const options = getStyle(element, type);
    const matchingComponent = this.selectors.find(sel => element.webkitMatchesSelector(sel)) || null;

    const style = getComputedStyle(element, type);
    const boundingClientRect = getRect(element);
    boundingClientRect.width = parseInt(style.width, 10);
    boundingClientRect.height = parseInt(style.height, 10);
    boundingClientRect.y = parseInt(style.marginTop, 10);
    boundingClientRect.x = parseInt(style.marginRight, 10);
    boundingClientRect.top = parseInt(style.marginTop, 10);
    boundingClientRect.right = parseInt(style.marginRight, 10);

    return {
      tagName: `${element.tagName.toUpperCase()}${type}`,
      className: '',
      parentRect,
      boundingClientRect,
      styles: !options.isHidden ? options.styles : null,
      matchingComponent,
      variant: null,
      isHidden: options.isHidden,
    } as ITraversedDomElement;
  }

  visitElement(element: elementNode): ITraversedDomElement {
    const isRoot = element === this.hostElement;
    const className = getClassName(element);
    const tagName = element.tagName.toUpperCase();
    const parent = element.parentElement;
    const parentRect: DOMRect | null = (parent && !isRoot) ? getRect(parent as HTMLElement) : null;
    const options = getStyle(element);
    const matchingComponent = this.selectors.find(sel => element.webkitMatchesSelector(sel)) || null;

    if (matchingComponent && !isRoot) {
      this.hasNestedSymbols.push(matchingComponent);
    }

    const el = {
      tagName,
      className,
      parentRect,
      boundingClientRect: getRect(element as HTMLElement),
      styles: !options.hasDefaultStyling && !options.isHidden ? options.styles : null,
      matchingComponent,
      variant: matchingComponent ? element.getAttribute('symbol-variant') : null,
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
        // TODO: make image asset helper a singleton
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
    // filter empty text nodes with line breaks
    const content = text.textContent.replace(/\n/gm, '');

    if (content.trim().length === 0) { return null; }

    const options = getStyle(text.parentNode as elementNode);

    return {
      tagName: 'TEXT',
      parentRect: getRect(text.parentNode as HTMLElement),
      styles: !options.isHidden ? options.styles : null,
      isHidden: options.isHidden,
      text: text.textContent,
    };
  }

}
