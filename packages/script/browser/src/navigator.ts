import { callAndCatch, getGlobalThis } from '@script/common';
import { isSecureCtx } from './security';
import { canvas2Blob } from './canvas';
import { blob2DataURL } from './file';

const global = getGlobalThis();

type WriteClipboardData = string | HTMLCanvasElement;
export let writeClipboard = async (
  data: WriteClipboardData,
  failCallback?: (...args: any[]) => any,
): Promise<boolean> => {
  const isSecure = isSecureCtx();
  writeClipboard = async function (data: WriteClipboardData, failCallback?: (...args: any[]) => any): Promise<boolean> {
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
  failCallback?: (...args: any[]) => any,
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
    processWriteClipboardText = async function (
      data: string,
      failCallback?: (...args: any[]) => any,
    ): Promise<boolean> {
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
  failCallback?: (...args: any[]) => any,
  isSecure?: boolean,
): Promise<boolean> {
  if (isSecure && global.navigator.clipboard && ClipboardItem) {
    const clipboard = global.navigator.clipboard;
    processWriteClipboardCanvas = async function (
      data: HTMLCanvasElement,
      failCallback?: (...args: any[]) => any,
    ): Promise<boolean> {
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
    processWriteClipboardCanvas = async function (
      data: HTMLCanvasElement,
      failCallback?: (...args: any[]) => any,
    ): Promise<boolean> {
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
