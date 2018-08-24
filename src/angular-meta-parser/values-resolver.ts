import {
  TreeVisitor,
  AstVisitor,
  ParseResult,
  ParseReferenceType,
  ParseDefinition,
  ParseValueType,
  ParseProperty,
  ParseUnionType,
  ParseType,
  ParsePrimitiveType,
  Primitives,
  ParseTypeAliasDeclaration,
} from './ast';
import { arrayFlatten } from '@utils';

export class ValuesResolver extends TreeVisitor implements AstVisitor {
  visitProperty(node: ParseProperty) {
    return resolveTypeValues(node);
  }
}

function resolveTypeValues(node: ParseProperty) {
  const values = new Set(node.values);
  if (node.type) {
    const typeValues = resolveType(node.type);
    typeValues.filter(v => v !== null).forEach(v => values.add(v));
  }
  node.values = Array.from(values);
  return node;
}

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

function resolvePrimitiveType(nodeType: ParsePrimitiveType): string | null {
  switch (nodeType.type) {
    case Primitives.Boolean:
      return 'true';
    case Primitives.Undefined:
      return 'undefined';
    case Primitives.Null:
      return 'null';
  }
  return null;
}
