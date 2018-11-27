import {
  TreeVisitor,
  AstVisitor,
  ParseValueType,
  ParseProperty,
  ParseUnionType,
  ParseType,
  ParsePrimitiveType,
  Primitives,
  ParseTypeAliasDeclaration,
} from './ast';
import { arrayFlatten } from '@utils';

/**
 * @class
 * @classdesc the Value resolver resolves all the values from the annotations and the types
 * furthermore it resolves some primitives like *boolean* to true, because properties can only be
 * applied (false would be without property).
 */
export class ValuesResolver extends TreeVisitor implements AstVisitor {
  visitProperty(node: ParseProperty) {
    return resolveTypeValues(node);
  }
}

/**
 * resolves the node in the value resolver
 * @param node Node to be resolved
 */
function resolveTypeValues(node: ParseProperty) {
  const values = new Set(node.values);
  if (node.type) {
    const typeValues = resolveType(node.type);
    typeValues.filter(v => v !== null).forEach(v => values.add(v));
  }
  node.values = Array.from(values);
  return node;
}

/**
 * Resolve types to values recursivly
 * @param nodeType Type to be resolved
 */
function resolveType(nodeType: ParseType): (string | null)[] {
  switch (nodeType.constructor) {
    case ParseValueType:
      const value = (nodeType as ParseValueType).value;
      return [typeof value === 'string' ? `\"${value}\"` : `${value}`];
    case ParsePrimitiveType:
      return [resolvePrimitiveType(nodeType as ParsePrimitiveType)];
    case ParseUnionType:
      return arrayFlatten((nodeType as ParseUnionType).types.map(t => resolveType(t)));
    case ParseTypeAliasDeclaration:
      const aliasNode = resolveTypeValues(nodeType as ParseTypeAliasDeclaration);
      return arrayFlatten(aliasNode.values);
    default:
      return [];
  }
}

/**
 * Resolve primitives
 * @param nodeType Primitve Type to be resolved
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
