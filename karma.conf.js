var browsers = ['Chrome', 'Firefox']

if (process.env.CI) {
  process.env.CHROME_BIN = require('puppeteer').executablePath();
  browsers = ['ChromeHeadlessCI', 'FirefoxHeadless'];
}

module.exports = function (config) {
  config.set({
    autoWatch: false,
    browsers,
    colors: true,
    concurrency: Infinity,
    coverageReporter: {
      check: {
        global: {
          statements: 95,
          branches: 90
        }
      },
      dir: 'coverage',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcov' }
      ]
    },
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: [
          '--disable-translate',
          '--disable-dev-shm-usage',
          '--disable-extensions',
          '--disable-gpu',
          '--disable-setuid-sandbox',
          '--headless',
          '--no-proxy-server',
          '--no-sandbox',
          '--proxy-bypass-list=*'
        ]
      }
    },
    files: ['test/**/*.js', 'dist/skater.js'],
    frameworks: ['mocha', 'chai'],
    logLevel: config.LOG_INFO,
    port: 9876,
    preprocessors: {
      'dist/skater.js': ['coverage']
    },
    reporters: ['progress', 'coverage'],
    singleRun: true
  })
};
