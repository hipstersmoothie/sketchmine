import path from 'path';
import fs from 'fs';
import * as ts from 'typescript';
import { readFile } from '@utils/read-file';
import { Transformer } from './transformer';

const COMPONENTS = [
  path.join(__dirname, './fixtures/button.ts'),
];

COMPONENTS.forEach(async (inputFile: string) => {
  const inputSourceCode = await readFile(inputFile);
  instrument(inputFile, inputSourceCode);
});

const types = [];


function visit(node: ts.Node) {
  if (!node) {
    return;
  }
  // console.log(ts.SyntaxKind[node.kind]);

  switch (node.kind) {
    case ts.SyntaxKind.Decorator:
      // parseDecorator(node as ts.Decorator);

      // printAllChildren(node);
      break;
    case ts.SyntaxKind.TypeAliasDeclaration:
      storeType(node as ts.TypeAliasDeclaration);
      break;
    case ts.SyntaxKind.SetAccessor:
      console.log(parseSetAccessor(node as ts.SetAccessorDeclaration));
      break;

  }
  node.forEachChild(visit);
}

function parseSetAccessor(node: ts.SetAccessorDeclaration) {
  return {
    type: 'SetAccessor',
    name: node.name.getText(),
    params: getParams(node.parameters as ts.NodeArray<ts.ParameterDeclaration>),
  };
}

function getParams(params: ts.NodeArray<ts.ParameterDeclaration>) {
  return params.map((param) => {
    return {
      name: param.name.getText(),
      type: param.type.getText(),
    };
  });
}

function storeType(node: ts.TypeAliasDeclaration) {
  let value;
  if (ts.isUnionTypeNode(node.type)) {
    value = getUnionTypeNodes(node.type.types)
  }

  types.push({
    name: node.name.getText(),
    value,
  });
}

function getUnionTypeNodes(nodes: ts.NodeArray<any>) {
  return nodes.map((type) => {
    if (type.literal) {
      return type.literal.text;
    }
  });
}


function printAllChildren(node: ts.Node, depth = 0) {
  let d = depth;
  console.log(Array(depth + 1).join('---'), ts.SyntaxKind[node.kind], node.pos, node.end);
  d += 1;
  node.getChildren()
    .forEach(c => printAllChildren(c, d));
}


function instrument(fileName: string, sourceCode: string) {
  const sourceFile = ts.createSourceFile(fileName, sourceCode, ts.ScriptTarget.Latest, true);
  visit(sourceFile);

  console.log('\n\n––––––– TYPES ––––––––\n\n', JSON.stringify(types, null, 2));
}


