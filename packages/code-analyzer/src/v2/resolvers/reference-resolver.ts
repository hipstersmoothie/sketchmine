import {
  ParsedVisitor,
  ParseResult,
  ParseReferenceType,
  ParseDefinition,
  ParseEmpty,
  ReferenceTreeVisitor,
  ParseNode,
  ParseTypeAliasDeclaration,
  ParseGeneric,
} from '../parsed-nodes';

import { flatten } from 'lodash';
import { Logger } from '@sketchmine/node-helpers';
const log = new Logger();

export const FOUND_TO_EQUAL_GENERICS_ERROR = 'Resolving Generics found two generics with the same name!';

/**
 * @class
 * @classdesc Transformer that resolves the references in the AST
 * @implements AstVisitor
 * @extends ReferenceTreeVisitor
 */
export class ReferenceResolver extends ReferenceTreeVisitor implements ParsedVisitor {

  private rootNodes: ParseDefinition[];

  constructor(parseResults: ParseResult[]) {
    super();
    this.rootNodes = flatten(parseResults.map(result => result.nodes));
  }

  /**
   * Overwrites the visitReferenceType method from the ReferenceTreeVisitor to resolve the types
   * if it could not be resolved return the ParseEmpty() node.
   * @param {ParseReferenceType} node Reference node that should be resolved
   * @returns {ParseDefinition | ParseEmpty}
   */
  visitReferenceType(node: ParseReferenceType): ParseDefinition | ParseEmpty {
    // Check if the reference is a generic and is stored in the lookup Table
    const typeParameter = this.getGenericFromLookupTable(node);

    // if we have a type parameter then it is a generic
    if (typeParameter) {
      const rootNode = this.getParentRootNode(node) as ParseTypeAliasDeclaration;
      const generic = new ParseGeneric(typeParameter);

      // get the index of the typeParamter in the root nodes typeParameter array
      const index = rootNode.typeParameters.findIndex(param => param.name === typeParameter);
      // replace the typeParameter with the generic placeholder (reference storage)
      rootNode.typeParameters[index] = generic;

      // Return the reference of the Generic so that we can replace it later on by reference
      // on the rootNode and the reference to the inner get replaced as well.
      return generic;
    }

    // If the reference is not in the lookup Table search it in the root nodes
    // So now we know it is not a generic and we can search in the types and interfaces
    // if there is a matching Symbol name
    const resolvedNode = this.getRootNodeByName(node.name);

    // If we have typeArguments they have to be replaced with the arguments from the generic
    // after we replaced the generic type we can resolve the reference and replace the values
    if (
      resolvedNode &&
      node.typeArguments &&
      node.typeArguments.length
    ) {

      // if we have typeArguments it is a generic and we have to clone the resolvedNode
      // because maybe it is used by other declarations as well.
      // So we won't modify the original reference.
      // const cloned = cloneDeep(resolvedNode)

      for (let i = 0, max = node.typeArguments.length; i < max; i += 1) {
        let typeArgument = node.typeArguments[0];

        // if the typeArgument is a reference type we have to resolve it
        // before we pass it into the generic
        if (typeArgument instanceof ParseReferenceType) {
          typeArgument = this.visitReferenceType(typeArgument);
        }

        // TODO: lukas.holzer check later for better typing and
        // try to figure out which node types can have type parameters
        if (resolvedNode.hasOwnProperty('typeParameters')) {
          (<any>resolvedNode).typeParameters[i].value = typeArgument;
        }
      }
    }

    // if there are no TypeArguments it is a normal interface or type and we can replace
    // the reference type with the found ParseDefinition from the root and return it.
    // if we did not found any reference in the root nodes we can not resolve it and
    // the value will be a parse empty that will be dropped later on.
    return resolvedNode || new ParseEmpty();
  }

  /** Find a root Node by its name – used to find types and interfaces */
  private getRootNodeByName(name: string): ParseDefinition {
    return this.rootNodes.find((node: ParseDefinition) => node.name === name);
  }
    /**
   * Finds a Generic in the lookupTable
   */
  protected getGenericFromLookupTable(node: ParseReferenceType): string | undefined {
    const parent = this.getParentRootNode(node);
    const location = node.location;
    const value = node.name;

    const positionMap = this.lookupTable.get(location.path);

    // if the file is not in the position map return undefined
    if (!positionMap) {
      return;
    }

    const keys = Array.from(positionMap.keys())
      .filter(pos =>
          pos > parent.location.position &&
          pos < location.position &&
          positionMap.get(pos) === value);

    // should not happen but if it does throw an error so we can handle it
    if (keys.length > 1) {
      throw Error(FOUND_TO_EQUAL_GENERICS_ERROR);
    }
    // return the matching generic
    return positionMap.get(keys[0]);
  }

  /**
   * The parent root Node is the root node with the position that is smaller
   * and the closest number to the position of the child Node.
   */
  protected getParentRootNode(node: ParseNode): ParseNode {
    const nodes = this.rootNodes
      .filter(rootNode => rootNode.location.position < node.location.position)
      .reverse();
    return nodes[0];
  }

}
