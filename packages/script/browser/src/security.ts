import { getGlobalThis } from '@script/common';

const global = getGlobalThis();

/**
 * @description 检查当前环境是否为HTTPS
 * @returns {boolean} 如果是HTTPS则返回true，否则返回false
 */
export function isHttps(): boolean {
  return global.location && global.location.protocol === 'https:';
}

/**
 * @description 检查当前环境是否为安全上下文
 * @returns {boolean} 如果是安全上下文则返回true，否则返回false
 */
export function isSecureCtx(): boolean {
  return global.isSecureContext;
}
