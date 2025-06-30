import { getGlobalThis } from '@script/common';

const global = getGlobalThis();

/**
 * @description 将 canvas 转换为 Blob 对象
 * @param {HTMLCanvasElement} canvas
 * @param options
 * @param {string} options.type - Blob 类型, 默认为 'image/png'
 * @param {number} [options.quality] - 图片质量, 仅在 type 为 'image/jpeg' 或 'image/webp' 时有效
 * @returns {Promise<Blob>}
 */
export function canvas2Blob(canvas: HTMLCanvasElement, options?: { type?: string; quality?: number }): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas 转 Blob 失败'));
        }
      },
      options?.type ?? 'image/png',
      options?.quality,
    );
  });
}
