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

/**
 * @description 将 Blob 对象转换为 Data URL
 * @param {Blob} blob - 要转换的 Blob 对象
 * @returns {Promise<string>} - 返回 Data URL 字符串
 */
export function blob2DataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (error: unknown) => {
      reject(error);
    };
    reader.readAsDataURL(blob);
  });
}
