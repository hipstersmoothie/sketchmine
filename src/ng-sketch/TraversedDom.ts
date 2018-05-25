export interface ITraversedDom {
  pageUrl: string;
  pageTitle: string;
  elements: ITraversedDomElement[];
}

export interface ITraversedElement {
  parentRect: DOMRect;
  tagName: string;
  styles: CSSStyleDeclaration;
}
export interface ITraversedDomElement extends ITraversedElement {
  className: string;
  boundingClientRect: DOMRect;
  children?: (ITraversedDomElement | ITraversedDomTextNode)[] 
}
export interface ITraversedDomTextNode extends ITraversedElement{
  text: string;
}
