import {
  NodeVisitor,
  NullVisitor,
  ParsedVisitor,
  ParseMethod,
  ParseResult,
  ParseIntersectionType,
  ParseTypeAliasDeclaration,
  ParseGeneric,
  ParseInterfaceDeclaration,
  ParseProperty,
} from '../parsed-nodes';

import { merge } from 'lodash';

export interface Property {
  type: 'property';
  key: string;
  value: string[];
}

/**
 * Generates the final JSON that is written to a file from the
 * generated AST.
 */
export class JSONResolver extends NullVisitor implements ParsedVisitor {

  visitMethod(node: ParseMethod) {
    console.log(this.currentLvl)
    const returnType = this.visit(node.returnType);
    return {
      name: node.name,
      returnType: returnType,
    };
  }

  visitInterfaceDeclaration(node: ParseInterfaceDeclaration): any {
    const members = this.visitAll(node.members);
    return {
      name: node.name,
      members,
    };
  }

  visitIntersectionType(node: ParseIntersectionType): any {
    const types = this.visitAll(node.types);
    console.log(types)
    return merge.apply(null, [{}].concat(types))
  }

  visitProperty(node: ParseProperty): Property {
    return {
      type: 'property',
      key: node.name,
      value: node.value,
    };
  }

  visitResult(node: ParseResult): any[] {
    const nodes = this.visitAll(node.nodes, 0)
    // TODO: filter all nodes that are angular components
    // .filter(node => node instanceof ParseClassDeclaration && node.isAngularComponent());
    return nodes;
  }

  visitTypeAliasDeclaration(node: ParseTypeAliasDeclaration): any {
    return this.visit(node.type);
  }

  visitGeneric(node: ParseGeneric): any {
    const constraint = this.visit(node.constraint);
    const value = this.visit(node.value);
    return Object.assign({}, value, constraint);
  }

}


