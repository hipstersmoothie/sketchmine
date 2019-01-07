/**
 * Sends a message to the Webview.
 * @param {browserWindow.webContents} webContents The webContents of the View.
 * @param {string | Object} message The message to send.
 */
export function sendToWebView(webContents, message) {
  webContents.executeJavaScript(`
  var message = new CustomEvent('SketchMessage', {
    bubbles: true,
    detail: ${(typeof message === 'string') ? message : JSON.stringify(message)},
  });
  window.dispatchEvent(message);
`)
  .then(() => console.log('📤 OUTGOING MESSAGE: to Webview'))
  .catch(console.error);
}
