export const NOOP = () => {};
export const EMPTY_OBJ = __DEV__ ? Object.freeze({}) : Object.create(null);
export const EMPTY_ARR = __DEV__ ? Object.freeze([]) : new Array();

export function debounce(
  fn: Function,
  delay: number,
  options?: { immediate?: boolean; inDelayFn?: Function; maxDelay?: number },
) {
  let lastStamp = 0;
  const { immediate } = options || EMPTY_OBJ;
  let initImmediate = !immediate;
  return function (this: unknown) {
    const now = Date.now();
    if (!initImmediate && immediate) {
      // 是否立即执行
      initImmediate = true;
      lastStamp = now;
      callAndCatch(fn, Array.from(arguments), this);
      return;
    }
    if (now - lastStamp >= delay) {
      // 超过了延迟时间
      callAndCatch(fn, Array.from(arguments), this);
      lastStamp = now;
    } else {
      // 没有超过延迟时间
      lastStamp = now;
      const { inDelayFn } = options || EMPTY_OBJ;
      if (typeof inDelayFn === 'function') {
        callAndCatch(inDelayFn);
      }
    }
  };
}

export function throttle(fn: Function, delay: number, options?: { immediate?: Function; inDelayFn: Function }) {}

export function callAndCatch(fn: Function, args?: any[], context?: unknown, errorHandler?: Function) {
  if (typeof fn !== 'function') throw Error(`fn is not a function, got ${typeof fn}`);
  try {
    const result = fn.apply(context, args);
    return result;
  } catch (e: unknown) {
    if (__DEV__) {
      console.error('Error in callAndCatch:', e);
    }
    if (typeof errorHandler === 'function') {
      callAndCatch(errorHandler, [e]);
    }
  }
}
