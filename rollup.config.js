const buble = require('rollup-plugin-buble');
const { uglify } = require('rollup-plugin-uglify');
const banner = require('rollup-plugin-banner');

const packageJSON = require('./package.json');

const { name, friendlyName, summary } = packageJSON.build;
const { author, version } = packageJSON;

function rollup({ minify }) {
  return {
    input: 'src/index.js',
    output: {
      file: 'dist/' + (minify ? `${name}.min.js` : `${name}.js`),
      format: 'umd',
      name: friendlyName
    },
    plugins: [
      buble(),
      minify ? uglify({ sourcemap: false }) : null,
      banner.default([
        `${friendlyName} - ${summary}`,
        `Version ${version}`,
        `© ${(new Date).getFullYear()} ${author}`
      ].join('\n'))
    ].filter(Boolean)
  };
}

module.exports = [
  rollup({ minify: false }),
  rollup({ minify: true })
];
