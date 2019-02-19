import {
  TreeVisitor,
  ParsedVisitor,
  ParseValueType,
  ParseProperty,
  ParseUnionType,
  ParseType,
  ParsePrimitiveType,
  Primitives,
  ParseTypeAliasDeclaration,
} from '../parsed-nodes';
import { flatten } from 'lodash';
import { Logger } from '@sketchmine/node-helpers';

const log = new Logger();

/**
 * @class
 * @classdesc the Value resolver resolves all the values from the annotations and the types
 * furthermore it resolves some primitives like *boolean* to true, because properties can only be
 * applied (false would be without property).
 */
export class ValuesResolver extends TreeVisitor implements ParsedVisitor {
  visitProperty(node: ParseProperty) {
    return resolveTypeValues(node);
  }
}

/**
 * resolves the node in the value resolver
 * @param node Node to be resolved
 */
function resolveTypeValues(node: ParseProperty) {
  const values = new Set([node.value]);
  if (node.type) {
    const typeValues = resolveType(node.type)
      .filter((value: string | null) => value !== null)
      .forEach((value: string) => values.add(value));
  }

  if (values.size > 1) {
    log.error(`More than one values found @ValuesResolver for: \n${node.toString()}`);
  }

  node.value = Array.from(values)[0];
  return node;
}

/**
 * Resolve types to values recursively
 * @param nodeType Type to be resolved
 */
function resolveType(nodeType: ParseType): (string | null)[] {
  if (!nodeType) {
    log.error('ValuesResolver: resolveType() no nodeType Provided!');
    return [];
  }

  switch (nodeType.constructor) {
    case ParseValueType:
      const value = (nodeType as ParseValueType).value;
      return [typeof value === 'string' ? `\"${value}\"` : `${value}`];
    case ParsePrimitiveType:
      return [resolvePrimitiveType(nodeType as ParsePrimitiveType)];
    case ParseUnionType:
      const types = (nodeType as ParseUnionType).types.map(t => resolveType(t));
      return flatten(types);
    case ParseTypeAliasDeclaration:
      const aliasNode = resolveTypeValues(nodeType as ParseTypeAliasDeclaration);
      // return flatten(aliasNode.values);
      return aliasNode.value;
    default:
      return [];
  }
}

/**
 * Resolve primitives
 * @param nodeType Primitive Type to be resolved
 */
function resolvePrimitiveType(nodeType: ParsePrimitiveType): string | null {
  switch (nodeType.type) {
    case Primitives.Boolean:
      return 'true';
    // don't resolve undefined we dont need the undefined state
    // case Primitives.Undefined:
    //   return 'undefined';
    case Primitives.Null:
      return 'null';
  }
  return null;
}
