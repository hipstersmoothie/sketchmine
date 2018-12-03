import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json'
import pkg from './package.json';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        name: 'dom-agent',
        file: pkg.main,
        format: 'esm',
        sourcemap: true,
      }
    ],
    plugins: [
      json(),
      typescript({ tsconfig: './tsconfig.json', useTsconfigDeclarationDir: true}),
      resolve(), // so Rollup can find `ms`
      commonjs(), // so Rollup can convert `ms` to an ES module
    ]
  },
]
