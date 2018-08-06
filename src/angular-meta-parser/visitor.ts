import * as ts from 'typescript';
import {
  fileInformations,
  parseParameter,
  parseComponentDecoratorSelector,
} from './utils';
import { AngularComponent } from './storage/angular-component';
import { TypeInformation } from './storage/type-information';
import chalk from 'chalk';
import { acmp } from './typings/angular-component';
const debug = require('debug')('angular-meta-parser:visitor');

export class Visitor {

  private _meta: AngularComponent;
  private _typeInfo: TypeInformation = new TypeInformation();
  private _sourceFile: ts.SourceFile;

  get meta(): acmp.Component { return this._meta.generate(); }

  constructor(fileName: string) {
    this._meta = new AngularComponent(fileInformations(fileName));
  }

  instrument(sourceCode: string) {
    this._sourceFile = ts.createSourceFile(
      this._meta.filename,
      sourceCode,
      ts.ScriptTarget.Latest,
      true,
    );

    this.visit(this._sourceFile);
  }

  visit(node: ts.Node) {
    if (!node) {
      return;
    }
    // debug(chalk`{grey visiting Node: }{yellow ${ts.SyntaxKind[node.kind]}}`);

    switch (node.kind) {
      case ts.SyntaxKind.Decorator:
        this.parseDecorator(node as ts.Decorator);
        break;
      case ts.SyntaxKind.TypeAliasDeclaration:
        this._typeInfo.addType(node as ts.TypeAliasDeclaration);
        break;
      case ts.SyntaxKind.SetAccessor:
        this.parseSetAccessor(node as ts.SetAccessorDeclaration);
        break;
    }
    node.forEachChild(this.visit.bind(this));
  }

  private parseDecorator(node: ts.Decorator) {
    const identifier = (node.expression as any).expression;
    const name = identifier.getText() as string;

    switch (name) {
      case 'Component':
        this._meta.name = name;
        this._meta.addMeta(parseComponentDecoratorSelector(node));
        break;
    }
  }

  private parseSetAccessor(node: ts.SetAccessorDeclaration) {
    const variant = {
      type: 'SetAccessor',
      name: node.name.getText(),
      params: parseParameter(node.parameters as ts.NodeArray<ts.ParameterDeclaration>),
    };

    this._meta.addVariant(variant);
  }
}
