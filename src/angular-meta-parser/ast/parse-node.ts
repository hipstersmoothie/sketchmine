import { ParseLocation } from './parse-location';
import { AstVisitor } from './ast-visitor';

export class ParseNode {
  constructor(public location: ParseLocation) { }
  visit(visitor: AstVisitor): any { return null; }
}
