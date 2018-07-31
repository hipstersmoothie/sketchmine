
import path from 'path';
import typescript from 'rollup-plugin-typescript';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from "rollup-plugin-terser";

const isProduction = process.env.NODE_ENV === 'production';

const copyPlugin = function (options) {
  return {
    ongenerate() {
      const targDir = path.dirname(options.targ);
      if (!fs.existsSync(targDir)){
          fs.mkdirSync(targDir);
      }
      fs.writeFileSync(options.targ, fs.readFileSync(options.src));
    }
  };
};

export default {
  input: path.resolve(__dirname, 'src', 'ng-sketch', 'index.ts'),
  name: 'SketchGenerator',
  output: [{
    file: `dist/sketch-generator.${isProduction ? 'min.js' : 'js'}`,
    format: 'umd'
  }], 
  plugins: [  
    commonjs({ include: './node_modules/**' }),
    typescript({
      typescript: require('typescript')
    }),
    isProduction ? terser() : {},
  ],
}
