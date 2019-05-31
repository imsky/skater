const buble = require('rollup-plugin-buble');
const { uglify } = require('rollup-plugin-uglify');

const packageJSON = require('./package.json');

function rollup({ minify }) {
  const { name, friendlyName } = packageJSON.build;
  return {
    input: 'src/index.js',
    output: {
      file: 'dist/' + (minify ? `${name}.min.js` : `${name}.js`),
      format: 'umd',
      name: friendlyName
    },
    plugins: [buble(), minify ? uglify({
      sourcemap: false
    }) : null].filter(Boolean)
  };
}

module.exports = [
  rollup({ minify: false }),
  rollup({ minify: true })
];
