import minimatch from 'minimatch';
import * as path from 'path';

/**
 * Resolve the `export` and `import` paths to absolute paths and resolves path aliases from
 * the **tsconfig.json** with the correct path.
 * @param {string} dirName path from the current File.
 * @param {string} relativePath path from `export` or `import` statement
 * @param {Map<string, string>} paths Map from the paths aliases in the tsconfig.json
 * @returns {string | null} returns the parsed absolute path
 * or returns null if it is a `node_module` like **@angular**
 */
export function parseAbsoluteModulePath(
  dirName: string,
  relativePath: string,
  paths: Map<string, string>,
): string | null {
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
