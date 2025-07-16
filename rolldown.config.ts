import { defineConfig, RolldownOptions } from 'rolldown';
import path from 'node:path';
import { DIST_PATH, ROOT_PATH, SCRIPT_PATH, __DEV__ } from './constants';
import { defaultsDeep } from 'lodash-es';
import { dts } from 'rolldown-plugin-dts';

const entries: RolldownOptions[] = [
  {
    input: path.join(SCRIPT_PATH, 'browser/index.ts'),
    output: {
      format: 'esm',
    },
    resolve: {
      tsconfigFilename: path.join(SCRIPT_PATH, 'browser', 'tsconfig.json'),
    },
  },
  {
    input: path.join(SCRIPT_PATH, 'mp/index.ts'),
    output: {
      format: 'esm',
    },
    resolve: {
      tsconfigFilename: path.join(SCRIPT_PATH, 'mp', 'tsconfig.json'),
    },
  },
  {
    input: path.join(SCRIPT_PATH, 'node/index.ts'),
    output: {
      format: 'cjs',
    },
    resolve: {
      tsconfigFilename: path.join(SCRIPT_PATH, 'node', 'tsconfig.json'),
    },
  },
  {
    input: path.join(SCRIPT_PATH, 'common/index.ts'),
    output: {
      format: 'esm',
    },
    resolve: {
      tsconfigFilename: path.join(SCRIPT_PATH, 'common', 'tsconfig.json'),
    },
  },
];

// 公共配置
type CommonRolldownOptions = Omit<RolldownOptions, 'input'>;
const commonConfig: CommonRolldownOptions = {
  output: {
    minify: {
      removeWhitespace: !__DEV__,
      compress: !__DEV__,
    },
    sourcemap: __DEV__,
  },
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
    __PROD__: JSON.stringify(process.env.NODE_ENV === 'production'),
  },
};

// 最终配置
export default defineConfig(
  entries
    .map((entry) => {
      // 入口文件处理
      const { input } = entry;
      const targetPath = path.join(DIST_PATH, path.relative(ROOT_PATH, path.dirname(input as string)));
      const resolvedEntryConfig: RolldownOptions = {
        ...entry,
        output: {
          entryFileNames: path.join(targetPath, '[name].js'),
        },
      };
      const mergedCommonConfig = defaultsDeep(resolvedEntryConfig, commonConfig);
      return mergedCommonConfig;
    })
    .concat(
      // 类型声明生成
      entries.map((entry) => {
        const { input } = entry;
        const targetPath = path.join(DIST_PATH, 'types', path.relative(ROOT_PATH, path.dirname(input as string)));
        return {
          ...entry,
          output: {
            dir: targetPath,
          },
          plugins: [
            dts({
              tsconfig: entry.resolve?.tsconfigFilename,
              isolatedDeclarations: true,
              emitDtsOnly: true,
            }),
          ],
        };
      }),
    ),
);
