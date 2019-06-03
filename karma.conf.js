module.exports = function (config) {
  config.set({
    autoWatch: false,
    browsers: ['Chrome'],
    colors: true,
    concurrency: Infinity,
    files: ['test/**/*.js', 'dist/skater.js'],
    frameworks: ['mocha', 'chai'],
    logLevel: config.LOG_INFO,
    port: 9876,
    reporters: ['progress'],
    singleRun: true
  })
};
