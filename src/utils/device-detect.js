/**
 * Detects current client device, OS, browser, screen size, and touch capabilities
 */
export function getDeviceInfo() {
  if (typeof window === 'undefined') {
    return {
      deviceType: 'Desktop',
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      os: 'Unknown',
      browser: 'Unknown',
      screenWidth: 1920,
      screenHeight: 1080,
      isTouch: false
    };
  }

  const ua = navigator.userAgent || '';
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  let os = 'Unknown OS';
  if (/windows/i.test(ua)) os = 'Windows';
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
  else if (/linux/i.test(ua)) os = 'Linux';

  let browser = 'Unknown Browser';
  if (/chrome|crios/i.test(ua) && !/edge|edg|opr\//i.test(ua)) browser = 'Google Chrome';
  else if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) browser = 'Safari';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/edg/i.test(ua)) browser = 'Microsoft Edge';
  else if (/opr\//i.test(ua)) browser = 'Opera';

  let isMobile = false;
  let isTablet = false;
  let isDesktop = false;
  let deviceType = 'Desktop';

  if (screenWidth < 768 || /mobile|iphone|ipod|android.*mobile/i.test(ua)) {
    isMobile = true;
    deviceType = 'Mobile';
  } else if (screenWidth < 1024 || /ipad|tablet/i.test(ua)) {
    isTablet = true;
    deviceType = 'Tablet';
  } else {
    isDesktop = true;
    deviceType = 'Desktop';
  }

  return {
    deviceType,
    isMobile,
    isTablet,
    isDesktop,
    os,
    browser,
    screenWidth,
    screenHeight,
    isTouch
  };
}
