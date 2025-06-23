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
      initImmediate = true;
      lastStamp = now;
      callAndCatch(fn, Array.from(arguments), this);
      return;
    }
    if (now - lastStamp >= delay) {
      callAndCatch(fn, Array.from(arguments), this);
      lastStamp = now;
    } else {
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
    fn.apply(context, args);
  } catch (e: unknown) {
    if (__DEV__) {
      console.error('Error in callAndCatch:', e);
    }
    if (typeof errorHandler === 'function') {
      callAndCatch(errorHandler, [e]);
    }
  }
}
