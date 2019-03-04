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
  ParseExpression,
} from '../parsed-nodes';
import { flatten, cloneDeep, clone } from 'lodash';
import { Logger } from '@sketchmine/node-helpers';
import { resolveModuleFilename } from '../utils';

const log = new Logger();

/**
 * @description
 * Delivers the module file path for a named import specifier in a file.
 * for example `import { a } from 'b.ts'` would return `b.ts` if you pass a.
 * If the import specifier set has a length of zero we know everything is exported
 * or imported so we will return the path as well
 */
function getModuleNameForImportSpecifier(referenceName: string, result: ParseResult): string | undefined {

  for (let i = 0, max = result.dependencyPaths.length; i < max; i += 1) {
    const dependency = result.dependencyPaths[i];
    // if the dependencies value has a size of 0 then it is an export specifier with a star.
    // that means if it was specified but with a length of 0 we export everything so return the path in
    // in this condition.
    if (dependency.values.has(referenceName) || dependency.values.size === 0) {
      return dependency.path;
    }
  }
}

/**
 * @description
 * This method is used to gather an expression or declaration for the matching *referenced node*
 * So this function will look at first for the root nodes in the current file if there is a declaration or
 * method that matches the name and if there is no it will take a look at the imports if an import was found with
 * this name in the specifiers array it will check the root nodes again with a recursive call until a node was found
 * or no import specifiers are there anymore.
 * @param referencedNode The reference node where the matching declaration has to be searched.
 * @param parsedResults All parsed pages where we have to find the declaration
 * @param currentFileName the file name (used as index for the results) for the current file
 */
