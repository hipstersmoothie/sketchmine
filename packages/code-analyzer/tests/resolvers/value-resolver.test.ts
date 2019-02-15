import { getParsedResult, applyResolvers } from '../helpers';
import { ParseObjectLiteral } from '../../src/v2';

describe('[code-analyzer] › Resolving Values in the result', () => {

  test('resolving an objectLiteral', () => {
    const source = 'const x =  {a: "b"};';
    const result = getParsedResult(source).nodes[0] as any;

    const resolved = applyResolvers(result);

    // TODO: write cool test cases for resolving values
  });
});
