import { defineConfig, RolldownOptions } from 'rolldown';
import path from 'node:path';
import typescript from '@rollup/plugin-typescript';
import { CWD, SCRIPT_PATH, DIST_PATH, ROOT_PATH, __DEV__ } from './constants';
import { defaultsDeep } from 'lodash-es';

// 多入口
const entries = [
  {
    input: path.join(SCRIPT_PATH, 'browser/index.ts'),
    output: {
      format: 'esm',
    },
    tsconfigPath: path.join(ROOT_PATH, 'tsconfig.browser.json'),
  },
  {
    input: path.join(SCRIPT_PATH, 'mp/index.ts'),
    output: {
      format: 'esm',
    },
    tsconfigPath: path.join(ROOT_PATH, 'tsconfig.mp.json'),
  },
  {
    input: path.join(SCRIPT_PATH, 'node/index.ts'),
    output: {
      format: 'esm',
    },
    tsconfigPath: path.join(ROOT_PATH, 'tsconfig.node.json'),
  },
] as (RolldownOptions & { tsconfigPath: string })[];

// 公共配置
type CommonRolldownOptions = Omit<RolldownOptions, 'input'>;
const commonConfig: CommonRolldownOptions = {
  output: {
    minify: {
      removeWhitespace: !__DEV__,
      compress: !__DEV__,
    },
  },
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
    __PROD__: JSON.stringify(process.env.NODE_ENV === 'production'),
  },
};

// 最终配置
export default defineConfig(
  entries.map((entry) => {
    const { tsconfigPath, input } = entry;
    const resolvedEntryConfig: RolldownOptions = {
      ...entry,
      output: {
        entryFileNames: path.join(
          DIST_PATH,
          path.relative(ROOT_PATH, path.dirname(input as string)),
          '[name].js',
        ),
      },
      plugins: [
        typescript({
          tsconfig: tsconfigPath,
          compilerOptions: {
            declarationDir: path.join(DIST_PATH, 'types'),
          },
        }),
      ],
    };
    const mergedCommonConfig = defaultsDeep(resolvedEntryConfig, commonConfig);
    return mergedCommonConfig;
  }),
);
