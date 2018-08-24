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
import { ParseObjectType } from './parse-object-type';

export interface AstVisitor {
  visitNode(node: ParseNode): any;
  visitDependency(node: ParseDependency): any;
  visitDefinition(node: ParseDefinition): any;
  visitValueType(node: ParseValueType): any;
  visitPrimitiveType(node: ParsePrimitiveType): any;
  visitReferenceType(node: ParseReferenceType): any;
  visitArrayType(node: ParseArrayType): any;
  visitObjectType(node: ParseObjectType): any;
  visitFunctionType(node: ParseFunctionType): any;
  visitSimpleType(node: ParseSimpleType): any;
  visitUnionType(node: ParseUnionType): any;
  visitProperty(node: ParseProperty): any;
  visitInterface(node: ParseInterface): any;
  visitTypeAliasDeclaration(node: ParseTypeAliasDeclaration): any;
  visitComponent(node: ParseComponent): any;
  visitResult(node: ParseResult): any;
}

export class NullVisitor implements AstVisitor {
  visitNode(node: ParseNode): any { return null; }
  visitDependency(node: ParseDependency): any { return null; }
  visitDefinition(node: ParseDefinition): any { return null; }
  visitValueType(node: ParseValueType): any { return null; }
  visitPrimitiveType(node: ParsePrimitiveType): any { return null; }
  visitReferenceType(node: ParseReferenceType): any { return null; }
  visitArrayType(node: ParseArrayType): any { return null; }
  visitObjectType(node: ParseObjectType): any { return null; }
  visitFunctionType(node: ParseFunctionType): any { return null; }
  visitSimpleType(node: ParseSimpleType): any { return null; }
  visitUnionType(node: ParseUnionType): any { return null; }
  visitProperty(node: ParseProperty): any { return null; }
  visitInterface(node: ParseInterface): any { return null; }
  visitTypeAliasDeclaration(node: ParseTypeAliasDeclaration): any { return null; }
  visitComponent(node: ParseComponent): any { return null; }
  visitResult(node: ParseResult): any { return null; }

  visit(node: ParseNode): any {
    return node && node.visit ? node.visit(this) : node;
  }

  visitAll(nodes: ParseNode[]): any[]  {
    return nodes.map(node => this.visit(node));
  }
}

export class NodeVisitor extends NullVisitor implements AstVisitor {
  visitNode(node: ParseNode): any { return node; }
  visitDependency(node: ParseDependency): any { return node; }
  visitDefinition(node: ParseDefinition): any { return node; }
  visitValueType(node: ParseValueType): any { return node; }
  visitPrimitiveType(node: ParsePrimitiveType): any { return node; }
  visitReferenceType(node: ParseReferenceType): any { return node; }
  visitArrayType(node: ParseArrayType): any { return node; }
  visitObjectType(node: ParseObjectType): any { return node; }
  visitFunctionType(node: ParseFunctionType): any { return node; }
  visitSimpleType(node: ParseSimpleType): any { return node; }
  visitUnionType(node: ParseUnionType): any { return node; }
  visitProperty(node: ParseProperty): any { return node; }
  visitInterface(node: ParseInterface): any { return node; }
  visitTypeAliasDeclaration(node: ParseTypeAliasDeclaration): any { return node; }
  visitComponent(node: ParseComponent): any { return node; }
  visitResult(node: ParseResult): any { return node; }
}

export class TreeVisitor extends NodeVisitor implements AstVisitor {

  visitInterface(node: ParseInterface): any {
    node.members = this.visitAll(node.members);
    return node;
  }

  visitComponent(node: ParseComponent): any {
    node.implementing = this.visitAll(node.implementing);
    node.extending = this.visitAll(node.extending);
    node.members = this.visitAll(node.members);
    return node;
  }

  visitFunctionType(node: ParseFunctionType): any {
    node.args = this.visitAll(node.args);
    node.returnType = this.visit(node.returnType);
    return node;
  }

  visitUnionType(node: ParseUnionType): any {
    node.types = this.visitAll(node.types);
    return node;
  }
  visitProperty(node: ParseProperty): any {
    node.type = this.visit(node.type);
    return node;
  }

  visitTypeAliasDeclaration(node: ParseTypeAliasDeclaration): any {
    node.type = this.visit(node.type);
    return node;
  }

  visitResult(node: ParseResult): any {
    node.nodes = this.visitAll(node.nodes);
    return node;
  }
}
