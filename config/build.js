import path from 'path';
import fs from 'fs';

const SRC_DIR = path.resolve(__dirname, 'src');
const DIST_DIR = path.resolve(__dirname, 'dist');

export const config = {
  general: {
    src: SRC_DIR,
    banner: banner,
  },
  angularMetaParser: {
    name: 'angular-meta-parser',
    path: path.join(SRC_DIR, 'angular-meta-parser'),
    outFile: outFile,
    entry: 'index.ts',
    copy: {
      "src/angular-meta-parser/config.json": "dist/config.json",
    }
  },
  colorReplacer: {
    path: path.join(SRC_DIR, 'color-replacer'),
  },
  ngSketch: {
    path: path.join(SRC_DIR, 'ng-sketch'),
  },
  validate: {
    path: path.join(SRC_DIR, 'validate'),
  },
}

function outFile(name, isProduction) {
  return path.join(DIST_DIR, `${name}.${isProduction ? 'min.js' : 'js'}`);
}


function banner(name, version, description) {
  return `/**
  * ${name} - ${version}
  * Description: ${description}
  * Company: Dynatrace
  * Author: Lukas Holzer <lukas.holzer@dynatrace.com>
  * Licence: MIT
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
