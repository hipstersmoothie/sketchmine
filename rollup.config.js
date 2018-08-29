import path from 'path';
import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import sourceMaps from 'rollup-plugin-sourcemaps'
import json from 'rollup-plugin-json'
import { config, copyPlugin, outFile, banner } from './config/build';

const pkg = require('./package.json');
const dependencies = Object.keys(pkg.dependencies);

const NODE_NATIVES = ['path', 'fs', 'os', 'buffer', 'crypto', 'util', 'child_process', 'perf_hooks'];

function buildConfig() {
  const conf = [];
  for (const dependency in config) {
    if (config.hasOwnProperty(dependency) && config[dependency].hasOwnProperty('name')) {
      const el = config[dependency];
      const description = el.description || '';
      const c = {
        input: path.join(el.path, 'index.ts'),
        output: [{
          file: outFile(el.name),
          name: el.name,
          banner: banner(el.name, pkg.version, description),
          format: 'cjs',
        }],
        external: [
          ...dependencies,
          ...NODE_NATIVES,
        ],
        watch: { chokidar: true, include: `src/**` },
        plugins: [
          json(),
          typescript({ tsconfig: 'tsconfig.json' }),
          commonjs(),
          nodeResolve(),
          sourceMaps(),
          el.hasOwnProperty('copy') ? copyPlugin(el.copy) : {},
        ],
      };

      if (el.browser) {
        c.external = [];
        c.output.format = 'esm'
      }
    
      conf.push(c);
    }
  }
  return conf;
}

export default buildConfig();
