import { StyleDeclaration } from './dom-visitor';

export * from './dom-traverser';
export * from './dom-visitor';
export * from './asset-helper';

export interface TraversedPage {
  type: 'page';
  pageUrl: string;
  pageTitle: string;
  assets: IAsset[];
  element: ITraversedElement;
}

export interface TraversedLibrary {
  type: 'library';
  assets: IAsset[];
  symbols: TraversedSymbol[];
}

export interface TraversedSymbol {
  name: string;
  symbol: ITraversedDomElement;
  hasNestedSymbols: string[];
}

export interface IAsset {
  [id: string]: string;
}

export interface ITraversedElement {
  parentRect: DOMRect | null;
  tagName: string;
  styles: StyleDeclaration;
  isHidden?: boolean;
}
export interface ITraversedDomElement extends ITraversedElement {
  className: string;
  boundingClientRect: DOMRect;
  matchingComponent: string;
  variant: string;
  children?: ITraversedElement[];
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
