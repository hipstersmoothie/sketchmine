import { JSONVisitor, ParseResult } from './ast';
import { Result as MetaResult, Component as MetaComponent } from './meta-information';

/**
 * Uses the transformed AST and represent it in our final JSON format
 * @param {Map<string, ParseResult>} ast Abstract Syntax Tree that was generated from the components and transformed
 * @param {string} pkg path to the package.json from the angular components
 */
export function renderASTtoJSON(ast: Map<string, ParseResult>, pkg: string): MetaResult {
  const jsonVisitor = new JSONVisitor();
  const jsonResult: MetaComponent[] = [];
  const pkgJSON = require(pkg);
  for (const result of ast.values()) {
    jsonResult.push(...result.visit(jsonVisitor));
  }

  const formatted: { [key: string]: MetaComponent } = {};
  jsonResult.forEach(result => formatted[result.component] = result);

  return {
    version: pkgJSON.version,
    components: formatted,
  };
}
