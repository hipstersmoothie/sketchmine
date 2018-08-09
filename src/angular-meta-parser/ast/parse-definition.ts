import { ParseNode } from './parse-node';
import { ParseLocation } from './parse-location';
import { AstVisitor } from './json-visitor';

export class ParseDefinition extends ParseNode {

  constructor(public name: string, location: ParseLocation) {
    super(location);
  }

  visit(visitor: AstVisitor): any {
    return null;
  }
}
