import {
  ParsePrimitiveType,
  ParseValueType,
  ParseVariableDeclaration,
  ParseEmpty,
  ParseUnionType,
  ParseTypeAliasDeclaration,
  ParseReferenceType,
  ParseMethod,
  ParseArrayType,
  ParseParenthesizedType,
  ParseTypeParameter,
} from '../../src/v2/parsed-nodes';
import { getResult } from './get-result';
import { NodeTags } from '../../src/v2/util';

describe('ParseTypeAliasDeclaration', () => {

  test('detecting types', () => {
    const interfaceSource = 'type t = "abc"';
    const result = getResult(interfaceSource).nodes;
    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(ParseTypeAliasDeclaration);
  });

  test('type has an explicit value type', () => {
    const interfaceSource = 'type myType = "abc"';
    const result = getResult(interfaceSource).nodes[0] as ParseTypeAliasDeclaration;
    expect(result.tags).toHaveLength(0);
    expect(result.name).toBe('myType');
    expect(result.type).toBeInstanceOf(ParseValueType);
    expect(result.value).toBeUndefined();
    expect(result.typeParameters).toHaveLength(0);
    expect((result.type as ParseValueType).value).toMatch(/abc/);
  });

  test('type is an explicit false keyword', () => {
    const interfaceSource = 'type myType = false';
    const result = getResult(interfaceSource).nodes[0] as ParseTypeAliasDeclaration;
    expect(result.type).toBeInstanceOf(ParseValueType);
    expect((result.type as ParseValueType).value).toBe(false);
  });

  test('type is an explicit true keyword', () => {
    const interfaceSource = 'type myType = true';
    const result = getResult(interfaceSource).nodes[0] as ParseTypeAliasDeclaration;
    expect(result.type).toBeInstanceOf(ParseValueType);
    expect((result.type as ParseValueType).value).toBe(true);
  });

  test('type is an explicit number value', () => {
    const interfaceSource = 'type myType = 100';
    const result = getResult(interfaceSource).nodes[0] as ParseTypeAliasDeclaration;
    expect(result.type).toBeInstanceOf(ParseValueType);
    expect((result.type as ParseValueType).value).toBe(100);
  });

  test('type is a primitive boolean type', () => {
    const interfaceSource = 'type myType = boolean';
    const result = getResult(interfaceSource).nodes[0] as ParseTypeAliasDeclaration;
    expect(result.type).toBeInstanceOf(ParsePrimitiveType);
    expect((result.type as ParsePrimitiveType).type).toBe('boolean');
  });

  test('type is a primitive string type', () => {
    const interfaceSource = 'type myType = string';
    const result = getResult(interfaceSource).nodes[0] as ParseTypeAliasDeclaration;
    expect(result.type).toBeInstanceOf(ParsePrimitiveType);
    expect((result.type as ParsePrimitiveType).type).toBe('string');
  });

  test('type is a primitive number type', () => {
    const interfaceSource = 'type myType = number';
    const result = getResult(interfaceSource).nodes[0] as ParseTypeAliasDeclaration;
    expect(result.type).toBeInstanceOf(ParsePrimitiveType);
    expect((result.type as ParsePrimitiveType).type).toBe('number');
  });

  test('type is a primitive undefined type', () => {
    const interfaceSource = 'type myType = undefined';
    const result = getResult(interfaceSource).nodes[0] as ParseTypeAliasDeclaration;
    expect(result.type).toBeInstanceOf(ParsePrimitiveType);
    expect((result.type as ParsePrimitiveType).type).toBe('undefined');
  });

  test('type is a primitive null type', () => {
    const interfaceSource = 'type myType = null';
    const result = getResult(interfaceSource).nodes[0] as ParseTypeAliasDeclaration;
    expect(result.type).toBeInstanceOf(ParsePrimitiveType);
    expect((result.type as ParsePrimitiveType).type).toBe('null');
  });

  test('type is a reference type', () => {
    const interfaceSource = 'type myType = Reference';
    const result = getResult(interfaceSource).nodes[0] as ParseTypeAliasDeclaration;
    expect(result.type).toBeInstanceOf(ParseReferenceType);
    expect((result.type as ParseReferenceType).name).toBe('Reference');
  });

  test('type is an array type of types number', () => {
    const interfaceSource = 'type myType = number[]';
    const result = getResult(interfaceSource).nodes[0] as ParseTypeAliasDeclaration;
    expect(result.type).toBeInstanceOf(ParseArrayType);
    expect((result.type as ParseArrayType).type).toBeInstanceOf(ParsePrimitiveType);
    expect((result.type as any).type.type).toBe('number');
  });

  test('type is an array type of types number or string', () => {
    const interfaceSource = 'type myType = (number | string)[]';
    const result = getResult(interfaceSource).nodes[0] as ParseTypeAliasDeclaration;
    expect(result.type).toBeInstanceOf(ParseArrayType);
    expect((result.type as ParseArrayType).type).toBeInstanceOf(ParseParenthesizedType);
    expect((result.type as any).type.type).toBeInstanceOf(ParseUnionType);
    expect((result.type as any).type.type.types[0]).toBeInstanceOf(ParsePrimitiveType);
    expect((result.type as any).type.type.types[0].type).toBe('number');
    expect((result.type as any).type.type.types[1]).toBeInstanceOf(ParsePrimitiveType);
    expect((result.type as any).type.type.types[1].type).toBe('string');
  });

  test('type is a union type', () => {
    const interfaceSource = 'type myType = "abc" | "cde"';
    const result = getResult(interfaceSource).nodes[0] as ParseTypeAliasDeclaration;
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
    const interfaceSource = 'type myType = () => boolean';
    const result = getResult(interfaceSource).nodes[0] as ParseTypeAliasDeclaration;
    expect(result.type).toBeInstanceOf(ParseMethod);
    expect((result.type as ParseMethod).returnType).toBeInstanceOf(ParsePrimitiveType);
    expect((result.type as any).returnType.type).toBe('boolean');
    expect((result.type as any).parameters).toHaveLength(0);
    expect((result.type as any).typeParameters).toHaveLength(0);
  });

  test('type is a method with a generic return type', () => {
    const interfaceSource = 'type test<T> = () => T';
    const result = getResult(interfaceSource).nodes[0] as ParseTypeAliasDeclaration;
    expect(result.type).toBeInstanceOf(ParseMethod);
    expect((result.type as ParseMethod).returnType).toBeInstanceOf(ParseReferenceType);
    expect((result.type as any).returnType.name).toBe('T');
    expect((result.type as any).parameters).toHaveLength(0);
    expect(result.typeParameters).toHaveLength(1);
  });

  test('type has three different typeParameters', () => {
    const interfaceSource = 'type test<T, P, C> = () => T';
    const result = getResult(interfaceSource).nodes[0] as ParseTypeAliasDeclaration;
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
    const interfaceSource = 'export type myType = number | string';
    const result = getResult(interfaceSource).nodes[0] as ParseTypeAliasDeclaration;
    expect(result.tags).toHaveLength(1);
    expect(result.tags[0]).toBe('exported');
  });

  test('type has multiple keywords', () => {
    const interfaceSource = '/** @internal */type _myType = number | string';
    const result = getResult(interfaceSource).nodes[0] as ParseTypeAliasDeclaration;
    expect(result.tags).toHaveLength(2);
    expect(result.tags).toEqual(
      expect.arrayContaining(['internal', 'hasUnderscore'] as NodeTags[]),
    );
  });
});
