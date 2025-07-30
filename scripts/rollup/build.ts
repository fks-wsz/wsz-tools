import { OutputOptions, RollupOptions, WatcherOptions, watch, rollup } from 'rollup';
import scriptConfigs, { ConfigKey as ScriptConfigKey } from './rollup.config';
import styleConfigs, { ConfigKey as StyleConfigKey } from './rollup.style';
import dtsConfigs, { ConfigKey as DtsConfigKey } from './rollup.config.dts';
import { ROLLUP_DIST_DIR, ROLLUP_DIST_TYPES_DIR, __DEV__ } from '../../constants';
import { execSync } from 'child_process';

const compileTarget = (process.env.target || '').split(','),
  compileTargetIsSpecific = compileTarget.length > 0 && compileTarget[0] !== ''; // 编译目标
const shouldWatch = __DEV__;

type ConfigKey = ScriptConfigKey | StyleConfigKey | DtsConfigKey;
type RollupTagOptions = RollupOptions & { tag?: string };

/**
 * @description 清理 dist 目录
 * @returns {void}
 */
function prebuild() {
  let cleanDistPaths = '';
  if (compileTargetIsSpecific) {
    cleanDistPaths = compileTarget.reduce((pre, cur) => {
      if (ROLLUP_DIST_DIR[cur]) {
        pre += ` ${ROLLUP_DIST_DIR[cur]}`;
      }
      if (ROLLUP_DIST_TYPES_DIR[cur]) {
        pre += ` ${ROLLUP_DIST_TYPES_DIR[cur]}`;
      }
      return pre;
    }, '');
  } else {
    cleanDistPaths = Object.values(ROLLUP_DIST_DIR).concat(Object.values(ROLLUP_DIST_TYPES_DIR)).join(' ');
  }
  execSync(`npx rimraf ${cleanDistPaths}`, { stdio: 'inherit' });
  console.log('执行清理完成！');
}

/**
 * @description 获取编译配置
 * @returns {RollupTagOptions[]}
 */
function getCompileConfigs(): RollupTagOptions[] {
  if (compileTarget) {
    const configs = new Array<RollupTagOptions>(0);
    for (let i = 0, e = compileTarget.length; i < e; ++i) {
      const targetKey = compileTarget[i].trim() as ConfigKey;
      if (Object.prototype.hasOwnProperty.call(scriptConfigs, targetKey)) {
        configs.push(tagConfig(scriptConfigs[targetKey as ScriptConfigKey], targetKey + '[Script]'));
      }
      if (Object.prototype.hasOwnProperty.call(styleConfigs, targetKey)) {
        configs.push(tagConfig(styleConfigs[targetKey as StyleConfigKey], targetKey + '[Style]'));
      }
      if (Object.prototype.hasOwnProperty.call(dtsConfigs, targetKey)) {
        configs.push(tagConfig(dtsConfigs[targetKey as DtsConfigKey], targetKey + '[Dts]'));
      }
    }
    return configs;
  } else {
    return [...Object.values(scriptConfigs), ...Object.values(styleConfigs), ...Object.values(dtsConfigs)];
  }
}

function tagConfig(config: RollupOptions, target: string): RollupTagOptions {
  return {
    ...config,
    tag: target,
  };
}

function getWatchConfigs(): WatcherOptions {
  const configs: WatcherOptions = {};
  configs.clearScreen = true;
  configs.exclude = ['node_modules/**', 'dist/**', 'types/**'];
  return configs;
}

/**
 * @description 执行构建
 * @returns {Promise<void>}
 */
(async function build() {
  const configs = getCompileConfigs(),
    watchConfigs = getWatchConfigs();

  try {
    prebuild();
    console.log('开始构建...');
    if (shouldWatch) {
      processWatchBuild(configs, watchConfigs);
    } else {
      await processBuild(configs);
      console.log('构建完成！');
      process.exit(0);
    }
  } catch (error) {
    console.error('构建失败！:', error);
    process.exit(1);
  }
})();

async function processBuild(configs: RollupOptions | RollupOptions[]) {
  if (!Array.isArray(configs) && configs) {
    configs = [configs];
  }
  for await (const config of configs) {
    const currentBundle = await rollup(config);
    await currentBundle.write(config.output as OutputOptions);
    await currentBundle.close();
  }
}

function processWatchBuild(configs: RollupTagOptions | RollupTagOptions[], watchConfigs: WatcherOptions) {
  if (!Array.isArray(configs) && configs) {
    configs = [configs];
  }

  for (const config of configs) {
    const { tag, input = Object.create(null) } = config;
    const mergedConfig = { ...input, ...config, watch: watchConfigs };
    const watcher = watch(mergedConfig);
    watcher.on('event', (event) => {
      const { code } = event;
      if (code === 'BUNDLE_START') {
        console.log(`开始(重新)构建 ${tag}...`);
      } else if (code === 'BUNDLE_END') {
        const { duration, output, result } = event;
        if (result) {
          result.write(config.output as OutputOptions).then(() => {
            console.log(`构建${tag}完成！ 用时: ${(duration / 1000).toFixed(2)}s`);
            result.close();
          });
        }
      } else if (code === 'ERROR') {
        console.error('构建${tag}失败！:', event.error);
      }
    });
  }
}