function getReferencedDeclarations(
  referencedNode: ParseExpression | ParseReferenceType,
  parsedResults: Map<string, ParseResult>,
  currentFileName: string,
): ParseDefinition[] {

  if (!currentFileName) {
    return [];
  }
  // get the result of the current file
  const currentFile = parsedResults.get(currentFileName);
  // check the root nodes for the node with the same name
  const rootNodes = currentFile.nodes
    .filter((node: ParseDefinition) => node.name === referencedNode.name);

  if (rootNodes.length) {
    return rootNodes;
  }

  const modulePath = getModuleNameForImportSpecifier(referencedNode.name, currentFile);

  // if the module path is undefined we cannot resolve the reference so return undefined
  if (!modulePath) {
    return [];
  }

  // resolve the module path to a file on the disk
  const resolvedModulePath = resolveModuleFilename(modulePath);
  // recursive call to go through all the files to gather the imported declaration
  return getReferencedDeclarations(referencedNode, parsedResults, resolvedModulePath);
}

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

  private currentFileName: string;

  /**
   * @description
   * A collection of all rootNodes is used as second lookup table for the interfaces
   * and types. In case that an interface or type can only be defined in the root of a file.
   */
  private rootNodes: ParseDefinition[];

  constructor(public parsedResults: Map<string, ParseResult>) {
    super();
  }

  /**
   * @description
   * Overrides the visitResult from the tree visitor to gather the current file name.
   */
  visitResult(node: ParseResult): any {
    this.currentFileName = node.location.path;
    return super.visitResult(node);
  }

  visit(node: any): any {
    // Node that was visited from the ReferenceResolver has the visited
    // property – so that we know if we have to visit it or not when we collectGenerics
    // a node from the root nodes
    if (node) { node._visited = true; }
    return super.visit(node);
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
    const method = this.getRootNodeByName(node) as ParseMethod;

    if (!method) {
      return new ParseEmpty();
    }
    // We need to check if we have typeArguments, and when we have some, we have
    // to pass it through the typeParameters of the matching `typeParametersNode`
    const cloned = this.passTypeArguments(node, method);

    if (!cloned) {
      return new ParseEmpty();
    }

    // we have to visit the arguments so that we can pass the values to the
    // matching function declaration instead only passing some reference.
    node.args = this.visitAll(node.args);

    node.args.forEach((arg, i: number) => {
      if (!cloned.parameters[i]) {
        log.error(
          `When resolving the expression ${node.name} – ` +
          'a problem occurred, the found parameters did not match the provided ones!');
      }
      const param = cloned.parameters[i].type;

      if (param && param.constructor.name === 'ParseGeneric') {
        (param as ParseGeneric).value = arg;
      } else {
        cloned.parameters[i] = arg as any;
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
    const resolvedNode = this.getRootNodeByName(node) as typeParametersNode;

    // if there is no resolved node we have to return ParseEmpty so we know it cannot be resolved
    if (!resolvedNode) {
      return new ParseEmpty();
    }

    // We need to check if we have typeArguments, and when we have some, we have
    // to pass it through the typeParameters of the matching `typeParametersNode`
    return this.passTypeArguments(node, resolvedNode);
  }

  /**
   * @description
   * Passes the typeArguments to the found resolvedNode and returns
   * the resulting node with the typeArguments from the reference node or expression
  */
  private passTypeArguments<T extends typeParametersNode>(
    node: ParseReferenceType | ParseExpression,
    resolvedNode: T,
  ): T {

    // if we have typeArguments it is a generic and we have to clone the resolvedNode
    // because maybe it is used by other declarations as well.
    // So we won't modify the original reference.
    const cloned = cloneDeep(resolvedNode) as T;

    // If we have typeArguments they have to be replaced with the arguments from the generic
    // after we replaced the generic type we can resolve the reference and replace the values
    if (node.typeArguments && node.typeArguments.length) {

      for (let i = 0, max = node.typeArguments.length; i < max; i += 1) {
        let typeArgument = node.typeArguments[i];

        // if the typeArgument is a reference type we have to resolve it
        // before we pass it into the generic.
        // to limit our selfs not only to reference types we can call the generic
        // visit function of the typeArgument so it does not matter which class it is!
        typeArgument = typeArgument.visit(this);

        if (cloned.typeParameters && cloned.typeParameters[i]) {
          (cloned.typeParameters[i] as ParseGeneric).type = typeArgument as ParseDefinition;
        }

      }
    }
    return cloned;
  }

  /**
   * @description
   * This function is used to find the matching function overload for a call expressions
   * @param node the node that is calling the method
   * @param overloads the available overloads
   */
  private findMatchingFunctionOverload(node: ParseExpression, overloads: ParseMethod[]) {
    let foundOverload: ParseMethod = overloads[0];

    for (let i = 0, max = overloads.length; i < max; i += 1) {
      const method = overloads[i];
      // filter the required parameters out of the function parameters
      const requiredParameters = method.parameters.filter(param => !param.isOptional);

      // to find the matching overload the amount of typeParameters has to match the typeArguments
      // length that is provided from the node, then the amount of the provided arguments has to be
      // greater or equal than the amount of the required parameters but less or equal the maximum amount of parameters
      if (
        node.typeArguments.length === method.typeParameters.length &&
        node.args.length >= requiredParameters.length &&
        node.args.length <= method.parameters.length
      ) {
        foundOverload = method;
      }
    }
    return foundOverload;
  }

  /**
   * @description
   * Find the matching expression or declaration for a reference type or
   * expression call. In case there would be a function overload we have to check the
   * type parameter length and the argument length to match the correct overload.
   * @param referencedNode The reference that should be resolved either a reference type or an expression
   */
  private getRootNodeByName(referencedNode: ParseExpression | ParseReferenceType): ParseDefinition | undefined {

    // TODO: major: lukas.holzer build check if rootNode is not parent node,
    // otherwise we would get a circular structure that is causing a memory leak!
    const rootNodes = getReferencedDeclarations(referencedNode, this.parsedResults, this.currentFileName);

    // if we could not find any root node for the referenceNode we cannot resolve
    // this type or expression
    if (rootNodes.length < 1) {
      return;
    }

    let rootNode = rootNodes[0];

    // if we have more than one matching rootNode we have to check if it is an expression
    // and then we have to choose the matching overload
    if (rootNodes.length > 1 && referencedNode.constructor === ParseExpression) {
      // filter out the methods to be sure we have an overload
      const methods = rootNodes.filter(n => n.constructor === ParseMethod) as ParseMethod[];
      rootNode = this.findMatchingFunctionOverload(referencedNode as ParseExpression, methods);
    }

    if (!rootNode.hasOwnProperty('_visited') || (<any>rootNode)._visited !== true) {
      // if the node was not visited yet we have to visit the root node first
      // before we are returning it!
      return rootNode.visit(this);
    }
    // rootNode was visited and we can pass it!
    return rootNode;
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
