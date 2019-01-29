import { Path } from '@angular-devkit/core';
import { NodeDependency }from '../utils/dependencies';

export interface Config {
  config: string; // path to the configuration json
  dependencies?: string; // optional dependencies or overrides
}

export interface Schema {
  name: string;
  dependencies?: NodeDependency[];
  directory: string;
  examples: Examples;
  meta: string;
  skipInstall?: boolean; // skips the install in the application if provided
  styles?: string[]; // Framework specific styles (use for import of framework styles)
}

export interface Examples {
  dir: string;
  entry: string;
  list: { [key: string]: string } // Examples Mapping which example component is for which library component
}
