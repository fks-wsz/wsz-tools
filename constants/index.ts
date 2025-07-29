import path from 'path';

export const __DEV__ = process.env.NODE_ENV !== 'production';

export const CWD = process.cwd();
export const ROOT_PATH = path.resolve(CWD, 'packages');
export const SCRIPT_PATH = path.join(ROOT_PATH, 'script');
export const FRAMEWORK_PATH = path.join(ROOT_PATH, 'framework');
export const STYLE_PATH = path.join(ROOT_PATH, 'style');
export const TEST_PATH = path.join(CWD, 'test');
export const DIST_PATH = path.join(CWD, 'dist');
export const TYPES_PATH = path.join(DIST_PATH, 'types');
export const ROLLUP_DIST_DIR: Record<string, string> = {
  vue2: path.join(DIST_PATH, 'framework/vue/v2'),
};
export const ROLLUP_DIST_TYPES_DIR: Record<string, string> = {
  vue2: path.join(TYPES_PATH, 'framework/vue2.d.ts'),
};
