module.exports = function (config) {
  config.set({
    autoWatch: false,
    browsers: ['Chrome'],
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
      ]
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
