import { callAndCatch, CommonFn, getGlobalThis, EMPTY_OBJ } from '@script/common';
import { blob2DataURL, canvas2Blob } from './canvas';
import { isSecureCtx } from './security';
import { write } from 'fs';

const global = getGlobalThis();

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
      // 立即执行
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

type WriteClipboardData = string | HTMLCanvasElement;
export let writeClipboard = async (data: WriteClipboardData, failCallback?: CommonFn): Promise<boolean> => {
  const isSecure = isSecureCtx();
  writeClipboard = async function (data: WriteClipboardData, failCallback?: CommonFn): Promise<boolean> {
    if (typeof data === 'string') {
      return processWriteClipboardText(data, failCallback, isSecure);
    } else if (data instanceof HTMLCanvasElement) {
      return processWriteClipboardCanvas(data, failCallback, isSecure);
    }
    return false;
  };
  return writeClipboard(data, failCallback);
};

let processWriteClipboardText = async function (
  data: string,
  failCallback?: CommonFn,
  isSecure?: boolean,
): Promise<boolean> {
  if (isSecure && global.navigator.clipboard) {
    // 如果浏览器支持 Clipboard API 且处于安全上下文
    const clipboard = global.navigator.clipboard;
    processWriteClipboardText = async function (data: string) {
      let isCopySuccess = true;
      let error: unknown;

      await (clipboard as Clipboard).writeText(data).catch((err: unknown) => {
        isCopySuccess = false;
        error = err;
      });
      if (!isCopySuccess) {
        if (typeof failCallback === 'function') {
          callAndCatch(failCallback, [error]);
        } else {
          console.error('[wsz-tools] 剪切板写入错误:', error);
        }
      }
      return isCopySuccess;
    };
  } else if (document.execCommand) {
    // 传统复制
    const clipboard = document.execCommand.bind(document);
    processWriteClipboardText = async function (data: string, failCallback?: CommonFn): Promise<boolean> {
      let isCopySuccess = true;
      const el = document.createElement('textarea');
      el.textContent = data;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      try {
        (clipboard as typeof document.execCommand)('copy');
      } catch (error: unknown) {
        isCopySuccess = false;
        if (typeof failCallback === 'function') {
          callAndCatch(failCallback, [error]);
        } else {
          console.error('[wsz-tools] 剪切板写入错误:', error);
        }
      }
      document.body.removeChild(el);
      return isCopySuccess;
    };
  }
  return processWriteClipboardText(data, failCallback);
};

let processWriteClipboardCanvas = async function (
  data: HTMLCanvasElement,
  failCallback?: CommonFn,
  isSecure?: boolean,
): Promise<boolean> {
  if (isSecure && global.navigator.clipboard && ClipboardItem) {
    const clipboard = global.navigator.clipboard;
    processWriteClipboardCanvas = async function (data: HTMLCanvasElement, failCallback?: CommonFn): Promise<boolean> {
      let isCopySuccess = true,
        error: unknown;
      const blob = await canvas2Blob(data);
      if (ClipboardItem.supports(blob.type)) {
        // 判断类型 仅支持 image/png, 也可能支持 image/svg+xml
        const items = [new ClipboardItem({ [blob.type]: blob })];
        await clipboard.write(items).catch((err: unknown) => {
          isCopySuccess = false;
          error = err;
        });
      } else {
        isCopySuccess = false;
        error = new Error(`类型不支持: ${blob.type}`);
      }
      if (!isCopySuccess) {
        if (typeof failCallback === 'function') {
          callAndCatch(failCallback, [error]);
        } else {
          console.error('[wsz-tools] 剪切板写入错误:', error);
        }
      }
      return isCopySuccess;
    };
  } else if (document.execCommand) {
    const clipboard = document.execCommand.bind(document);
    processWriteClipboardCanvas = async function (data: HTMLCanvasElement, failCallback?: CommonFn): Promise<boolean> {
      let isCopySuccess = true,
        error: unknown;
      const el = document.createElement('textarea');
      const blob = await canvas2Blob(data);
      const imgDataUrl = await blob2DataURL(blob);
      let htmlText = `<img src="${imgDataUrl}" />`;
      el.innerHTML = htmlText;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      try {
        console.warn(`[wsz-tools] 不支持Clipboard API, 图片将复制为 html`);
        (clipboard as typeof document.execCommand)('copy');
      } catch (err: unknown) {
        isCopySuccess = false;
        error = err;
        if (typeof failCallback === 'function') {
          callAndCatch(failCallback, [error]);
        } else {
          console.error('[wsz-tools] 剪切板写入错误:', error);
        }
      }
      return isCopySuccess;
    };
  }
  return processWriteClipboardCanvas(data, failCallback);
};
