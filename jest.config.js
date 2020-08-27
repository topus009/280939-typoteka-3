"use strict";

// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

require(`./config`);

module.exports = {
  // ===== Indicates whether each individual test should be reported during the
  // run
  verbose: true,

  // The glob patterns Jest uses to detect test files
  testMatch: [
    `**/*.{test,spec,e2e}.{js,jsx,ts,tsx}`,
    // `**/users.e2e.js`,
    // `**/categories.e2e.js`,
    // `**/articles.e2e.js`,
    // `**/comments.e2e.js`,
  ],

  // ===== A set of global variables that need to be available in all test
  // environments
  globals: global.process.env,

  // The test environment that will be used for testing
  // testEnvironment: `node`,
  testEnvironment: `<rootDir>/config/jest.setup.js`,

  // The directory where Jest should store its cached dependency information
  cacheDirectory: `./tests-cache`,

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: `./coverage`,

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: [
    `/node_modules/`,
  ],

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: `v8`,

  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: [
    `json`,
    `text`,
    `lcov`,
    `clover`,
  ],

  // The paths to modules that run some code to configure or set up the testing
  // environment before each test
  // setupFiles: [
  //   `<rootDir>/config/index.js`,
  // ],

  // The root directory that Jest should scan for tests and modules within
  // rootDir: `src`,

  // A list of paths to directories that Jest should use to search for files in
  // roots: [
  //   `<rootDir>`
  // ],

  // Allows you to use a custom runner instead of Jest's default test runner
  // runner: `jest-runner`,

  // A list of paths to modules that run some code to configure or set up the
  // testing framework before each test
  setupFilesAfterEnv: [
    `jest-extended`,
  ],

  // An array of regexp pattern strings that are matched against all test
  // paths, matched tests are skipped
  testPathIgnorePatterns: [
    `/node_modules/`,
    `/public/`,
    `/tests-cache/`,
    `/.vscode/`,
    `/coverage/`,
    `/data/`,
    `/mocks/`,
    `/markup/`,
    `/testing/`,
  ],

  // Use this configuration option to add custom reporters to Jest
  reporters: [
    `default`,
    [`./node_modules/jest-html-reporter`, {
      "pageTitle": `Test Report`,
      "includeFailureMsg": true,
      "includeConsoleLog": true,
    }],
  ],

  // All imported modules in your tests should be mocked automatically
  // automock: false,

  // Stop running tests after `n` failures
  // bail: 0,

  // Indicates whether the coverage information should be collected while
  // executing the test
  // collectCoverage: true,

  // ===== An array of glob patterns indicating a set of files for which
  // coverage information should be collected
  // collectCoverageFrom: [
  //   `**/*/cli/server/routes/**/*`,
  // ],

  // An object that configures minimum threshold enforcement for coverage
  // results
  // coverageThreshold: {
  //   "global": {
  //     "branches": 100,
  //     "functions": 100,
  //     "lines": 100,
  //     "statements": 100
  //   },
  // },

  // ===== Make calling deprecated APIs throw helpful error messages
  // errorOnDeprecated: false,

  // Force coverage collection from ignored files using an array of glob
  // patterns
  // forceCoverageMatch: [],

  // A path to a module which exports an async function that is triggered once
  // before all test suites
  // globalSetup: undefined,

  // A path to a module which exports an async function that is triggered once
  // after all test suites
  // globalTeardown: undefined,

  // ===== An array of file extensions your modules use
  // moduleFileExtensions: [
  //   "js",
  //   "json",
  //   "jsx",
  //   "ts",
  //   "tsx",
  //   "node"
  // ],

  // ===== Activates notifications for test results
  // notify: false,

  // ===== A preset that is used as a base for Jest's configuration
  // preset: undefined,

  // ===== Automatically reset mock state between every test
  // resetMocks: false,

  // ===== Reset the module registry before running each individual test
  // resetModules: false,

  // Options that will be passed to the testEnvironment
  // testEnvironmentOptions: {},

  // Adds a location field to test results
  // testLocationInResults: false,

  // The regexp pattern or array of patterns that Jest uses to detect test files
  // testRegex: [],

  // This option allows the use of a custom results processor
  // testResultsProcessor: undefined,

  // This option allows use of a custom test runner
  // testRunner: "jasmine2",

  // This option sets the URL for the jsdom environment. It is reflected in
  // properties such as location.href
  // testURL: "http://localhost",
};
