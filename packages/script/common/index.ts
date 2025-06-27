export type ErrorHandler = (e: unknown) => void;

export const NOOP = () => {};
export const EMPTY_OBJ = __DEV__ ? Object.freeze({}) : Object.create(null);
export const EMPTY_ARR = __DEV__ ? Object.freeze([]) : new Array();

let errorHandler: ErrorHandler = (error: unknown) => {
  if (__DEV__) {
    console.error('[wsz-tools] Error:', error);
  }
};
/**
 * @description 设置全局错误处理函数
 * @param {function} handler 全局错误处理函数
 */
export function setGlobalErrorHandler(handler: ErrorHandler) {
  if (typeof handler !== 'function') {
    throw new Error('[wsz-tools] Global error handler must be a function');
  }
  errorHandler = handler;
}

/**
 *
 * @param {function} fn - 调用函数
 * @param {any[]} [args] - 函数参数
 * @param {unknown} [context] - 函数上下文(this)
 * @returns
 */
export function callAndCatch(fn: Function, args?: any[], context?: unknown) {
  if (typeof fn !== 'function') throw Error(`fn is not a function, got ${typeof fn}`);
  try {
    const result = fn.apply(context, args);
    return result;
  } catch (e: unknown) {
    callAndCatch(errorHandler, [e]);
  }
}
