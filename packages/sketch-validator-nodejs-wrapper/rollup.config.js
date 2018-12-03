import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json'
import pkg from './package.json';

const NODE_NATIVES = ['path', 'fs', 'os', 'buffer', 'crypto', 'util', 'child_process', 'perf_hooks'];
const DEPENDENCIES = Object.keys(pkg.dependencies);

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        name: 'sketch-validator-nodejs-wrapper',
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
      },
    ],
    external: [
      ...NODE_NATIVES,
      ...DEPENDENCIES,
    ],
    plugins: [
      json(),
      typescript({ tsconfig: './tsconfig.json', useTsconfigDeclarationDir: true }),
      resolve(), // so Rollup can find `ms`
      commonjs(), // so Rollup can convert `ms` to an ES module
    ]
  },
]
