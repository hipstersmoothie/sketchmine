declare var window: any;

export function waitForDraw(): Promise<void> {
  return new Promise((res) => {
    // Timeout as Fallback if the requestIdleCallback needs longer than 5sec
    const timeoutId = setTimeout(res, 5000);
    /** @see https://developers.google.com/web/updates/2015/08/using-requestidlecallback */
    window.requestIdleCallback(() => {
      clearTimeout(timeoutId);
      res();
    });
  });
}
