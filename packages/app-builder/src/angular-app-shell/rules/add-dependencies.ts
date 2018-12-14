import { Tree, Rule } from '@angular-devkit/schematics';
import { NodeDependency, addPkgJsonDependency } from '../../utils/dependencies';
import { join } from 'path';
import { addDynatraceNpmRc } from '../../utils/files';

/**
 * Adds Dependencies to the package.json
 * Used to add library specific dependencies.
 * @param options from schema.d.ts
 */
export function addDependencies(dependencies: NodeDependency[], packageJsonPath: string): Rule {
  return (host: Tree) => {
    // if no dependencies are provided early exit
    if (!dependencies.length) {
      return host;
    }

    // if there are dependencies from the Dynatrace npm registry add our own .npmrc file
    // in case they are only available in the Dynatrace network.
    if (dependencies.find(dep => dep.name.includes('@dynatrace'))) {
      addDynatraceNpmRc(host, packageJsonPath);
    }

    // loop over all dependencies and add them to the json.
    dependencies.forEach((dependency: NodeDependency) => {
      // add dependency to the package.json
      addPkgJsonDependency(
        host,
        dependency,
        join(packageJsonPath, 'package.json'),
      );
    });
    return host;
  };
}
