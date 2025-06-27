export type ErrorHandler = (e: unknown) => void;
export type CommonFn = (...args: any[]) => any;

export const NOOP = () => {};
export const EMPTY_OBJ = __DEV__ ? Object.freeze({}) : Object.create(null);
export const EMPTY_ARR = __DEV__ ? Object.freeze([]) : new Array();

// 默认错误处理函数
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
export function callAndCatch<T extends CommonFn>(fn: T, args?: Parameters<T>, context?: unknown): ReturnType<T> | void {
  if (typeof fn !== 'function') throw Error(`fn is not a function, got ${typeof fn}`);
  try {
    const result = fn.apply(context, args || []);
    return result;
  } catch (e: unknown) {
    callAndCatch(errorHandler, [e]);
  }
}

/**
 * @description 获取当前环境全局对象
 * @returns {typeof globalThis} - 返回当前环境全局对象
 */
export function getGlobalThis(): typeof globalThis {
  if (typeof globalThis !== 'undefined') return globalThis;
  if (typeof self !== 'undefined') return self;
  if (typeof window !== 'undefined') return window;
  if (typeof global !== 'undefined') return global;
  // fallback
  return Function('return this')();
}
