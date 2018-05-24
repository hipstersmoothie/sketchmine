export interface ITraversedDom {
  pageUrl: string;
  pageTitle: string;
  elements: ITraversedDomElement[];
}
export interface ITraversedDomElement {
  tagName: string;
  className: string;
  parentRect: DOMRect;
  boundingClientRect: DOMRect;
  styles: CSSStyleDeclaration;
  children?: (ITraversedDomElement | ITraversedDomTextNode)[] 
}
export interface ITraversedDomTextNode {
  text: string;
  tagName: string;
}
