module.exports = {
  preset: 'jest-expo',
  testPathIgnorePatterns: ['/node_modules/', '/.expo/'],
  // jest-expo resolves lucide-react-native's "react-native" package.json
  // condition, which points at an untransformed .mjs ESM build. Jest's own
  // transform only covers .js/.ts(x), so point the module at the CJS build
  // instead (Metro/the real app bundle is unaffected — this only applies
  // under Jest). Needed because src/utils/icon-map.ts imports lucide-react-native.
  moduleNameMapper: {
    '^lucide-react-native$': '<rootDir>/node_modules/lucide-react-native/dist/cjs/lucide-react-native.js',
  },
};
