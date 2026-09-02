export function isMobileDevice(): boolean {
  const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const uaMatch = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  return hasTouch && uaMatch;
}
