import path from 'path';
import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import sourceMaps from 'rollup-plugin-sourcemaps'
import json from 'rollup-plugin-json'
import minimist from 'minimist';
import { config, copyPlugin, outFile, banner } from './config/build';

const PROCESS_ARGS = process.argv.slice(2);
const PKG_JSON = require('./package.json');
const DEPENDENCIES = Object.keys(PKG_JSON.dependencies);
const NODE_NATIVES = ['path', 'fs', 'os', 'buffer', 'crypto', 'util', 'child_process', 'perf_hooks'];

/**
 * create buildconfig from config file for rollup
 * with the --part="" argument on the command line you can build
 * only one part as well instead of all library parts
 */
function buildConfig() {
  const part = minimist(PROCESS_ARGS).part
  if (part) {
    return [buildDependency(part)]
  }

  const conf = [];
  for (const dependency in config) {
    conf.push(buildDependency(dependency))
  }
  return conf;
}

/**
 * generates rollup config object from object in build config
 * @param {string} key for the configuration Object
 * @returns Rollup config object
 */
function buildDependency(dependency) {
  if (
    config.hasOwnProperty(dependency) &&
    config[dependency].hasOwnProperty('name')
  ) {
    const el = config[dependency];
    const description = el.description || '';
    const configObject = {
      input: path.join(el.path, 'index.ts'),
      output: [{
        file: outFile(el.name),
        name: el.name,
        banner: banner(el.name, PKG_JSON.version, description),
        format: el.format || 'cjs',
      }],
      external: [
        ...DEPENDENCIES,
        ...NODE_NATIVES,
      ],
      watch: { chokidar: true, include: `src/**` },
      plugins: [
        json(),
        typescript({ tsconfig: 'tsconfig.json' }),
        commonjs(),
        nodeResolve(),
        el.browser? {} : sourceMaps(),
        el.hasOwnProperty('copy') ? copyPlugin(el.copy) : {},
      ],
    };
    if (el.browser) {
      configObject.external = [];
      configObject.output[0].format = 'umd'
    }
    return configObject;
  }
}

export default buildConfig();
