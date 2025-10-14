// Karma configuration file
// See https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    // Base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // Frameworks to use
    // Available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', '@angular-devkit/build-angular'],

    // List of files / patterns to load in the browser
    files: [],

    // List of files / patterns to exclude
    exclude: [],

    // Preprocess matching files before serving them to the browser
    // Available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      '**/*.ts': ['@angular-devkit/build-angular'],
    },

    // Test results reporter to use
    // Possible values: 'dots', 'progress'
    // Available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'kjhtml', 'coverage'],

    // Coverage reporter configuration
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      reporters: [
        { type: 'html', subdir: '.' },
        { type: 'lcov', subdir: '.' },
        { type: 'text-summary' },
        { type: 'json', subdir: '.' },
      ],
      check: {
        global: {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80,
        },
      },
      watermarks: {
        statements: [70, 85],
        functions: [70, 85],
        branches: [70, 85],
        lines: [70, 85],
      },
      include: [
        'projects/ngx-unnamed/src/lib/**/!(*.spec|*.mock|*.stories|*.interface).ts',
      ],
      exclude: [
        '**/*.spec.ts',
        '**/*.mock.ts',
        '**/*.stories.ts',
        '**/*.interface.ts',
        '**/test-utils/**',
        '**/public-api.ts',
        'projects/ngx-unnamed/src/lib/style/**',
      ],
    },

    // Web server port
    port: 9876,

    // Enable / disable colors in the output (reporters and logs)
    colors: true,

    // Level of logging
    // Possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // Start these browsers
    // Available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Firefox', 'FirefoxHeadless'],

    // Custom launchers for CI environments
    customLaunchers: {
      FirefoxHeadlessCI: {
        base: 'FirefoxHeadless',
        flags: ['-headless'],
      },
    },

    // Continuous Integration mode
    // If true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // How many instances of browser should be started simultaneously
    concurrency: Infinity,

    // Browser console log output
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      captureConsole: true,
    },

    // Plugin configuration
    plugins: [
      require('karma-jasmine'),
      require('karma-firefox-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],

    // Timeout for browser to start (in ms)
    browserNoActivityTimeout: 30000,

    // Retry configuration for flaky tests
    retryLimit: 2,

    // MIME type configuration
    mime: {
      'text/x-typescript': ['ts', 'tsx'],
    },

    // Source map configuration for better error reporting
    angularCli: {
      environment: 'test',
    },

    // Angular CLI configuration
    angularCliConfig: './angular.json',

    // Test file patterns
    files: [
      { pattern: './src/test.ts', watched: false },
    ],
  });

  // Configure for CI environment
  if (process.env.CI) {
    config.set({
      browsers: ['FirefoxHeadlessCI'],
      singleRun: true,
      reporters: ['dots', 'coverage'],
      coverageReporter: {
        dir: require('path').join(__dirname, './coverage'),
        reporters: ['lcov', 'text-summary', 'json'],
        check: {
          global: {
            statements: 80,
            branches: 80,
            functions: 80,
            lines: 80,
          },
        },
      },
    });
  }
};