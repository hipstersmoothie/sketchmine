export interface ITraversedDom {
  name: string;
  elements: ITraversedDomElement[];
}


export interface ITraversedDomElement {
  tagName: string;
  className: string;
  boundingClientRect: ClientRect | DOMRect;
  styles: CSSStyleDeclaration;
  children?: (ITraversedDomElement | ITraversedDomTextNode)[] 
}

export interface ITraversedDomTextNode {
  text: string;
}
