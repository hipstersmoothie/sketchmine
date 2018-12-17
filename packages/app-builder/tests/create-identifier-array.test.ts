import * as ts from 'typescript';
import { createIdentifierArray } from '../src/utils/ast';

describe('[app-builder] › utils › create identifier array', () => {

  test('if created Array equals arrayLiteralExpression', () => {

    const result = createIdentifierArray(['test1', 'test2']);

    expect(result).toHaveProperty('kind');
    expect(result.kind).toEqual(ts.SyntaxKind.ArrayLiteralExpression);
  });

  test('provided empty Array has zero children ', () => {
    const result = createIdentifierArray([]);
    expect(result.elements).toHaveLength(0);
  });

  test('provided array has two identifier', () => {

    const result = createIdentifierArray(['test1', 'test2']);

    expect(result.elements).toHaveLength(2);
    result.elements.forEach((el) => {
      expect(el).toHaveProperty('kind');
      expect(el.kind).toEqual(ts.SyntaxKind.Identifier);
      expect(el).toHaveProperty('text');
    });

    expect((result.elements[0] as ts.Identifier).text).toMatch('test1');
    expect((result.elements[1] as ts.Identifier).text).toMatch('test2');
  });

});
