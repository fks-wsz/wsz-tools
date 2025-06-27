import { callAndCatch, CommonFn, EMPTY_OBJ } from '@script/common';

export function getDOM(id: string): HTMLElement | null {
  return document.getElementById(id);
}

export function print(text: string): void {
  console.log('text --->', text);
}

/**
 * @description 防抖函数
 * @param {function} fn - 目标函数
 * @param {number} delay - 延迟时间(ms)
 * @param {object} options - 选项对象
 * @param {boolean} options.immediate - 是否立即执行
 * @param {function} options.inDelayFn - 在延迟期间调用的函数, 例如显示提示等
 * @param {number} options.maxDelay - 最大延迟时间(ms), 超过此时间将立即执行
 * @returns {function}
 */
export function debounce(
  fn: CommonFn,
  delay: number = 1000,
  options?: { immediate?: boolean; inDelayFn?: CommonFn; maxDelay?: number },
) {
  const { immediate, inDelayFn, maxDelay } = options || EMPTY_OBJ;
  let timer: number | null = null,
    lastCallOrInitStamp: number | undefined = undefined, // 上次调用或初始时间戳
    initImmediate = !immediate; // 是否已经初始化立即执行

  // 调用目标函数并记录
  function callAndRecord(this: unknown, ...args: any[]) {
    callAndCatch(fn, Array.from(args), this);
    lastCallOrInitStamp = Date.now();
  }

  return function (this: unknown, ...args: any[]) {
    const now = Date.now();
    if (typeof immediate === 'boolean' && !initImmediate && immediate) {
      // 是否立即执行
      initImmediate = true;
      return callAndRecord.apply(this, args);
    }
    if (timer !== null) {
      // 没有超过延迟时间
      if (now - lastCallOrInitStamp! >= maxDelay) {
        // 超过最大延迟时间
        clearTimeout(timer);
        return callAndRecord.apply(this, args);
      }

      clearTimeout(timer);
      timer = window.setTimeout(() => {
        callAndRecord.apply(this, args);
        timer = null;
      }, delay);
      if (typeof inDelayFn === 'function') {
        callAndCatch(inDelayFn);
      }
    } else {
      if (!lastCallOrInitStamp) {
        lastCallOrInitStamp = now; // 记录开始调用时间, 用于后续判断是否超过最大延迟时间
      }
      timer = window.setTimeout(() => {
        callAndRecord.apply(this, args);
        timer = null;
      }, delay);
    }
  };
}

/**
 * @description 节流函数
 * @param {function} fn - 目标函数
 * @param {number} delay - 间隔时间(ms)
 * @param {object} options
 * @param {boolean} options.immediate - 是否立即执行
 * @param {function} options.inDelayFn - 在延迟期间调用的函数, 例如显示提示等
 * @returns { function }
 */
export function throttle(
  fn: CommonFn,
  delay: number,
  options?: { immediate?: boolean; inDelayFn?: CommonFn; maxDelay?: number } | undefined,
) {
  return debounce(fn, delay, {
    maxDelay: delay,
    ...options,
  });
}
