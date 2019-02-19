import {
  ParsedVisitor,
  TreeVisitor,
  ParseReferenceType,
  ParseDefinition,
  ParseResult,
  ParseClassDeclaration,
  ParseInterfaceDeclaration,
  ParseMethod,
  ParseEmpty,
  ParseTypeAliasDeclaration,
  ParseTypeParameter,
  ParseGeneric,
  ParseLocation,
  ParseNode,
  ParseExpression,
} from '../parsed-nodes';

import { flatten, cloneDeep } from 'lodash';

/**
 * @description
 * All parsed class types that can have typeParameters
 */
type typeParametersNode =
  | ParseClassDeclaration
  | ParseInterfaceDeclaration
  | ParseMethod
  | ParseTypeAliasDeclaration;

  /**
   * @class
   * @classdesc
   * The reference resolver is used to get the values of interfaces, type alias declarations
   * generics or methods and replace them with their place holding parse reference class.
   * The first lookup is always in a lookup table that stores all generics. These generics are
   * collected during the visiting process. If a reference type matches with a generic from the table
   * the reference (pointer to the object) is placed instead.
   */
export class ReferenceResolver extends TreeVisitor implements ParsedVisitor {

  /**
   * @description
   * Lookup Table for the Generics that are found in the tree
   * The outer map is a map where the key represents the filename
   * the value of this map is another map where the key represents the position
   * in the file where the generic ocurred and holds as value the generic symbol
   */
  lookupTable = new Map<string, Map<number, ParseGeneric>>();

  /**
   * @description
   * A collection of all rootNodes is used as second lookup table for the interfaces
   * and types. In case that an interface or type can only be defined in the root of a file.
   */
  private rootNodes: ParseDefinition[];

  constructor(parseResults: ParseResult[]) {
    super();
    this.rootNodes = flatten(parseResults.map(result => result.nodes));
  }

  visitTypeAliasDeclaration(node: ParseTypeAliasDeclaration): any {
    this.collectGenerics(node);
    return super.visitTypeAliasDeclaration(node);
  }

  visitMethod(node: ParseMethod): any {
    this.collectGenerics(node);
    return super.visitMethod(node);
  }

  visitClassDeclaration(node: ParseClassDeclaration): any {
    this.collectGenerics(node);
    return super.visitClassDeclaration(node);
  }

  visitInterfaceDeclaration(node: ParseInterfaceDeclaration): any {
    this.collectGenerics(node);
    return super.visitInterfaceDeclaration(node);
  }

  /**
   * @description
   * Overwrites the visitExpression method from the tree visitor. Try to find the matching
   * function declaration and pass the arguments in so that we get the returning value that can
   * be assigned to a variable declaration.
   */
  visitExpression(node: ParseExpression): any {
    const method = this.getRootNodeByName(node.name) as ParseMethod;

    if (!method) {
      return new ParseEmpty();
    }

    const cloned = cloneDeep(method) as ParseMethod;

    node.args = this.visitAll(node.args);

    node.args.forEach((arg, index: number) => {
      const param = cloned.parameters[index].type;

      switch (param.constructor) {
        case ParseGeneric:
          (param as ParseGeneric).value = arg;
          break;
        default:
          console.log('visiting Expression parameter constructor not handled yet!: ', param.constructor.name);
      }
    });
    return cloned;
  }

