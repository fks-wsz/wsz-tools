import { OutputOptions, RollupOptions, rollup } from 'rollup';
import scriptConfigs, { ConfigKey as ScriptConfigKey } from './rollup.config';
import styleConfigs, { ConfigKey as StyleConfigKey } from './rollup.style';
import dtsConfigs, { ConfigKey as DtsConfigKey } from './rollup.config.dts';
import { ROLLUP_DIST_DIR, ROLLUP_DIST_TYPES_DIR } from '../../constants';
import { execSync } from 'child_process';

const compileTarget = (process.env.target || '').split(','),
  compileTargetIsSpecific = compileTarget.length > 0 && compileTarget[0] !== ''; // 编译目标

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
 * @returns {RollupOptions[]}
 */
function getCompileConfigs(): RollupOptions[] {
  if (compileTarget) {
    const configs = new Array<RollupOptions>(0);
    for (let i = 0, e = compileTarget.length; i < e; ++i) {
      const targetKey = compileTarget[i].trim();
      if (Object.prototype.hasOwnProperty.call(scriptConfigs, targetKey)) {
        configs.push(scriptConfigs[targetKey as ScriptConfigKey]);
      }
      if (Object.prototype.hasOwnProperty.call(styleConfigs, targetKey)) {
        configs.push(styleConfigs[targetKey as StyleConfigKey]);
      }
      if (Object.prototype.hasOwnProperty.call(dtsConfigs, targetKey)) {
        configs.push(dtsConfigs[targetKey as DtsConfigKey]);
      }
    }
    return configs;
  } else {
    return [...Object.values(scriptConfigs), ...Object.values(styleConfigs), ...Object.values(dtsConfigs)];
  }
}

/**
 * @description 执行构建
 * @returns {Promise<void>}
 */
(async function build() {
  const configs = getCompileConfigs();
  try {
    prebuild();
    console.log('开始构建...');
    for await (const config of configs) {
      const currentBundle = await rollup(config);
      await currentBundle.write(config.output as OutputOptions);
      await currentBundle.close();
    }
  } catch (error) {
    console.error('构建失败！:', error);
    process.exit(1);
  }
  console.log('构建完成！');
  process.exit(0);
})();
