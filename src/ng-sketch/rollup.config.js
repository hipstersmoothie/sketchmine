import fs from 'fs';
import path from 'path';
import typescript from 'rollup-plugin-typescript';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from "rollup-plugin-terser";
import chokidar from 'chokidar';

const isProduction = process.env.NODE_ENV === 'production';

/**
 * 
 * @param {{[key: string]: string}} options Key Value list of files to copy
 */
function copyPlugin(options) {
  return {
    ongenerate() {
      console.log(options);

      Object.keys(options).forEach(option => {
        const src = option;
        const dest = options[option];

        const targDir = path.dirname(dest);
        if (!fs.existsSync(targDir)){
            fs.mkdirSync(targDir);
        }
        fs.writeFileSync(dest, fs.readFileSync(src));
      });
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
  watch: {
    chokidar,
    include: 'src/**'
  },
  plugins: [  
    copyPlugin({
      'src/ng-sketch/injected-traverser.js' : 'dist/injected-traverser.js',
      'src/assets/preview.png' : 'dist/assets/preview.png',
    }),
    commonjs({ include: './node_modules/**' }),
    typescript({
      typescript: require('typescript')
    }),
    isProduction ? terser() : {},
  ],
}
