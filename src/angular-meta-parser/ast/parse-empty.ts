import { AstVisitor } from './ast-visitor';

export class ParseEmpty {
  visit(visitor: AstVisitor): any { return null; }
}
