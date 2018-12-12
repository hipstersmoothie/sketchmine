import { Tree, SchematicsException } from '@angular-devkit/schematics';

export function setupOptions(host: Tree, options: any): Tree {
  if (!options.name) {
    throw new SchematicsException('Invalid options, "name" is required');
  }
  if (!options.directory) {
    throw new SchematicsException('Invalid options, "directory" is required');
  }

  return host;
}
