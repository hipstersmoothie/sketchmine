import * as ts from 'typescript';
import path from 'path';
import minimatch from 'minimatch';
import {
  ParseNode,
  ParseDependency,
  ParseLocation,
  ParseInterface,
  ParseProperty,
  ParseEmpty,
  ParseResult,
  ParseType,
  ParsePrimitiveType,
  ParseReferenceType,
  ParseFunctionType,
} from './ast';
import chalk from 'chalk';
const LOG = require('debug')('angular-meta-parser:visitor.ts');

export function tsVisitorFactory(paths: Map<string, string>) {
  // These variables contain state that changes as we descend into the tree.
  let currentLocation: ParseLocation | undefined;
  let nodes: ParseNode[] = [];
  let dependencyPaths = new Set<string>();

  return visitSourceFile;

  function visitSourceFile(sourceFile: ts.SourceFile): ParseResult {

    if (currentLocation) {
      throw new Error(`Visitor for ${currentLocation.path} is already in use`);
    }

    currentLocation = new ParseLocation(sourceFile.fileName);
    sourceFile.forEachChild(visitor);

    const result = new ParseResult(currentLocation, nodes, dependencyPaths);

    nodes = [];
    dependencyPaths = new Set<string>();
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
      case ts.SyntaxKind.TypeAliasDeclaration:
        visitTypeAliasDeclaration(node as ts.TypeAliasDeclaration);
    }
  }

  function visitTypeAliasDeclaration(node: ts.TypeAliasDeclaration) {
    if (!hasExportModifier(node)) {
      return;
    }
  }

  function visitInterfaceDeclaration(node: ts.InterfaceDeclaration) {
    if (!hasExportModifier(node)) {
      return;
    }
    const members: ParseProperty[] = [];

    if (node.members) {
      node.members.forEach((member: ts.PropertySignature | ts.MethodSignature) => {
        if (member.kind === ts.SyntaxKind.PropertySignature && ts.isIdentifier(member.name)) {
          if (member.type.kind === ts.SyntaxKind.TypeReference) {
            members.push(new ParseProperty(member.name.text, currentLocation, visitType(member.type)));
          } else if (member.type.kind === ts.SyntaxKind.FunctionType) {
            members.push(visitMethod(member.type as ts.FunctionTypeNode));
          }
        } else if (member.kind === ts.SyntaxKind.MethodSignature && ts.isIdentifier(member.name)) {
          members.push(visitMethod(member));
        }
      });
    }
    nodes.push(new ParseInterface(node.name.text, currentLocation, members));
  }

  function visitMethod(node: ts.SignatureDeclarationBase): ParseProperty {
    return new ParseProperty(
      (node.name as ts.Identifier).text,
      currentLocation,
      visitFunctionType(node.type as ts.FunctionTypeNode),
    );
  }

  function visitType(node: ts.TypeNode): ParseType | null {
    if (node) {
      switch (node.kind) {
        case ts.SyntaxKind.NumberKeyword:
          return new ParsePrimitiveType(currentLocation, 'number');
        case ts.SyntaxKind.StringKeyword:
          return new ParsePrimitiveType(currentLocation, 'string');
        case ts.SyntaxKind.BooleanKeyword:
          return new ParsePrimitiveType(currentLocation, 'boolean');
        case ts.SyntaxKind.SymbolKeyword:
          return new ParsePrimitiveType(currentLocation, 'symbol');
        case ts.SyntaxKind.NullKeyword:
          return new ParsePrimitiveType(currentLocation, 'null');
        case ts.SyntaxKind.UndefinedKeyword:
          return new ParsePrimitiveType(currentLocation, 'undefined');
        case ts.SyntaxKind.TypeReference:
          return new ParseReferenceType(
            currentLocation,
            ((node as ts.TypeReferenceNode).typeName as ts.Identifier).text);
        case ts.SyntaxKind.FunctionType:
          return visitFunctionType(node as ts.FunctionTypeNode);
      }
    }
    return null;
  }

  function visitFunctionType(node: ts.FunctionTypeNode): ParseFunctionType {
    let args: ParseProperty[] = [];

    if (node.parameters) {
      args = node.parameters.map((param: ts.ParameterDeclaration) =>
        new ParseProperty((param.name as ts.Identifier).text, currentLocation, visitType(param.type)));
    }
    return new ParseFunctionType(currentLocation, args, visitType(node.type));
  }

  function visitExportOrExportDeclaration(node: ts.ExportDeclaration | ts.ImportDeclaration) {
    let relativePath: string;
    if (ts.isStringLiteral(node.moduleSpecifier)) {
      relativePath = node.moduleSpecifier.text;
    }
    if (relativePath) {
      const absolutePath = parseAbsoluteModulePath(path.dirname(currentLocation.path), relativePath, paths);
      if (absolutePath !== null) {
        dependencyPaths.add(absolutePath);
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
