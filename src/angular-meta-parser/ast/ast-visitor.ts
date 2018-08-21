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
  visitComponent(node: ParseComponent): any;
  visitResult(node: ParseResult): any;
}

export class NodeVisitor implements AstVisitor {
  visitNode(node: ParseNode) { return node; }
  visitDependency(node: ParseDependency) { return node; }
  visitDefinition(node: ParseDefinition) { return node; }
  visitValueType(node: ParseValueType) { return node; }
  visitPrimitiveType(node: ParsePrimitiveType) { return node; }
  visitReferenceType(node: ParseReferenceType) { return node; }
  visitArrayType(node: ParseArrayType) { return node; }
  visitFunctionType(node: ParseFunctionType) { return node; }
  visitSimpleType(node: ParseSimpleType) { return node; }
  visitUnionType(node: ParseUnionType) { return node; }
  visitProperty(node: ParseProperty) { return node; }
  visitInterface(node: ParseInterface) { return node; }
  visitTypeAliasDeclaration(node: ParseTypeAliasDeclaration) { return node; }
  visitComponent(node: ParseComponent) { return node; }
  visitResult(node: ParseResult) { return node; }
}

export class TreeVisitor extends NodeVisitor implements AstVisitor {

  visitInterface(node: ParseInterface): any {
    node.members = this.visitAll(node.members);
    return node;
  }

  visitComponent(node: ParseComponent) {
    node.implementing = this.visitAll(node.implementing);
    node.extending = this.visitAll(node.extending);
    return this.visitInterface(node as ParseInterface);
  }

  visitFunctionType(node: ParseFunctionType): any {
    node.args = this.visitAll(node.args);
    node.returnType = node.returnType && node.returnType.visit(this);
    return node;
  }

  visitUnionType(node: ParseUnionType): any {
    node.types = this.visitAll(node.types);
    return node;
  }
  visitProperty(node: ParseProperty): any {
    node.type = node.type && node.type.visit(this);
    return node;
  }

  visitTypeAliasDeclaration(node: ParseTypeAliasDeclaration): any {
    return this.visitProperty(node);
  }

  visitResult(node: ParseResult): any {
    node.nodes = this.visitAll(node.nodes);
    return node;
  }

  visitAll(nodes: ParseNode[])  {
    return nodes.map(node => node.visit(this));
  }
}
