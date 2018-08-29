import { UUID } from '@sketch-draw/helpers/uuid';

export class DomVisitor {

  constructor(public hostElement: HTMLElement) {}

  visitElement(element) {
    const className = (typeof element.className === 'string') ? element.className.split(' ').join('\/') : undefined;
    const tagName = element.tagName.toUpperCase();
    const el = {
      tagName,
      className,
      parentRect: (element.parentNode && element !== this.hostElement) ?
        element.parentNode.getBoundingClientRect() : {},
      boundingClientRect: element.getBoundingClientRect(),
      styles: this.getStyle(element),
    } as any;

    switch (tagName) {
      case 'SVG':
        el.html = element.outerHTML;
        break;
      case 'IMG':
        const src = element.getAttribute('src');
        const id = UUID.generate();
        el.src = `images/${id}.${src.split('.').pop()}`;
        el.name = src;
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
  visitText(text) {
    return {
      tagName: 'TEXT',
      parentRect: text.parentNode.getBoundingClientRect(),
      styles: this.getStyle(text.parentNode),
      text: text.textContent,
    };
  }

  /**
   * Gathers the CSS Style Declaration of an Element
   * @param element Element
   * @returns CSSStyleDeclaration
   */
  getStyle(element) {
    const style = JSON.parse(JSON.stringify(getComputedStyle(element)));
    return style;
  }
}
