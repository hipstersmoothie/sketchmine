import { ParseEmpty } from './parse-empty';
import { ParseNode } from './parse-node';
import { AstVisitor } from './ast-visitor';

export class ParseGeneric extends ParseEmpty {
  value: ParseNode;

  constructor(public name: string) {
    super();
  }

  visit(visitor: AstVisitor): any {
    return visitor.visitGeneric(this);
  }
}
