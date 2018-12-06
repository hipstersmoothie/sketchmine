import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import copy from 'rollup-plugin-copy';
import { banner } from '../../config/banner';
import json from 'rollup-plugin-json'
import pkg from './package.json';

const NODE_NATIVES = ['path', 'fs', 'os', 'buffer', 'crypto', 'util', 'child_process', 'perf_hooks'];
const DEPENDENCIES = Object.keys(pkg.dependencies);

const plugins = [
  json(),
  typescript({ tsconfig: './tsconfig.json', useTsconfigDeclarationDir: true }),
  resolve(), // so Rollup can find `ms`
  commonjs(), // so Rollup can convert `ms` to an ES module
];

const external = [
  ...NODE_NATIVES,
  ...DEPENDENCIES,
];

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        name: 'sketch-builder',
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
        banner: banner(pkg),
      },
    ],
    external,
    plugins,
  },
  {
    input: 'src/bin.ts',
    output: [
      {
        name: 'sketch-builder-executeable',
        file: 'lib/bin.js',
        format: 'cjs',
        sourcemap: true,
        banner: `#!/usr/bin/env node\n\n${banner(pkg)}`,
      },
    ],
    external,
    plugins: [
      ...plugins,
      copy({
        'src/assets/preview.png': 'lib/assets/preview.png',
      }),
    ]
  },
]
