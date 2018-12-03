import path from 'path';
import fs from 'fs';

const SRC_DIR = path.resolve(__dirname, 'src');
const DIST_DIR = path.resolve(__dirname, 'dist');

export const config = {
  'general': {
    src: SRC_DIR,
  },
  'library': {
    name: 'library',
    description: 'Angular to sketch library',
    path: SRC_DIR
  },
  'angular-meta-parser': {
    name: 'angular-meta-parser',
    description: 'The angular-meta-parser is a compiler, that generates an abstract syntax tree short AST from the\nAngular Components library and transforms the AST to a JSON format that represents all components,\nthat are related for the components library in sketch with all possible variants',
    path: path.join(SRC_DIR, 'angular-meta-parser'),
    copy: {
      'src/angular-meta-parser/config.json': 'dist/angular-meta-parser/config.json',
    }
  },
  'angular-library-generator': {
    name: 'angular-library-generator',
    path: path.join(SRC_DIR, 'angular-library-generator'),
    copy: {
      'src/angular-library-generator/config.json': 'dist/angular-library-generator/config.json',
    }
  },
  'sketch-color-replacer': {
    name: 'sketch-color-replacer',
    path: path.join(SRC_DIR, 'color-replacer'),
  },
  'dom-traverser': {
    name: 'dom-traverser',
    description: 'The Dom Traverser collects the information from the DOM to\ndraw afterwards a .sketch file from the collected information in the tree.',
    path: path.join(SRC_DIR, 'dom-traverser'),
    browser: true,
  },
  'sketch-generator': {
    name: 'sketch-generator',
    description: 'Generates .sketch files from an html website that is inspected with a headless chrome.',
    path: path.join(SRC_DIR, 'sketch-generator'),
    copy: {
      'src/sketch-generator/config.json': 'dist/sketch-generator/config.json',
      'src/assets/preview.png' : 'dist/sketch-generator/assets/preview.png',
    },
  },
  'sketch-validator': {
    name: 'sketch-validator',
    description: 'Dynatrace Sketch validation for our design system.',
    path: path.join(SRC_DIR, 'validate'),
  },
  'sketch-validator-npm': {
    name: 'sketch-validator',
    input: path.join(SRC_DIR, 'validate', 'package.ts'),
    output: (version) => [
      {
        file: path.join(DIST_DIR, 'sketch-validator/npm/index.es6.js'),
        name: 'sketch-validator-npm-es6',
        banner: banner('sketch-validator-npm-es6', version, 'NPM package for the Dynatrace Sketch validation for our design system.'),
        format: 'es',
      },
      {
        file: path.join(DIST_DIR, 'sketch-validator/npm/index.cjs.js'),
        name: 'sketch-validator-npm-cjs',
        banner: banner('sketch-validator-npm-es6', version, 'NPM package for the Dynatrace Sketch validation for our design system.'),
        format: 'cjs',
      },
    ],
    copy: {
      'src/validate/package.json': 'dist/sketch-validator/npm/package.json',
    },
  },
}

export function outFile(dir, isProduction = false) {
  const name = 'index';
  return path.join(DIST_DIR, dir, `${name}.${isProduction ? 'min.js' : 'js'}`);
}


export function banner(name, version, description) {
  return `/**
  * ${name} - ${version}
  * Description: ${description.replace(/\\n/g, '\n  *              ')}
  * Company: Dynatrace
  * Author: Lukas Holzer <lukas.holzer@dynatrace.com>
  **/

`;
}
