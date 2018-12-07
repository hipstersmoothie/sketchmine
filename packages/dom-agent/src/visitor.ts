import { ITraversedDomElement, ITraversedDomTextNode } from './typings';

/**
 * @description platform independent class that a visitor has to implement
 *
 */
export abstract class Visitor {
  hasNestedSymbols: any [];
  constructor(public hostElement: any, public selectors: string[]) {}
  abstract visitElement(element: any): ITraversedDomElement;
  abstract visitText(text: any): ITraversedDomTextNode;
}
