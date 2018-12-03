import { ITraversedElement } from './typings';
import { Visitor } from './visitor';

/**
 * @description platform independent interface that a traverser has to implement
 */
export interface Traverser {
  traverse(node: any, visitor: Visitor): ITraversedElement;
}
