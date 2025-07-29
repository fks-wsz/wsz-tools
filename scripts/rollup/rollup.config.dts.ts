import { defineConfig } from 'rollup';
import { FRAMEWORK_PATH, DIST_PATH } from '../../constants';
import path from 'path';
import { dts } from 'rollup-plugin-dts';

const configs = {
  vue2: defineConfig({
    input: path.join(FRAMEWORK_PATH, '/vue/v2/', 'index.ts'),
    output: {
      file: path.join(DIST_PATH, 'types/framework/vue2.d.ts'),
      format: 'es',
    },
    plugins: [dts()],
  }),
};

export type ConfigKey = keyof typeof configs;
export default configs;
