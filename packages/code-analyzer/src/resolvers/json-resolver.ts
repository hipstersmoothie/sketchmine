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
  ParseVariableDeclaration,
  ParseClassDeclaration,
  ParseUnionType,
  ParseValueType,
  ParsePrimitiveType,
  ParseTypeLiteral,
  ParsePartialType,
  ParseNode,
  ParseDecorator,
  ParseObjectLiteral,
  ParseArrayLiteral,
  Primitives,
} from '../parsed-nodes';
import { Logger } from '@sketchmine/node-helpers';
import { flatten } from 'lodash';

const log = new Logger();


/**
 * @description
 * The object properties that should be used from the
 * `@Component` decorator of an angular component.
 */
const COMPONENT_DECORATOR_ITEMS = ['selector', 'exportAs', 'inputs'];

/**
 * @description
 * Resolve primitive values like booleans to true in case that
 * we need the possible variants and false would be default.
 */
function resolvePrimitiveType(nodeType: ParsePrimitiveType): string | null {
  switch (nodeType.type) {
    case Primitives.Boolean:
      return 'true';
    case Primitives.Null:
      return 'null';
    default:
      // don't resolve undefined we dont need the undefined state
      return null;
  }
}

/**
 * Generates the final JSON that is written to a file from the
 * generated AST.
 */
export class JSONResolver extends NullVisitor implements ParsedVisitor {

  /**
   * @description
   * returns a visited array of the literal values
   */
  visitArrayLiteral(node: ParseArrayLiteral): any {
    return this.visitAllWithParent(node.values, node);
  }

  /**
   * @description
   * Visits a class declaration and determines if it is an angular component
   * or just a normal es6 class.
   */
  visitClassDeclaration(node: ParseClassDeclaration): any {
    const members = this.visitAllWithParent(node.members, node);
    const extending = this.visitWithParent(node.extending, node);

    // if it is not an angular component we do not need the class information and
    // the decorator information we only want to know the extends and members
    // of this class
    if (!node.isAngularComponent()) {
      // return the members array merged with the extending
      return flatten([extending, ...members]);
    }

    const mergedMembers = flatten([extending, ...members]).filter(m => m !== undefined);

    return {
      name: node.name,
      angularComponent: node.isAngularComponent(),
      decorator: this.visitWithParent(node.decorators[0], node),
      members: mergedMembers,
    };
  }

  /**
   * @description
   * visits a decorator, when it is a component decorator on a class declaration
   * we know it is an angular component, otherwise we ignore it at the moment
   * can be used later on to identify host listeners for click events!
   */
  visitDecorator(node: ParseDecorator): any {
    if (
      node._parentNode &&
      node._parentNode.constructor === ParseClassDeclaration &&
      (node._parentNode as ParseClassDeclaration).isAngularComponent()
    ) {
      const properties = {};
      node.args.forEach((arg: ParseObjectLiteral) =>
        arg.properties.forEach((prop: ParseProperty) => {
          // if the
          if (COMPONENT_DECORATOR_ITEMS.includes(prop.name)) {
            properties[prop.name] = this.propertyVisitStrategy(prop);
          }
        }));
      return properties;
    }

    log.warning(`Only Decorators from Angular Components handled yet!\nNot from ${node._parentNode.constructor.name}`);
  }

  /**
   * @description
   * returns an array of the values from the properties.
   */
  visitObjectLiteral(node: ParseObjectLiteral): any {
    return this.visitAll(node.properties);
  }

  /**
   * @description
   * visits the extending reference and the members of an interface declaration.
   */
  visitInterfaceDeclaration(node: ParseInterfaceDeclaration): any {
    const members = this.visitAllWithParent(node.members, node);
    const extending = this.visitWithParent(node.extending, node);

    // TODO: lukas.holzer merge extends with members
    return members;
  }

  /**
   * @description
   * return a flattened array of the visited types of an intersection type.
   */
  visitIntersectionType(node: ParseIntersectionType): any {
    const types = this.visitAllWithParent(node.types, node);
    return flatten(types);
  }

