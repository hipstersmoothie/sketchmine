import { ParseEmpty } from './parse-empty';
import { ParseNode } from './parse-node';

export class ParseGeneric extends ParseEmpty {
  value: ParseNode;

  constructor(public name: string) {
    super();
  }
}
