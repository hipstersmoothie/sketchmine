import * as ts from 'typescript';
import path from 'path';
import minimatch from 'minimatch';
import { readFile } from '@utils';
import { ParseNode, ParseDependency, ParseLocation, ParseInterface, ParseFunction, ParseVariable } from './ast';

export function tsVisitorFactory(
  paths: Map<string, string>,
  parseFile: (fileName: string, paths: Map<string, string>) => ParseNode[],
) {
  // These variables contain state that changes as we descend into the tree.
  let currentLocation: ParseLocation | undefined;
  let nodes: ParseNode[] = [];

  return visitSourceFile;

  function visitSourceFile(sourceFile: ts.SourceFile): ParseNode[] {

    if (currentLocation) {
      throw new Error(`Visitor for ${currentLocation.path} is already in use`);
    }

    currentLocation = new ParseLocation(sourceFile.fileName);
    sourceFile.forEachChild(visitor);

    const result = nodes;

    nodes = [];
    currentLocation = undefined;

    return result;
  }

  function visitor(node: ts.Node) {
    switch (node.kind) {
      case ts.SyntaxKind.ExportDeclaration:
      case ts.SyntaxKind.ImportDeclaration:
        visitExportOrExportDeclaration(node as ts.ImportDeclaration | ts.ExportDeclaration);
        break;
      case ts.SyntaxKind.InterfaceDeclaration:
        visitInterfaceDeclaration(node as ts.InterfaceDeclaration);
        break;
    }
  }

  function visitInterfaceDeclaration(node: ts.InterfaceDeclaration) {
    if (!hasExportModifier(node)) {
      return;
    }
    const props: ParseVariable[] = [];
    const methods: ParseFunction[] = [];

    if (node.members) {
      node.members.forEach((member: ts.PropertySignature | ts.MethodSignature) => {
        if (member.kind === ts.SyntaxKind.PropertySignature && ts.isIdentifier(member.name)) {
          if (member.type.kind === ts.SyntaxKind.TypeReference) {
            // TODO parse type
            props.push(new ParseVariable(member.name.text, currentLocation, ''));
          } else if (member.type.kind === ts.SyntaxKind.FunctionType) {
            methods.push(visitMethod(member.type as ts.FunctionTypeNode));
          }
        } else if (member.kind === ts.SyntaxKind.MethodSignature && ts.isIdentifier(member.name)) {
          methods.push(visitMethod(member));
        }
      });
    }
    nodes.push(new ParseInterface(node.name.text, currentLocation, props, methods));
  }

  function visitMethod(node: ts.SignatureDeclarationBase): ParseFunction {
    let args: ParseVariable[] = [];
    if (node.parameters) {
      args = node.parameters.map((param: ts.ParameterDeclaration) =>
        // TODO: type
        new ParseVariable((param.name as ts.Identifier).text, currentLocation, ''));
    }
    // TODO: type
    return new ParseFunction((node.name as ts.Identifier).text, currentLocation, args, '');
  }

  function visitExportOrExportDeclaration(node: ts.ExportDeclaration | ts.ImportDeclaration) {
    let relativePath: string;
    if (ts.isStringLiteral(node.moduleSpecifier)) {
      relativePath = node.moduleSpecifier.text;
    }
    if (relativePath) {
      const absolutePath = parseAbsoluteModulePath(path.dirname(currentLocation.path), relativePath, paths);
      if (absolutePath !== null) {
        parseFile(absolutePath, paths);
      }
    }
  }
}

function parseAbsoluteModulePath(dirName: string, relativePath: string, paths: Map<string, string>): string | null {
  if (paths) {
    for (const glob of paths.keys()) {
      if (minimatch(relativePath, glob)) {
        return relativePath.replace(
          glob.replace('*', ''),
          paths.get(glob).replace('*', ''),
        );
      }
    }
  }
  if (relativePath.startsWith('.')) {
    return path.join(dirName, relativePath);
  }
  return null;
}

function hasExportModifier(node: ts.Node): boolean {
  return node.modifiers && !!node.modifiers.find(
    modifier => modifier.kind === ts.SyntaxKind.ExportKeyword);
}

