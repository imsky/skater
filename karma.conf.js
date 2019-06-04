module.exports = function (config) {
  config.set({
    autoWatch: false,
    browsers: ['Chrome'],
    colors: true,
    concurrency: Infinity,
    coverageReporter: {
      type: 'html',
      dir: 'coverage'
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
