import { NOOP } from '@script/common';
import { isEmpty, isObject } from 'lodash-es';

const unitRE = /^(\d+)(rpx|px|%)?$/;

/**
 * @description 获取缩放比(适用于px)
 * @param {number} standard 设计稿宽度，默认值为 750
 * @param {number} fixed 保留小数点后几位，默认保留 2 位
 * @returns {number} 返回缩放比
 */
function getScaleRatio(standard: number = 750, fixed: number = 2): number {
  return +(uni.upx2px(750) / standard).toFixed(fixed);
}

/**
 * @description: 将传入的值转换为 该屏幕比例下相应的值
 * @param {string | number} value 要转换的值
 * @returns {string} 转换后的值(带单位)
 *
 * @example
 * unitTransform2Reactive(100) // 返回 '100rpx'
 * unitTransform2Reactive('300rpx') // 返回 '300rpx'
 * unitTransform2Reactive('200px') // 返回 '200px'
 * unitTransform2Reactive('50%') // 返回 '50%'
 */
export function unitTransform2Reactive(value: string | number): string {
  if (typeof value !== 'number' && typeof value !== 'string') {
    throw Error('单位转换失败, 传入的值必须是数字或字符串');
  }
  const valueStr = String(value).trim();
  if (!unitRE.test(valueStr)) {
    throw Error('单位转换失败, 单位必须是 以rpx 或 px 或 % 或 空结尾,例如,100rpx, 200px, 50% 或者 300');
  }
  const match = valueStr.match(unitRE),
    scale = getScaleRatio();
  // for example:
  // num is 100 or 200 ...
  // unit is only px or rpx or %
  const [, num, unit] = match || [];
  let res = '';
  if (unit) {
    if (unit === 'px') {
      res = +num * scale + unit;
    } else {
      res = +num + unit;
    }
  } else {
    res = num + 'rpx';
  }
  return res;
}

type ToastConfig = UniNamespace.ShowToastOptions;
export function copyText(text: string): Promise<void>;
export function copyText(text: string, toastConfig: ToastConfig): Promise<void>;
export function copyText(text: string, toastConfig: ToastConfig, completeFn: () => void): Promise<void>;
/**
 * @description 复制文本到os剪切板
 * @param {string} text 要复制的文本
 * @param {ToastConfig} [toastConfig] 成功弹窗配置
 * @param {() => void} [completeFn] 完成后的回调函数
 */
export function copyText(text: string, toastConfig?: ToastConfig, completeFn?: () => void): Promise<void> {
  if (typeof text !== 'string') return Promise.reject(Error('复制目标非字符串'));
  return new Promise((resolve, reject) => {
    let resolveFn = resolve;
    if (isObject(toastConfig) && !isEmpty(toastConfig)) {
      resolveFn = () => {
        uni.showToast(toastConfig);
      };
    }
    uni.setClipboardData({
      data: text,
      // #ifdef APP || H5
      showToast: false,
      // #endif
      success: resolveFn,
      fail: reject,
      complete: typeof completeFn === 'function' ? completeFn : NOOP,
    });
  });
}
