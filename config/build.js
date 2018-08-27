import path from 'path';
import fs from 'fs';

const SRC_DIR = path.resolve(__dirname, 'src');
const DIST_DIR = path.resolve(__dirname, 'dist');

export const config = {
  general: {
    src: SRC_DIR,
  },
  angularMetaParser: {
    name: 'angular-meta-parser',
    path: path.join(SRC_DIR, 'angular-meta-parser'),
    copy: {
      "src/angular-meta-parser/config.json": "dist/angular-meta-parser/config.json",
    }
  },
  colorReplacer: {
    name: 'sketch-color-replacer',
    path: path.join(SRC_DIR, 'color-replacer'),
  },
  ngSketch: {
    name: 'sketch-generator',
    description: 'Generates .sketch files from an html website that is inspected with a headless chrome.',
    path: path.join(SRC_DIR, 'ng-sketch'),
    copy: {
      'src/ng-sketch/injected-traverser.js' : 'dist/sketch-generator/injected-traverser.js',
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
  * Description: ${description}
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
