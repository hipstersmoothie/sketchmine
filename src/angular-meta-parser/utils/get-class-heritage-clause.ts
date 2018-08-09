import * as ts from 'typescript';
import { getSymbolName } from './get-symbol-name';

export interface HeritageClauses {
  extends: string[];
  implements: string[];
}

/**
 * get the extends and implements of a class
 * @param {ts.ClassDeclaration} node ClassDeclaration Node
 */
export function getClassHeritageClause(node: ts.ClassDeclaration): HeritageClauses | undefined {
  if (node.heritageClauses && node.heritageClauses.length) {
    const clauses: HeritageClauses = {
      extends: [],
      implements: [],
    };
    node.heritageClauses.forEach((clause: ts.HeritageClause) => {
      const expressions = clause.types.map((expr: ts.ExpressionWithTypeArguments) =>
        getSymbolName(expr.expression));

      switch (clause.token) {
        case ts.SyntaxKind.ImplementsKeyword:
          clauses.implements.push(...expressions);
          break;
        case ts.SyntaxKind.ExtendsKeyword:
          clauses.extends.push(...expressions);
          break;
      }
    });
    return clauses;
  }
  return undefined;
}
