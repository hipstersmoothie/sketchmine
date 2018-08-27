module.exports = {
  verbose: true,
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/_tmp/', '/node_modules/'],
  coveragePathIgnorePatterns: [
    '\\.d\\.ts$',
  ],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  moduleNameMapper: {
    '@sketch-draw/(.*)': '<rootDir>/src/ng-sketch/sketch-draw/$1',
    '@sketch-draw': '<rootDir>/src/ng-sketch/sketch-draw/index',
    '@sketch-svg-parser/(.*)*': '<rootDir>/src/ng-sketch/sketch-svg-parser/$1',
    '@color-replacer/(.*)': '<rootDir>/src/color-replacer/$1',
    '@utils/(.*)': '<rootDir>/src/utils/$1',
    '@utils': '<rootDir>/src/utils/index',
  },
  testMatch: [
    '<rootDir>/src/**/?(*.)test.ts',
    '<rootDir>/tests/**/?(*.)test.ts',
  ],
  transform: {
    '\\.(ts)$': '<rootDir>/node_modules/ts-jest/preprocessor.js',
  },
}
