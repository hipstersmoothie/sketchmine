export interface ITraversedDom {
  pageUrl: string;
  pageTitle: string;
  element: ITraversedDomElement;
  assets: IAsset[];
}
export interface IAsset {
  [id: string]: string;
}

export interface ITraversedElement {
  parentRect: DOMRect;
  tagName: string;
  styles: CSSStyleDeclaration;
}
export interface ITraversedDomElement extends ITraversedElement {
  className: string;
  boundingClientRect: DOMRect;
  children?: (ITraversedDomElement | ITraversedDomTextNode)[];
}
export interface ITraversedDomTextNode extends ITraversedElement{
  text: string;
}

export interface ITraversedDomSvgNode extends ITraversedDomElement {
  html: string;
}

export interface ITraversedDomImageNode extends ITraversedDomElement {
  src: string;
  name?: string;
}
