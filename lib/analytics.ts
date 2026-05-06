export function parseUserAgent(ua: string | null) {
  if (!ua) {
    return { device: "unknown", browser: "unknown", os: "unknown" };
  }

  const browser = /chrome/i.test(ua)
    ? "Chrome"
    : /safari/i.test(ua)
      ? "Safari"
      : /firefox/i.test(ua)
        ? "Firefox"
        : "Other";

  const os = /windows/i.test(ua)
    ? "Windows"
    : /android/i.test(ua)
      ? "Android"
      : /iphone|ios/i.test(ua)
        ? "iOS"
        : /mac/i.test(ua)
          ? "macOS"
          : "Other";

  const device = /mobile/i.test(ua) ? "mobile" : "desktop";

  return { device, browser, os };
}
