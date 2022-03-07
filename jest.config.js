require('jest-preset-angular/ngcc-jest-processor');

module.exports = {
  globalSetup: 'jest-preset-angular/global-setup',
  moduleNameMapper: {
    "@core/(.*)": "<rootDir>/src/app/core/$1"
  },
  preset: "jest-preset-angular",
  setupFiles: ["core-js"],
  setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],
  testPathIgnorePatterns: ["<rootDir>/cypress/"],
  reporters: [
    "default",
    "jest-junit"
  ],
  roots: [
    "<rootDir>"
  ],
  modulePaths: [
    "<rootDir>"
  ],
  moduleDirectories: [
    "node_modules"
  ],
  testRunner: "jest-circus",
  testResultsProcessor: "jest-sonar-reporter"
};
