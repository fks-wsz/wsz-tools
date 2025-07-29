import vue from 'rollup-plugin-vue';
import { FRAMEWORK_PATH, DIST_PATH, SCRIPT_PATH } from '../../constants';
import path from 'path';
import { __DEV__ } from '../../constants';
import { defineConfig } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import alias from '@rollup/plugin-alias';
import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';

const configs = {
  vue2: defineConfig({
    input: path.join(FRAMEWORK_PATH, '/vue/v2/', 'index.ts'),
    output: {
      format: 'es',
      dir: path.join(DIST_PATH, 'framework/vue/v2/'),
    },
    external: ['vue'],
    plugins: [
      replace({
        __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
        __PROD__: JSON.stringify(process.env.NODE_ENV === 'production'),
      }),
      alias({
        entries: [
          {
            find: '@script/common',
            replacement: path.join(SCRIPT_PATH, 'common'),
          },
        ],
      }),
      resolve({
        extensions: ['.js', '.ts', '.vue'],
        modulesOnly: true,
      }),
      vue({
        css: false,
      }),
      typescript({
        tsconfig: path.join(FRAMEWORK_PATH, '/vue/v2/', 'tsconfig.json'),
      }),
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
