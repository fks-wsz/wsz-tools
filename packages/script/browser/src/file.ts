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
