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
