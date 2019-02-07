import {
  ParseArrayType,
  ParseComponent,
  ParseDefinition,
  ParseDependency,
  ParseFunctionType,
  ParseGeneric,
  ParseInterface,
  ParseLocation,
  ParseNode,
  ParseObjectType,
  ParsePrimitiveType,
  ParseProperty,
  ParseReferenceType,
  ParseResult,
  ParseSimpleType,
  ParseTypeAliasDeclaration,
  ParseTypeParameter,
  ParseUnionType,
  ParseValueType,
  ParseVariableStatement,
} from './index';

import { Logger } from '@sketchmine/node-helpers';
const log = new Logger();

export interface AstVisitor {
  visitArrayType(node: ParseArrayType): any;
  visitComponent(node: ParseComponent): any;
  visitDefinition(node: ParseDefinition): any;
  visitDependency(node: ParseDependency): any;
  visitFunctionType(node: ParseFunctionType): any;
  visitGeneric(node: ParseGeneric): any;
  visitInterface(node: ParseInterface): any;
  visitNode(node: ParseNode): any;
  visitObjectType(node: ParseObjectType): any;
  visitPrimitiveType(node: ParsePrimitiveType): any;
  visitProperty(node: ParseProperty): any;
  visitReferenceType(node: ParseReferenceType): any;
  visitResult(node: ParseResult): any;
  visitSimpleType(node: ParseSimpleType): any;
  visitTypeAliasDeclaration(node: ParseTypeAliasDeclaration): any;
  visitTypeParameter(node: ParseTypeParameter): any;
  visitUnionType(node: ParseUnionType): any;
  visitValueType(node: ParseValueType): any;
  visitVariableStatement(node: ParseVariableStatement): any;
}

export class NullVisitor implements AstVisitor {
  visitArrayType(node: ParseArrayType): any { return null; }
  visitComponent(node: ParseComponent): any { return null; }
  visitDefinition(node: ParseDefinition): any { return null; }
  visitDependency(node: ParseDependency): any { return null; }
  visitFunctionType(node: ParseFunctionType): any { return null; }
  visitGeneric(node: ParseGeneric): any { return null; }
  visitInterface(node: ParseInterface): any { return null; }
  visitNode(node: ParseNode): any { return null; }
  visitObjectType(node: ParseObjectType): any { return null; }
  visitPrimitiveType(node: ParsePrimitiveType): any { return null; }
  visitProperty(node: ParseProperty): any { return null; }
  visitReferenceType(node: ParseReferenceType): any { return null; }
  visitResult(node: ParseResult): any { return null; }
  visitSimpleType(node: ParseSimpleType): any { return null; }
  visitTypeAliasDeclaration(node: ParseTypeAliasDeclaration): any { return null; }
  visitTypeParameter(node: ParseTypeParameter): any { return null; }
  visitUnionType(node: ParseUnionType): any { return null; }
  visitValueType(node: ParseValueType): any { return null; }
  visitVariableStatement(node: ParseVariableStatement): any { return null; }

  visit(node: ParseNode): any {
    return node && node.visit ? node.visit(this) : node;
  }

  visitAll(nodes: ParseNode[]): any[]  {
    return nodes.map(node => this.visit(node));
  }
}

export class NodeVisitor extends NullVisitor implements AstVisitor {
  visitArrayType(node: ParseArrayType): any { return node; }
  visitComponent(node: ParseComponent): any { return node; }
  visitDefinition(node: ParseDefinition): any { return node; }
  visitDependency(node: ParseDependency): any { return node; }
  visitFunctionType(node: ParseFunctionType): any { return node; }
  visitGeneric(node: ParseGeneric): any { return node; }
  visitInterface(node: ParseInterface): any { return node; }
  visitNode(node: ParseNode): any { return node; }
  visitObjectType(node: ParseObjectType): any { return node; }
  visitPrimitiveType(node: ParsePrimitiveType): any { return node; }
  visitProperty(node: ParseProperty): any { return node; }
  visitReferenceType(node: ParseReferenceType): any { return node; }
  visitResult(node: ParseResult): any { return node; }
  visitSimpleType(node: ParseSimpleType): any { return node; }
  visitTypeAliasDeclaration(node: ParseTypeAliasDeclaration): any { return node; }
  visitTypeParameter(node: ParseTypeParameter): any { return node; }
  visitUnionType(node: ParseUnionType): any { return node; }
  visitValueType(node: ParseValueType): any { return node; }
  visitVariableStatement(node: ParseVariableStatement): any { return node; }
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
    console.log('visit return type form function Type: ', node)
    node.returnType = this.visit(node.returnType);
    return node;
  }

  visitGeneric(node: ParseGeneric): any {
    console.log('\n\nvisit Generinn')
    node.value = this.visit(node.value);
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

  visitVariableStatement(node: ParseVariableStatement): any {
    node.type = this.visit(node.type);
    return node;
  }

  visitResult(node: ParseResult): any {
    node.nodes = this.visitAll(node.nodes);
    return node;
  }
}

export class ReferenceTreeVisitor extends TreeVisitor implements AstVisitor {

  /**
   * Lookup Table for the Generics that are found in the tree
   * The outer map is a map where the key represents the filename
   * the value of this map is another map where the key represents the position
   * in the file where the generic ocurred and holds as value the generic symbol
   */
  lookupTable = new Map<string, Map<number, string>>();

  visitTypeAliasDeclaration(node: ParseTypeAliasDeclaration): any {
    if (node.typeParamter) {
      node.typeParamter.forEach((generic: ParseTypeParameter) =>
        this.addGenericToLookupTable(generic.location, generic.name));
    }
    node.type = this.visit(node.type);
    return node;
  }
  /**
   * Finds a Generic in the lookupTable
   */
  protected getGenericFromLookupTable(location: ParseLocation, value: string): string | undefined {
    const positionMap = this.lookupTable.get(location.path);

    // if the file is not in the position map return undefined
    if (!positionMap) {
      return;
    }

    const keys = Array.from(positionMap.keys())
      .filter(pos => pos < location.position && positionMap.get(pos) === value);

    // should not happen but if it does throw an error so we can handle it
    if (keys.length > 1) {
      log.error('Resolving Generics found two generics with the same name.');
    }
    // return the matching generic
    return positionMap.get(keys[0]);
  }

  private addGenericToLookupTable(location: ParseLocation, value: string): void {
    const file = this.lookupTable.get(location.path);

    // file key already exists so we need to append it.
    // to the existing position Map.
    if (file) {
      file.set(location.position, value);
      return;
    }
    // if there is no entry for this file create a file entry in the map
    // and add a new position map.
    const positionMap = new Map<number, string>();
    positionMap.set(location.position, value);
    this.lookupTable.set(location.path, positionMap);
  }
}
