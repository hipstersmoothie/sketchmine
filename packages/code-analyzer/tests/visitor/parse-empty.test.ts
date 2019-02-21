import {
  ParseEmpty,
} from '../../src/v2';
import { getParsedResult } from '../helpers';

describe('[code-analyzer] › Parse Nodes that should return ParseEmpty', () => {

  test('An expression statement should return a ParseEmpty node', () => {
    const source = 'myFunction("myStringValue")';
    const result = getParsedResult(source).nodes as any[];
    expect(result[0]).toBeInstanceOf(ParseEmpty);
  });
});
