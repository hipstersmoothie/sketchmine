import { Tree, SchematicsException } from '@angular-devkit/schematics';
import { JsonAstObject, parseJsonAst, JsonParseMode } from '@angular-devkit/core';
import {
  findPropertyInAstObject,
  appendPropertyInAstObject,
  insertPropertyInAstObjectInOrder,
} from './json-utils';

const INDENT_SIZE = 2;
const PKG_JSON_DEFAULT_PATH = '/package.json';

export enum NodeDependencyType {
  Default = 'dependencies',
  Dev = 'devDependencies',
  Peer = 'peerDependencies',
  Optional = 'optionalDependencies',
}

export interface NodeDependency {
  type: NodeDependencyType;
  name: string;
  version: string;
  overwrite?: boolean;
}

export function addPkgJsonDependency(tree: Tree, dependency: NodeDependency, path?: string): void {
  const packageJsonAst = readPgkJson(tree, path);
  const depsNode = findPropertyInAstObject(packageJsonAst, dependency.type);
  const recorder = tree.beginUpdate(path || PKG_JSON_DEFAULT_PATH);
  if (!depsNode) {
    // Haven't found the dependencies key, add it to the root of the package.json.
    appendPropertyInAstObject(
      recorder,
      packageJsonAst,
      dependency.type,
      { [dependency.name]: dependency.version },
      INDENT_SIZE,
    );
  } else if (depsNode.kind === 'object') {
    // check if package already added
    const depNode = findPropertyInAstObject(depsNode, dependency.name);

    if (!depNode) {
      // Package not found, add it.
      insertPropertyInAstObjectInOrder(
        recorder,
        depsNode,
        dependency.name,
        dependency.version,
        INDENT_SIZE * 4,
      );
    } else if (dependency.overwrite) {
      // Package found, update version if overwrite.
      const { end, start } = depNode;
      recorder.remove(start.offset, end.offset - start.offset);
      recorder.insertRight(start.offset, JSON.stringify(dependency.version));
    }
  }

  tree.commitUpdate(recorder);
}

export function getPkgJsonDependency(tree: Tree, name: string, path?: string): NodeDependency | null {
  const pkgJson = readPgkJson(tree, path);
  let dep: NodeDependency | null = null;
  [
    NodeDependencyType.Default,
    NodeDependencyType.Dev,
    NodeDependencyType.Optional,
    NodeDependencyType.Peer,
  ].forEach((depType) => {
    if (dep !== null) { return; }

    const depsNode = findPropertyInAstObject(pkgJson, depType);
    if (depsNode !== null && depsNode.kind === 'object') {
      const depNode = findPropertyInAstObject(depsNode, name);
      if (depNode !== null && depNode.kind === 'string') {
        const version = depNode.value;
        dep = {
          type: depType,
          name,
          version,
        };
      }
    }
  });

  return dep;
}

/**
 * reads safely a package JSON and returns a JsonAstObject
 * @param tree Schematics Tree with the files
 * @param path optional path to package.json default to root
 */
function readPgkJson(tree: Tree, path?: string): JsonAstObject {
  const pkgPath = path || PKG_JSON_DEFAULT_PATH;
  const buffer = tree.read(pkgPath);

  if (buffer === null) {
    throw new SchematicsException(`Could not read package.json under:\n${pkgPath}`);
  }
  const content = buffer.toString();
  const packageJson = parseJsonAst(content, JsonParseMode.Strict);
  if (packageJson.kind !== 'object') {
    throw new SchematicsException('Invalid package.json. Was expecting an object');
  }
  return packageJson;
}
