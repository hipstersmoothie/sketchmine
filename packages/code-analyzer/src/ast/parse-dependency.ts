import { ParseNode } from './parse-node';
import { ParseLocation } from './parse-location';
import { AstVisitor } from './ast-visitor';

export class ParseDependency extends ParseNode {
  constructor(location: ParseLocation, public path: string, public values: Set<string>) {
    super(location);
  }
  visit(visitor: AstVisitor): any {
    return null;
  }
}
