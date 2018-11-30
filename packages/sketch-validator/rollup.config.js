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
        name: 'sketch-validation',
        file: pkg.browser,
        format: 'umd'
      },
      // {
      //   name: 'sketch-validation',
      //   file: pkg.main,
      //   format: 'cjs'
      // },
      // {
      //   name: 'sketch-validation',
      //   file: pkg.module,
      //   format: 'es'
      // },
    ],
    // external: [
    //   ...NODE_NATIVES,
    // ],
    plugins: [
      json(),
      typescript({ tsconfig: './tsconfig.json', useTsconfigDeclarationDir: true, }),
      resolve(), // so Rollup can find `ms`
      commonjs(), // so Rollup can convert `ms` to an ES module
    ]
  },
	// {
	// 	input: 'src/index.ts',
	// 	output: [
	// 		{ file: pkg.main, format: 'cjs' },
	// 		{ file: pkg.module, format: 'es' }
	// 	]
	// }
]