  visitMethod(node: ParseMethod): any {
    const returnType = this.visitWithParent(node.returnType, node);

    if (
      node._parentNode &&
      node._parentNode.constructor !== ParseClassDeclaration
    ) {
      return returnType;
    }

    // TODO: lukas.holzer
    // it is a class member so maybe we need the parameters as well…
    // return {
    //   _class: 'ParseMethod',
    //   returnType,
    // };
  }

  /**
   * @description
   * returns a visited array of all values of a union type
   */
  visitUnionType(node: ParseUnionType): any {
    return this.visitAllWithParent(node.types, node);
  }

  visitProperty(node: ParseProperty): any {
    // we only want to parse @Input's of an Angular component
    // so when a property is a child of a class declaration we need to
    // check if it has an input decorator if it is not we can ignore it
    if (
      node._parentNode &&
      node._parentNode.constructor === ParseClassDeclaration &&
      !node.isAngularInput()) {
      return;
    }

    return {
      type: 'property',
      key: node.name,
      value: this.propertyVisitStrategy(node as ParseProperty),
    };
  }

  visitPrimitiveType(node: ParsePrimitiveType) {
    return resolvePrimitiveType(node);
  }

  visitTypeLiteral(node: ParseTypeLiteral) {
    return this.visitAllWithParent(node.members, node);
  }

  visitValueType(node: ParseValueType) {
    return node.value;
  }

  /**
   * @description
   * The visit result function is used to visit files. Every file has its ParseResult.
   * In case that we want to get the information from our angular components we can filter
   * all root nodes for class declarations and then for angular components.
   */
  visitResult(node: ParseResult): any[] {
    const rootNodes = node.nodes
      .filter(rootNode =>
        rootNode.constructor === ParseClassDeclaration &&
        (<ParseClassDeclaration>rootNode).isAngularComponent())
      .map(rootNode => this.visitWithParent(rootNode, node));
    return rootNodes;
  }

  /**
   * @description
   * returns the visited type of the type alias declaration.
   */
  visitTypeAliasDeclaration(node: ParseTypeAliasDeclaration): any {
    return this.visitWithParent(node.type, node);
  }

  /**
   * @description
   * returns the visited value of the variable declaration.
   */
  visitVariableDeclaration(node: ParseVariableDeclaration): any {
    return this.visitWithParent(node.value, node);
  }

  /**
   * @description
   * uses the visiting strategy `propertyVisitStrategy` to return the passed type or value.
   */
  visitGeneric(node: ParseGeneric): any {
    const constraint = this.visitWithParent(node.constraint, node);
    const value = this.propertyVisitStrategy(node as ParseGeneric);

    if (!!constraint) {
      flatten([constraint, value]);
    }

    return value;
  }

  /**
   * @description
   * Uses the visit function from the NullVisitor but modifies the node so that it
   * has an internal property `_parentNode` on it to identify later in which context
   * the node is used.
   */
  visitWithParent(node: ParseNode, parent: ParseNode): any {
    // if we have no node return undefined.
    if (!node) { return; }

    // add the internal _parentNode reference to the node itself.
    node._parentNode = parent;

    // call the visit function from the NullVisitor with the modified node.
    return super.visit(node);
  }

  /**
   * @description
   * Uses the same principles like the `visitAll` function from the NullVisitor,
   * with the only difference that it passes a parent node to the wrapping `visitWithParent` function.
   */
  visitAllWithParent(nodes: ParseNode[], parent: ParseNode): any {
    // if we have no nodes return an empty array like the `visitAll` function in the NullVisitor.
    if (!nodes) { return []; }

    return nodes.map((node: ParseNode) => {
      return this.visitWithParent(node, parent);
    });
  }

  /**
   * @description
   * this function is used to define a strategy how values and types should be handled
   * in case of which information should be prioritized. In case that we often have no type
   * but maybe the value can be used as type.
   */
  private propertyVisitStrategy(node: ParseProperty | ParseGeneric) {
    if (!!node.type) {
      return this.visitWithParent(node.type, node);
    }

    if (!!node.value) {
      return this.visitWithParent(node.value, node);
    }
  }
}
