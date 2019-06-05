const banner = require('rollup-plugin-banner');
const buble = require('rollup-plugin-buble');
const replace = require('rollup-plugin-replace');
const { uglify } = require('rollup-plugin-uglify');

const packageJSON = require('./package.json');

const { name, friendlyName, summary } = packageJSON.build;
const { author, version } = packageJSON;

function rollup({ minify }) {
  const bannerText = [
    `${friendlyName} - ${summary}`,
    `Version ${version}`,
    `© ${(new Date).getFullYear()} ${author}`
  ].join('\n');

  return {
    input: 'src/index.js',
    output: {
      file: 'dist/' + (minify ? `${name}.min.js` : `${name}.js`),
      format: 'umd',
      name: friendlyName
    },
    plugins: [
      replace({
        'VERSION': version
      }),
      buble(),
      minify ? uglify({ sourcemap: false }) : null,
      banner.default(bannerText)
    ].filter(Boolean)
  };
}

module.exports = [
  rollup({ minify: false }),
  rollup({ minify: true })
];
