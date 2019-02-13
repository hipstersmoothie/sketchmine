import {
  ParseResult,
  ParseInterfaceDeclaration,
  ParseLocation,
  ParseProperty,
  ParsePrimitiveType,
  ParseMethod,
  ParseTypeParameter,
  ParseReferenceType,
  ParseTypeLiteral,
  ParseIndexSignature,
  ParseValueType,
  ParseClassDeclaration,
} from '../../src/v2/parsed-nodes';
import { getResult } from './get-result';

describe('ParseClassDeclaration', () => {

  test('detecting classes', () => {
    const source = 'class Test {}';
    const result = getResult(source).nodes[0];
    expect(result).toBeInstanceOf(ParseClassDeclaration);
    expect(result.tags).toHaveLength(0);
    expect(result.name).toBe('Test');
    expect((<ParseClassDeclaration>result).members).toHaveLength(0);
    expect(result.location).toBeInstanceOf(ParseLocation);
  });

  test('class has multiple members', () => {
    const source = 'class Test { a: number; private b: string = "my-value"; }';
    const result = getResult(source).nodes[0];
    expect(result).toBeInstanceOf(ParseClassDeclaration);
    expect(result.tags).toHaveLength(0);
    const members = (<ParseClassDeclaration>result).members;
    expect(members).toHaveLength(2);
    expect((members[0].type as ParsePrimitiveType).type).toBe('number');
    expect((members[0].type as any).type.value).toBeUndefined();
    expect((members[1].type as ParsePrimitiveType).type).toBe('string');
    expect(members[1].tags).toHaveLength(1);
    expect(members[1].tags[0]).toBe('private');
    expect((members[1].value as any).value).toMatch(/my-value/);
  });

  test('class has multiple members', () => {
    const source = `
    class Test implements hasUnderscore extends MethodA {
      _hasUnderscore = false;
      constructor() {}
      private method(b: string): void {}
      public methodB(a: number): boolean { return true;}
    }`;
    const result = getResult(source).nodes[0];
    expect(result).toBeInstanceOf(ParseClassDeclaration);
    expect(result.tags).toHaveLength(0);
    const members = (<ParseClassDeclaration>result).members;
    expect(members).toHaveLength(4);
    expect((members[0].type as any).type.value).toBe(false);
    expect(members[1].tags[0]).toBe('hasUnderscore');
    expect(members[1].tags).toHaveLength(1);
    expect(members[1].tags[0]).toBe('private');
    expect((members[1].value as any).value).toMatch(/my-value/);
  });
});
