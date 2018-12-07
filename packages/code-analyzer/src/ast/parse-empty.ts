import { AstVisitor } from './ast-visitor';
import { ParseNode } from './parse-node';

export class ParseEmpty extends ParseNode {
  constructor() {
    super(null);
  }
  visit(visitor: AstVisitor): any { return null; }
}
