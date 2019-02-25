import {
  ParsePrimitiveType,
  ParseValueType,
  ParseVariableDeclaration,
  ParseEmpty,
} from '../../src';
import { getParsedResult } from '../helpers';

describe('[code-analyzer] › ParseVariableStatement', () => {

  test('detecting variable statements', () => {
    const source = 'const x = 1;';
    const result = getParsedResult(source).nodes;
    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(ParseVariableDeclaration);
  });

  test('detecting variable statements with multiple declarations', () => {
    const source = 'const x = 1, y = 2;';
    const result = getParsedResult(source).nodes;
    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(ParseVariableDeclaration);
    expect(result[1]).toBeInstanceOf(ParseVariableDeclaration);
  });

  test('detecting variable from object destruction', () => {
    const source = 'const {a,b}={a:1,b:"hello"};';
    const result = getParsedResult(source).nodes;
    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(ParseVariableDeclaration);
    expect((result[0] as any).value).toBeInstanceOf(ParseValueType);
    expect((result[0] as any).name).toBe('a');
    expect((result[0] as any).type).toBeInstanceOf(ParseEmpty);
    expect((result[0] as any).value.value).toBe(1);
    expect(result[1]).toBeInstanceOf(ParseVariableDeclaration);
    expect((result[1] as any).value).toBeInstanceOf(ParseValueType);
    expect((result[1] as any).name).toBe('b');
    expect((result[1] as any).type).toBeInstanceOf(ParseEmpty);
    expect((result[1] as any).value.value).toMatch(/hello/);
  });

  test('detecting variable from array destruction', () => {
    const source = 'const {a,b}=[1, "hello"]';
    const result = getParsedResult(source).nodes;
    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(ParseVariableDeclaration);
    expect((result[0] as any).value).toBeInstanceOf(ParseValueType);
    expect((result[0] as any).name).toBe('a');
    expect((result[0] as any).type).toBeInstanceOf(ParseEmpty);
    expect((result[0] as any).value.value).toBe(1);
    expect(result[1]).toBeInstanceOf(ParseVariableDeclaration);
    expect((result[1] as any).value).toBeInstanceOf(ParseValueType);
    expect((result[1] as any).name).toBe('b');
    expect((result[1] as any).type).toBeInstanceOf(ParseEmpty);
    expect((result[1] as any).value.value).toMatch(/hello/);
  });
});

describe('ParseVariableDeclaration', () => {

  test('variable is only declared without value and type', () => {
    const source = 'let x;';
    const result = getParsedResult(source) as any;
    const declaration = result.nodes[0] as ParseVariableDeclaration;

    expect(declaration).toBeInstanceOf(ParseVariableDeclaration);
    expect(declaration.type).toBeInstanceOf(ParseEmpty);
    expect(declaration.value).toBeUndefined();
  });

  test('variable has a string type without value', () => {
    const source = 'let x: string;';
    const result = getParsedResult(source) as any;
    const declaration = result.nodes[0] as ParseVariableDeclaration;

    expect(declaration).toBeInstanceOf(ParseVariableDeclaration);
    expect(declaration.type).toBeInstanceOf(ParsePrimitiveType);
    expect((declaration.type as any).type).toBe('string');
    expect(declaration.value).toBeUndefined();
  });

  test('variable has a string type with value', () => {
    const source = 'const x: string = "hello"';
    const result = getParsedResult(source) as any;
    const declaration = result.nodes[0] as ParseVariableDeclaration;

    expect(declaration).toBeInstanceOf(ParseVariableDeclaration);
    expect(declaration.type).toBeInstanceOf(ParsePrimitiveType);
    expect((declaration.type as any).type).toBe('string');
    expect(declaration.value).toBeInstanceOf(ParseValueType);
    expect((declaration.value as any).value).toMatch(/hello/);
  });

  test('variable has only a value without a type definition', () => {
    const source = 'const x = 1';
    const result = getParsedResult(source) as any;
    const declaration = result.nodes[0] as ParseVariableDeclaration;

    expect(declaration).toBeInstanceOf(ParseVariableDeclaration);
    expect(declaration.type).toBeInstanceOf(ParseEmpty);
    expect(declaration.value).toBeInstanceOf(ParseValueType);
    expect((declaration.value as any).value).toBe(1);
  });

  test('variable has a boolean value', () => {
    const source = 'const x = true';
    const result = getParsedResult(source) as any;
    const declaration = result.nodes[0] as ParseVariableDeclaration;

    expect(declaration).toBeInstanceOf(ParseVariableDeclaration);
    expect(declaration.type).toBeInstanceOf(ParseEmpty);
    expect(declaration.value).toBeInstanceOf(ParseValueType);
    expect((declaration.value as any).value).toBe(true);
  });

  test('variable has an export keyword', () => {
    const source = 'export const number = 1';
    const result = getParsedResult(source).nodes[0] as ParseVariableDeclaration;
    expect(result.tags).toHaveLength(1);
    expect(result.tags[0]).toBe('exported');
  });
});
