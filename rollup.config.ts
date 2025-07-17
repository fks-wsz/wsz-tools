import vue from 'rollup-plugin-vue';
import { FRAMEWORK_PATH, DIST_PATH } from './constants';
import path from 'path';
import { defineConfig } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';

const configs = {
  vue2: defineConfig({
    input: path.join(FRAMEWORK_PATH, 'vue/v2', 'index.js'),
    output: {
      format: 'es',
      dir: path.join(DIST_PATH, 'framework/vue/v2/'),
    },
    external: ['vue'],
    plugins: [
      resolve(),
      postcss({
        use: ['less'],
        extensions: ['.css', '.less'],
        extract: true,
        minimize: true,
      }),
      vue({
        css: false,
      }),
    ],
  }),
};

export default Object.values(configs);
