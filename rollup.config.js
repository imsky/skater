const fs = require('fs');

const banner = require('rollup-plugin-banner');
const buble = require('rollup-plugin-buble');
const replace = require('rollup-plugin-replace');
const { uglify } = require('rollup-plugin-uglify');

const packageJSON = require('./package.json');

const { name, friendlyName, summary } = packageJSON.build;
const { author, version } = packageJSON;

function rollup({ minify, polyfill }) {
  const bannerText = [
    `${friendlyName} - ${summary}`,
    `Version ${version}`,
    `© ${(new Date).getFullYear()} ${author}`
  ].join('\n');

  const file = [name, polyfill && 'polyfilled', minify && 'min', 'js'].filter(Boolean).join('.');

  return {
    input: 'src/index.js',
    output: {
      banner: polyfill ? fs.readFileSync('vendor/requestanimationframe.js', 'utf8') : undefined,
      file: `dist/${file}`,
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

const builds = [];

for (const minify of [true, false]) {
  for (const polyfill of [true, false]) {
    builds.push(rollup({ minify, polyfill }));
  }
}

module.exports = builds;
