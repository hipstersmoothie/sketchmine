import {
  ParsedVisitor,
  ParseResult,
  ParseReferenceType,
  ParseDefinition,
  ParseEmpty,
  ParseNode,
  ParseTypeAliasDeclaration,
  ParseGeneric,
  ParseMethod,
  TreeVisitor,
  ParseLocation,
  ParseTypeParameter,
  ParseClassDeclaration,
  ParseInterfaceDeclaration,
} from '../parsed-nodes';

import { flatten } from 'lodash';

type typeParametersNode =
  | ParseClassDeclaration
  | ParseInterfaceDeclaration
  | ParseMethod
  | ParseTypeAliasDeclaration;

// tslint:disable: no-parameter-reassignment
export class GenericsResolver extends TreeVisitor implements ParsedVisitor {

  /**
   * Lookup Table for the Generics that are found in the tree
   * The outer map is a map where the key represents the filename
   * the value of this map is another map where the key represents the position
   * in the file where the generic ocurred and holds as value the generic symbol
   */
  lookupTable = new Map<string, Map<number, string>>();
  private rootNodes: ParseDefinition[];

  constructor(parseResults: ParseResult[]) {
    super();
    this.rootNodes = flatten(parseResults.map(result => result.nodes));
  }

  visitTypeAliasDeclaration(node: ParseTypeAliasDeclaration): any {
    node = this.collectGenerics(node);
    return super.visitTypeAliasDeclaration(node);
  }

  visitMethod(node: ParseMethod): any {
    node = this.collectGenerics(node);
    return super.visitMethod(node);
  }

  visitClassDeclaration(node: ParseClassDeclaration): any {
    node = this.collectGenerics(node);
    return super.visitClassDeclaration(node);
  }

  visitInterfaceDeclaration(node: ParseInterfaceDeclaration): any {
    node = this.collectGenerics(node);
    return super.visitInterfaceDeclaration(node);
  }

  visitReferenceType(node: ParseReferenceType) {
    console.log(node.name)

    return super.visitReferenceType(node);
  }

  visit(node: ParseNode | undefined) {
    if (node) {
      console.log('Visiting Node: ', node.constructor.name, (<any>node).name ? ` - ${(<any>node).name}` : '');
      // (<any>node).references = [];
      if ((<any>node).references) {
        console.log((<any>node).references)
      }
    }

    return super.visit(node);
  }

  /**
   * @description
   * Checks the typeParameters of a parsed node and
   * adds the generics to the lookup table.
   */
  private collectGenerics(node: typeParametersNode): any {
    const references = [];
    node.typeParameters.forEach((generic: ParseTypeParameter) => {
      const gen = new ParseGeneric(generic.name);
      if (generic.constraint) {
        (<any>gen). constraint = generic.constraint;
      }
      references.push(gen);

    });

    if (references.length) {
      (<any>node).references = references;
    }

    return node;
      // this.addGenericToLookupTable(generic.location, generic.name));
  }

  /**
   * @description
   * Adds a generic to the lookup table according to its file and the position
   */
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
