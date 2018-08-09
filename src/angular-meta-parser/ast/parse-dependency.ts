import { ParseNode } from './parse-node';
import { ParseLocation } from './parse-location';
import { AstVisitor } from './json-visitor';

export class ParseDependency extends ParseNode {
  constructor(location: ParseLocation, public names: string[] = []) { super(location); }
  visit(visitor: AstVisitor): any { return null; }
}
