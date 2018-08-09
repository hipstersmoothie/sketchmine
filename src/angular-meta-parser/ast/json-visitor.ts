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
} from './index';

export interface AstVisitor {
  visitNode(node: ParseNode): any;
  visitDependency(node: ParseDependency): any;
  visitDefinition(node: ParseDefinition): any;
  visitValueType(node: ParseValueType): any;
  visitPrimitiveType(node: ParsePrimitiveType): any;
  visitReferenceType(node: ParseReferenceType): any;
  visitArrayType(node: ParseArrayType): any;
  visitFunctionType(node: ParseFunctionType): any;
  visitSimpleType(node: ParseSimpleType): any;
  visitUnionType(node: ParseUnionType): any;
  visitProperty(node: ParseProperty): any;
  visitInterface(node: ParseInterface): any;
  visitTypeAliasDeclaration(node: ParseTypeAliasDeclaration): any;
  visitResult(node: ParseResult): any;
}

export class JSONVisitor implements AstVisitor {
  visitNode(node: ParseNode): any { return null; }
  visitDependency(node: ParseDependency): any { return null; }
  visitDefinition(node: ParseDefinition): any { return null; }
  visitValueType(node: ParseValueType): string { return node.value; }
  visitPrimitiveType(node: ParsePrimitiveType): string {
    return node.type;
  }
  visitReferenceType(node: ParseReferenceType): string { return node.name; }
  visitArrayType(node: ParseArrayType): string { return `${node.name}[]`; }
  visitFunctionType(node: ParseFunctionType): any {
    return {
      args: this.visitAll(node.args),
      returnType: node.returnType ? node.returnType.visit(this) : null,
    };
  }
  visitSimpleType(node: ParseSimpleType): any { return null; }
  visitUnionType(node: ParseUnionType): any {
    return this.visitAll(node.types);
  }
  visitProperty(node: ParseProperty): any {
    return {
      key: node.name,
      value: node.type ? node.type.visit(this) : null,
    };
  }
  visitTypeAliasDeclaration(node: ParseTypeAliasDeclaration): any {
    return {
      key: node.name,
      value: node.type ? node.type.visit(this) : null,
    };
  }
  visitInterface(node: ParseInterface): any {
    return {
      location: node.location.path,
      name: node.name,
      members: this.visitAll(node.members),
    };
  }
  visitResult(node: ParseResult): any {
    return this.visitAll(node.nodes);
  }

  visitAll(nodes: ParseNode[]) {
    return nodes.map(node => node.visit(this));
  }
}
