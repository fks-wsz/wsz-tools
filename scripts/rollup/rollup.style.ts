import { defineConfig } from 'rollup';
import { FRAMEWORK_PATH, DIST_PATH, STYLE_PATH } from '../../constants';
import path from 'path';
import postcss from 'rollup-plugin-postcss';

const configs = {
  vue2: defineConfig({
    input: path.join(FRAMEWORK_PATH, 'vue/v2/styles/index.less'),
    output: {
      file: path.join(DIST_PATH, 'framework/vue/v2/style/index.css'),
      paths: {
        '@style/tools': STYLE_PATH,
      },
    },
    plugins: [
      postcss({
        use: ['less'],
        extensions: ['.css', '.less'],
        extract: true,
        minimize: true,
      }),
    ],
  }),
};

export type ConfigKey = keyof typeof configs;
export default configs;
