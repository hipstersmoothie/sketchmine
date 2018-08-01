import path from 'path';
import typescript from 'rollup-plugin-typescript';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from "rollup-plugin-terser";

const isProduction = process.env.NODE_ENV === 'production';

export default {
  input: path.resolve(__dirname, 'src', 'validate', 'index.ts'),
  name: 'SketchValidator',
  output: [{
    file: `dist/sketch-validator.${isProduction ? 'min.js' : 'js'}`,
    format: 'umd'
  }], 
  plugins: [  
    commonjs({ include: './node_modules/**' }),
    typescript({
      typescript: require('typescript')
    }),
    isProduction ? terser() : {},
  ]
}
