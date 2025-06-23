const commonUnits = ['em', 'rem', 'px', 'rpx', 'vw', 'vh', '%', 'fr'];

/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard', 'stylelint-config-idiomatic-order'],
  rules: {
    'unit-no-unknown': [true, { ignoreUnits: ['rpx'] }],
    'unit-allowed-list': commonUnits,
    'declaration-property-value-no-unknown': [true, { ignoreProperties: { '/.+/': ['/[0-9]+rpx/'] } }],
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
