/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard', 'stylelint-config-idiomatic-order'],
  rules: {
    'unit-no-unknown': [true, { ignoreUnits: ['rpx'] }], // rpx 支持
    'declaration-property-value-no-unknown': [true, { ignoreProperties: { '/.+/': ['/(\\d)+rpx/'] } }], // rpx 支持
  },
  overrides: [
    {
      files: ['**/*.html'],
      customSyntax: 'postcss-html', // html 样式支持
    },
    {
      files: ['**/*.vue', '*.vue'],
      extends: 'stylelint-config-standard-vue',
    },
  ],
};
