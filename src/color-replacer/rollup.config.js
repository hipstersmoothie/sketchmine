import path from 'path';
import typescript from 'rollup-plugin-typescript';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from "rollup-plugin-terser";

const isProduction = process.env.NODE_ENV === 'production';

export default {
  input: path.resolve(__dirname, 'src', 'color-replacer', 'index.ts'),
  name: 'ColorReplacer',
  output: [{
    file: `dist/color-replacer.${isProduction ? 'min.js' : 'js'}`,
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