  /**
   * @description
   * Overwrites the visitReferenceType method from the tree visitor to resolve the ParseReferenceType.
   * It should result into a value from a generic, interface, class, type etc...
   * If it is not resolvable, in case that it comes from any node dependency that we don't want to parse
   * we result in returning the ParseEmpty class.
   */
  visitReferenceType(node: ParseReferenceType) {
    // Check if the reference is a generic and is stored in the lookup Table
    const generic = this.getGenericFromLookupTable(node);

    // if we have a generic replace it with the reference type
    if (generic) {
      return generic;
    }

    // If the reference is not in the lookup Table search it in the root nodes
    // So now we know it is not a generic and we can search in the types and interfaces
    // if there is a matching Symbol name
    const resolvedNode = this.getRootNodeByName(node.name) as typeParametersNode;

    // if there is no resolved node we have to return ParseEmpty so we know it cannot be resolved
    if (!resolvedNode) {
      return new ParseEmpty();
    }

    // if we have typeArguments it is a generic and we have to clone the resolvedNode
    // because maybe it is used by other declarations as well.
    // So we won't modify the original reference.
    const cloned = cloneDeep(resolvedNode) as unknown as typeParametersNode;

    // If we have typeArguments they have to be replaced with the arguments from the generic
    // after we replaced the generic type we can resolve the reference and replace the values
    if (node.typeArguments && node.typeArguments.length) {

      for (let i = 0, max = node.typeArguments.length; i < max; i += 1) {
        let typeArgument = node.typeArguments[0];

        // if the typeArgument is a reference type we have to resolve it
        // before we pass it into the generic
        if (typeArgument instanceof ParseReferenceType) {
          typeArgument = this.visitReferenceType(typeArgument);
        } else {
          console.log('Unsupported instance of typeArgument: ', typeArgument.constructor.name)
        }

        if (cloned.typeParameters) {
          const typeParameter = cloned.typeParameters[i] as ParseGeneric;
          typeParameter.value = typeArgument as ParseDefinition;
        }

      }
    }
    return cloned;
  }

  /**
   * @description
   * Find a root Node by its name – used to find types and interfaces
   */
  private getRootNodeByName(name: string): ParseDefinition {
    return this.rootNodes.find((node: ParseDefinition) => node.name === name);
  }

  /**
   * @description
   * Checks the typeParameters of a parsed node and
   * adds the generics to the lookup table.
   */
  private collectGenerics(node: typeParametersNode): void {
    node.typeParameters.forEach((generic: ParseTypeParameter, index: number) => {
      let constraint;

      if (generic.constraint) {
        constraint = this.visit(generic.constraint);
      }

      const location = generic.location;
      const gen = new ParseGeneric(location, generic.name, constraint);
      this.addGenericToLookupTable(generic.location, gen);
      node.typeParameters[index] = gen;
    });
  }

  /**
   * @description
   * Adds a generic to the lookup table according to its file and the position.
   * The position is always unique in a file – *(the character position)*
   */
  private addGenericToLookupTable(location: ParseLocation, value: ParseGeneric): void {
    const file = this.lookupTable.get(location.path);

    // file key already exists so we need to append it.
    // to the existing position Map.
    if (file) {
      file.set(location.position, value);
      return;
    }
    // if there is no entry for this file create a file entry in the map
    // and add a new position map.
    const positionMap = new Map<number, ParseGeneric>();
    positionMap.set(location.position, value);
    this.lookupTable.set(location.path, positionMap);
  }

  /**
   * @description
   * Finds the parent generic in the lookup table according to the provided position of the
   * node. The parent generic is always the generic with the same name that has the closest position
   * number related to the nodes position. If undefined is returned it is not a generic and we can assume
   * that it is a type reference (interface, class or type).
   */
  protected getGenericFromLookupTable(node: ParseReferenceType): ParseGeneric | undefined {
    const location = node.location;
    const value = node.name;

    const positionMap = this.lookupTable.get(location.path);

    // if the file is not in the position map return undefined
    if (!positionMap) {
      return;
    }

    // find the position of the parent generic
    const genericPosition = Array.from(positionMap.keys())
      // sort table descending to find the first smaller number
      .sort((a: number, b: number) => b - a)
      // find the next smaller position to identify the parent generic
      .find((pos: number) =>
        pos < location.position &&
        positionMap.get(pos).name === value);

    return positionMap.get(genericPosition) || undefined;
  }

}
