import path from 'path';
import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import sourceMaps from 'rollup-plugin-sourcemaps'
import json from 'rollup-plugin-json'
import { terser } from "rollup-plugin-terser";
import { config, copyPlugin } from './config/build';

const pkg = require('./package.json');
const dependencies = Object.keys(pkg.dependencies);
const isProduction = process.env.NODE_ENV === 'production';

export default [
  {
    input: path.join(config.angularMetaParser.path, config.angularMetaParser.entry),
    output: [{
      file: config.angularMetaParser.outFile('angular-meta-parser', isProduction),
      name: config.angularMetaParser.name,
      banner: config.general.banner(config.angularMetaParser.name, pkg.version, ''),
      format: 'cjs'
    }],  
    external: [
      ...dependencies,
      'path', 'fs', 'os', 'buffer', 'crypto', 'util', 'child_process', 'perf_hooks',
    ],
    watch: {
      chokidar: true,
      include: `src/**`,
    },
    plugins: [
      json(),
      typescript({ tsconfig: "tsconfig.json" }),
      commonjs(),
      nodeResolve(),
      sourceMaps(),
      copyPlugin(config.angularMetaParser.copy),
      isProduction ? terser() : {},
    ]
  }
];



