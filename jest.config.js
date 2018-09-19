module.exports = {
  verbose: true,
  testEnvironment: 'node',
  testURL: 'http://localhost/',
  testPathIgnorePatterns: ['/_tmp/', '/node_modules/'],
  coveragePathIgnorePatterns: [
    '\\.d\\.ts$',
  ],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  moduleNameMapper: {
    "@angular-meta-parser/(.*)": '<rootDir>/src/angular-meta-parser/$1',
    "@angular-meta-parser": '<rootDir>/src/angular-meta-parser/index',
    '@sketch-draw/(.*)': '<rootDir>/src/sketch-generator/sketch-draw/$1',
    '@sketch-draw': '<rootDir>/src/sketch-generator/sketch-draw/index',
    '@sketch-svg-parser/(.*)*': '<rootDir>/src/sketch-generator/sketch-svg-parser/$1',
    '@color-replacer/(.*)': '<rootDir>/src/color-replacer/$1',
    '@utils/(.*)': '<rootDir>/src/utils/$1',
    '@utils': '<rootDir>/src/utils/index',
  },
  testMatch: [
    '<rootDir>/src/**/?(*.)+(e2e|test).ts',
    '<rootDir>/tests/**/?(*.)+(e2e|test).ts',
  ],
  transform: {
    '\\.(ts)$': '<rootDir>/node_modules/ts-jest/preprocessor.js',
  },
}
