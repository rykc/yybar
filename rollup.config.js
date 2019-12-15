// rollup.config.js
import minify from 'rollup-plugin-babel-minify';

export default {
  input: 'src/yybar.js',
  output: {
    file: 'build/yybar.min.js',
    format: 'esm'
  },
  plugins: [ 
    minify()
  ]
};