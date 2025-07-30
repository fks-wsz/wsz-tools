import { getGlobalThis } from '@script/common';

const globalThis = getGlobalThis();

export function isMiniProgram(): boolean {
  if (typeof uni !== 'undefined') {
    return true;
  }

  if (typeof wx !== 'undefined' && wx.getSystemInfoSync) {
    return true;
  }

  if (typeof my !== 'undefined' && my.getSystemInfoSync) {
    return true;
  }

  if (typeof navigator !== 'undefined') {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('miniprogram') || ua.includes('micromessenger')) {
      return true;
    }
  }

  return false;
}

export const isBrowser: boolean =
  typeof globalThis !== 'undefined' && typeof (globalThis as any)?.document !== 'undefined';

export const isNode: boolean =
  typeof globalThis !== 'undefined' &&
  typeof (globalThis as any).process !== 'undefined' &&
  (globalThis as any).process.versions != null &&
  (globalThis as any).process.versions.node != null;
