const esModules = ['@agm', 'ngx-bootstrap'].join('|');

module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testMatch: [
    '<rootDir>/src/**/*.spec.ts'
  ],
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!lodash-es/.*)'],
  reporters: [
    "default",
    "jest-junit"
  ]
};
