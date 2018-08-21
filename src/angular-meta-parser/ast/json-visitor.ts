import {
  ParseNode,
  ParseDependency,
  ParseValueType,
  ParseDefinition,
  ParsePrimitiveType,
  ParseReferenceType,
  ParseFunctionType,
  ParseSimpleType,
  ParseUnionType,
  ParseProperty,
  ParseInterface,
  ParseResult,
  ParseTypeAliasDeclaration,
  ParseArrayType,
  ParseComponent,
  AstVisitor,
} from './index';
import { arrayFlatten } from '@utils';

export class JSONVisitor implements AstVisitor {
  // We don't care about dependencies, interfaces and type declarations
  // in case we resolved them earlier with our transformer
  visitNode(node: ParseNode): null { return null; }
  visitDependency(node: ParseDependency): null { return null; }
  visitDefinition(node: ParseDefinition): null { return null; }
  visitSimpleType(node: ParseSimpleType): null { return null; }

  visitValueType(node: ParseValueType): string {
    switch (typeof node.value) {
      case 'string':
      case 'number':
        return `\"${node.value}\"`;
    }
    return node.value;
  }
  visitPrimitiveType(node: ParsePrimitiveType): any { return node.type; }
  visitReferenceType(node: ParseReferenceType): string { return `ParseReference< ${node.name}>`; }
  visitArrayType(node: ParseArrayType): string { return node.name; }
  visitFunctionType(node: ParseFunctionType): any {
    const args = this.visitAll(node.args);
    const returnType = node.returnType ? node.returnType.visit(this) : null;
    return {
      type: 'method',
      name: 'handleClick',
      arguments: args,
      returnType,
    };
  }
  visitUnionType(node: ParseUnionType): any[] {
    return  arrayFlatten(this.visitAll(node.types));
  }
  visitProperty(node: ParseProperty): any {
    const value = node.type ? node.type.visit(this) : null;

    if (value && value.type === 'method') {
      value.name = node.name;
      return value;
    }

    return {
      key: node.name,
      value,
    };
  }
  visitTypeAliasDeclaration(node: ParseTypeAliasDeclaration): any {
    return node.type ? node.type.visit(this) : null;
  }
  visitInterface(node: ParseInterface): any {
    const members = this.visitAll(node.members);
    return {
      name: node.name,
      members,
    };
  }
  visitComponent(node: ParseComponent): any {
    const componentMembers: any[] = this.visitAll(node.members);
    const implementing = this.visitAll(node.implementing)
      .filter(impl => impl.members.length)
      .map(impl => impl.members);

    arrayFlatten(implementing).forEach((impl) => {
      for (let i = 0, max = componentMembers.length; i < max; i += 1) {
        if (componentMembers[i].key !== impl.key) {
          continue;
        }
        if (componentMembers[i].value === null) {
          componentMembers[i].value = impl.value;
        } else {
          componentMembers[i].value = [componentMembers[i].value, ...impl.value];
        }
      }
    });

    return {
      className: node.name,
      selector: node.selector,
      variants: componentMembers,
    };
  }
  visitResult(node: ParseResult): any {
    const nodes = this.visitAll(node.nodes);
    return nodes.filter(node => node.className);
  }

  visitAll(nodes: ParseNode[]): any[] {
    const result = [];
    nodes.forEach((node: ParseNode) => {
      if (node) {
        const n = node.visit(this);
        if (n) { result.push(n); }
      }
    });
    return result;
  }
}
