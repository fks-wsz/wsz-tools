export const NOOP = () => {};
export const EMPTY_OBJ = __DEV__ ? Object.freeze({}) : Object.create(null);
export const EMPTY_ARR = __DEV__ ? Object.freeze([]) : new Array();
