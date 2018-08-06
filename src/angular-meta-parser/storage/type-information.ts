import * as ts from 'typescript';
import { acmp } from '../typings/angular-component';

/**
 * Singleton Class to store all Type informations
 * from the components library
 */
export class TypeInformation {

  private static _instance: TypeInformation;
  private _types: acmp.TypeInformation[] = [];

  get types(): acmp.TypeInformation[] { return this._types; }

  constructor() {
    if (TypeInformation._instance) {
      return TypeInformation._instance;
    }
    TypeInformation._instance = this;
  }

  addType(node: ts.TypeAliasDeclaration) {
    const name = node.name.getText();
    let value;

    switch (node.type.kind) {
      case ts.SyntaxKind.UnionType:
        value = getUnionTypeNodes((node.type as any).types);
        break;
    }
    this._types.push({
      name,
      value,
    });
  }
}

function getUnionTypeNodes(nodes: ts.NodeArray<ts.LiteralTypeNode>) {
  return nodes.map((type) => {
    if (type.literal && ts.isStringLiteral(type.literal)) {
      return type.literal.text;
    }
  });
}
