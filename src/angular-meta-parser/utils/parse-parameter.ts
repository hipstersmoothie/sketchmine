import * as ts from 'typescript';
import { acmp } from '../typings/angular-component';

export function parseParameter(params: ts.NodeArray<ts.ParameterDeclaration>): acmp.Parameters[] {
  return params.map((param) => {
    return {
      name: param.name.getText(),
      type: param.type.getText(),
    };
  });
}
