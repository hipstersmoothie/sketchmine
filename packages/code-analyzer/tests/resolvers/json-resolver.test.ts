import { getParsedResult, resolveJSON } from '../helpers';
import { ParseObjectLiteral, JSONResolver } from '../../src';

describe('[code-analyzer] › resolving the bloated resolved structure to a consumable format', () => {

  const jsonResolver = new JSONResolver();

  test('resolving an objectLiteral to a property', () => {
    const source = 'const x =  {a: "b"};';
    const result = getParsedResult(source).nodes[0] as any;
    const resolved = result.visit(jsonResolver);

    expect(resolved[0]).toMatchObject({
      type: 'property',
      key: 'a',
      value : '"b"',
    });
  });
});
