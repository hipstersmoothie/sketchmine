import sketchGenerator from './src/ng-sketch/rollup.config.js';
import sketchValidator from './src/validate/rollup.config.js';
import colorReplacer from './src/color-replacer/rollup.config.js';

export default [
  sketchGenerator,
  sketchValidator,
  colorReplacer
];
