import path from 'path';
import fs from 'fs';

const SRC_DIR = path.resolve(__dirname, 'src');
const DIST_DIR = path.resolve(__dirname, 'dist');

export const config = {
  general: {
    src: SRC_DIR,
  },
  library: {
    name: 'library',
    description: 'Angular to sketch library',
    path: SRC_DIR
  },
  angularMetaParser: {
    name: 'angular-meta-parser',
    description: 'The angular-meta-parser is a compiler, that generates an abstract syntax tree short AST from the\nAngular Components library and transforms the AST to a JSON format that represents all components,\nthat are related for the components library in sketch with all possible variants',
    path: path.join(SRC_DIR, 'angular-meta-parser'),
    copy: {
      'src/angular-meta-parser/config.json': 'dist/angular-meta-parser/config.json',
    }
  },
  angularVariantGenerator: {
    name: 'angular-library-generator',
    path: path.join(SRC_DIR, 'angular-library-generator'),
    copy: {
      'src/angular-library-generator/config.json': 'dist/angular-library-generator/config.json',
    }
  },
  colorReplacer: {
    name: 'sketch-color-replacer',
    path: path.join(SRC_DIR, 'color-replacer'),
  },
  domTraverser: {
    name: 'dom-traverser',
    description: 'The Dom Traverser collects the information from the DOM to\ndraw afterwards a .sketch file from the collected information in the tree.',
    path: path.join(SRC_DIR, 'dom-traverser'),
    browser: true,
  },
  ngSketch: {
    name: 'sketch-generator',
    description: 'Generates .sketch files from an html website that is inspected with a headless chrome.',
    path: path.join(SRC_DIR, 'ng-sketch'),
    copy: {
      'src/ng-sketch/config.json': 'dist/sketch-generator/config.json',
      'src/assets/preview.png' : 'dist/sketch-generator/assets/preview.png',
    },
  },
  validate: {
    name: 'sketch-validator',
    path: path.join(SRC_DIR, 'validate'),
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

/**
 * 
 * @param {{[key: string]: string}} options Key Value list of files to copy
 */
export function copyPlugin(options) {
  return {
    ongenerate() {
      Object.keys(options).forEach(option => {
        const src = option;
        const dest = options[option];

        const targDir = path.dirname(dest);
        if (!fs.existsSync(targDir)){
            fs.mkdirSync(targDir);
        }
        fs.writeFileSync(dest, fs.readFileSync(src));
      });
    }
  };
};
