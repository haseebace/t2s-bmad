module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\.m?tsx?$': 'ts-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@testcontainers/))'
  ],
  moduleNameMapper: {
    '^(\.{1,2}/.*)\.js$': '$1',
  },
  clearMocks: true,
};