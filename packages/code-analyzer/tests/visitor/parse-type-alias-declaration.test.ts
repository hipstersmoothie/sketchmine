import {
  ParsePrimitiveType,
  ParseValueType,
  ParseUnionType,
  ParseTypeAliasDeclaration,
  ParseReferenceType,
  ParseMethod,
  ParseArrayType,
  ParseParenthesizedType,
  ParseTypeParameter,
  NodeTags,
} from '../../src';
import { getParsedResult } from '../helpers';

describe('[code-analyzer] › ParseTypeAliasDeclaration', () => {

  test('detecting types', () => {
    const source = 'type t = "abc"';
    const result = getParsedResult(source).nodes;
    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(ParseTypeAliasDeclaration);
  });

  test('type has an explicit value type', () => {
    const source = 'type myType = "abc"';
    const result = getParsedResult(source).nodes[0] as ParseTypeAliasDeclaration;
    expect(result.tags).toHaveLength(0);
    expect(result.name).toBe('myType');
    expect(result.type).toBeInstanceOf(ParseValueType);
    expect(result.value).toBeUndefined();
    expect(result.typeParameters).toHaveLength(0);
    expect((result.type as ParseValueType).value).toMatch(/abc/);
  });

  test('type is an explicit false keyword', () => {
    const source = 'type myType = false';
    const result = getParsedResult(source).nodes[0] as ParseTypeAliasDeclaration;
    expect(result.type).toBeInstanceOf(ParseValueType);
    expect((result.type as ParseValueType).value).toBe(false);
  });

  test('type is an explicit true keyword', () => {
    const source = 'type myType = true';
    const result = getParsedResult(source).nodes[0] as ParseTypeAliasDeclaration;
    expect(result.type).toBeInstanceOf(ParseValueType);
    expect((result.type as ParseValueType).value).toBe(true);
  });

  test('type is an explicit number value', () => {
    const source = 'type myType = 100';
    const result = getParsedResult(source).nodes[0] as ParseTypeAliasDeclaration;
    expect(result.type).toBeInstanceOf(ParseValueType);
    expect((result.type as ParseValueType).value).toBe(100);
  });

  test('type is a primitive boolean type', () => {
    const source = 'type myType = boolean';
    const result = getParsedResult(source).nodes[0] as ParseTypeAliasDeclaration;
    expect(result.type).toBeInstanceOf(ParsePrimitiveType);
    expect((result.type as ParsePrimitiveType).type).toBe('boolean');
  });

  test('type is a primitive string type', () => {
    const source = 'type myType = string';
    const result = getParsedResult(source).nodes[0] as ParseTypeAliasDeclaration;
    expect(result.type).toBeInstanceOf(ParsePrimitiveType);
    expect((result.type as ParsePrimitiveType).type).toBe('string');
  });

  test('type is a primitive number type', () => {
    const source = 'type myType = number';
    const result = getParsedResult(source).nodes[0] as ParseTypeAliasDeclaration;
    expect(result.type).toBeInstanceOf(ParsePrimitiveType);
    expect((result.type as ParsePrimitiveType).type).toBe('number');
  });

  test('type is a primitive undefined type', () => {
    const source = 'type myType = undefined';
    const result = getParsedResult(source).nodes[0] as ParseTypeAliasDeclaration;
    expect(result.type).toBeInstanceOf(ParsePrimitiveType);
    expect((result.type as ParsePrimitiveType).type).toBe('undefined');
  });

  test('type is a primitive null type', () => {
    const source = 'type myType = null';
    const result = getParsedResult(source).nodes[0] as ParseTypeAliasDeclaration;
    expect(result.type).toBeInstanceOf(ParsePrimitiveType);
    expect((result.type as ParsePrimitiveType).type).toBe('null');
  });

  test('type is a reference type', () => {
    const source = 'type myType = Reference';
    const result = getParsedResult(source).nodes[0] as ParseTypeAliasDeclaration;
    expect(result.type).toBeInstanceOf(ParseReferenceType);
    expect((result.type as ParseReferenceType).name).toBe('Reference');
  });

  test('type is an array type of types number', () => {
    const source = 'type myType = number[]';
    const result = getParsedResult(source).nodes[0] as ParseTypeAliasDeclaration;
    expect(result.type).toBeInstanceOf(ParseArrayType);
    expect((result.type as ParseArrayType).type).toBeInstanceOf(ParsePrimitiveType);
    expect((result.type as any).type.type).toBe('number');
  });

  test('type is an array type of types number or string', () => {
    const source = 'type myType = (number | string)[]';
    const result = getParsedResult(source).nodes[0] as ParseTypeAliasDeclaration;
    expect(result.type).toBeInstanceOf(ParseArrayType);
    expect((result.type as ParseArrayType).type).toBeInstanceOf(ParseParenthesizedType);
    expect((result.type as any).type.type).toBeInstanceOf(ParseUnionType);
    expect((result.type as any).type.type.types[0]).toBeInstanceOf(ParsePrimitiveType);
    expect((result.type as any).type.type.types[0].type).toBe('number');
    expect((result.type as any).type.type.types[1]).toBeInstanceOf(ParsePrimitiveType);
    expect((result.type as any).type.type.types[1].type).toBe('string');
  });

  test('type is a union type', () => {
    const source = 'type myType = "abc" | "cde"';
    const result = getParsedResult(source).nodes[0] as ParseTypeAliasDeclaration;
    expect(result.name).toBe('myType');
    expect(result.type).toBeInstanceOf(ParseUnionType);
    expect(result.value).toBeUndefined();
    expect(result.typeParameters).toHaveLength(0);
    expect((result.type as ParseUnionType).types).toHaveLength(2);
    expect((result as any).type.types[0]).toBeInstanceOf(ParseValueType);
    expect((result as any).type.types[0].value).toMatch(/abc/);
    expect((result as any).type.types[1]).toBeInstanceOf(ParseValueType);
    expect((result as any).type.types[1].value).toMatch(/cde/);
  });

  test('type is a method with a return type', () => {
    const source = 'type myType = () => boolean';
    const result = getParsedResult(source).nodes[0] as ParseTypeAliasDeclaration;
    expect(result.type).toBeInstanceOf(ParseMethod);
    expect((result.type as ParseMethod).returnType).toBeInstanceOf(ParsePrimitiveType);
    expect((result.type as any).returnType.type).toBe('boolean');
    expect((result.type as any).parameters).toHaveLength(0);
    expect((result.type as any).typeParameters).toHaveLength(0);
  });

  test('type is a method with a generic return type', () => {
    const source = 'type test<T> = () => T';
    const result = getParsedResult(source).nodes[0] as ParseTypeAliasDeclaration;
    expect(result.type).toBeInstanceOf(ParseMethod);
    expect((result.type as ParseMethod).returnType).toBeInstanceOf(ParseReferenceType);
    expect((result.type as any).returnType.name).toBe('T');
    expect((result.type as any).parameters).toHaveLength(0);
    expect(result.typeParameters).toHaveLength(1);
  });

  test('type has three different typeParameters', () => {
    const source = 'type test<T, P, C> = () => T';
    const result = getParsedResult(source).nodes[0] as ParseTypeAliasDeclaration;
    expect(result.type).toBeInstanceOf(ParseMethod);
    expect((result.type as ParseMethod).returnType).toBeInstanceOf(ParseReferenceType);
    expect((result.type as any).returnType.name).toBe('T');
    expect((result.type as any).parameters).toHaveLength(0);
    expect(result.typeParameters).toHaveLength(3);
    expect(result.typeParameters[0]).toBeInstanceOf(ParseTypeParameter);
    expect(result.typeParameters[0].name).toBe('T');
    expect(result.typeParameters[1].name).toBe('P');
    expect(result.typeParameters[2].name).toBe('C');
  });

  test('type has an export keyword', () => {
    const source = 'export type myType = number | string';
    const result = getParsedResult(source).nodes[0] as ParseTypeAliasDeclaration;
    expect(result.tags).toHaveLength(1);
    expect(result.tags[0]).toBe('exported');
  });

  test('type has multiple keywords', () => {
    const source = '/** @internal */type _myType = number | string';
    const result = getParsedResult(source).nodes[0] as ParseTypeAliasDeclaration;
    expect(result.tags).toHaveLength(2);
    expect(result.tags).toEqual(
      expect.arrayContaining(['internal', 'hasUnderscore'] as NodeTags[]),
    );
  });
});
