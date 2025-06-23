import path from 'path';

export const __DEV__ = process.env.NODE_ENV !== 'production';

export const CWD = process.cwd();
export const ROOT_PATH = path.resolve(CWD, 'packages');
export const SCRIPT_PATH = path.join(ROOT_PATH, 'script');
export const TEST_PATH = path.join(CWD, 'test');
export const DIST_PATH = __DEV__ ? path.join(TEST_PATH, 'dist') : path.join(CWD, 'dist');
