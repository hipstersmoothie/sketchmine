import BrowserWindow from 'sketch-module-web-view';
import sketch from 'sketch';
import { Document } from 'sketch/dom';
import { sendToWebView } from './utils/send-to-webview';
import { playSound } from './utils/play-sound';
import { getFileFormat } from './utils/get-file-format';
import { selectElement } from './utils/select-element';


export default function() {
  const options = {
    identifier: 'com.dynatrace.kraken-validation',
    acceptFirstMouse: true,
    alwaysOnTop: true,
    width: 680,
    height: 700,
    minHeight: 300,
    minWidth: 600,
    show: false,
  };

  const currentDocument = Document.getSelectedDocument();

  if (!currentDocument) {
    playSound('Basso');
    console.log('Please select a Document!');
    return;
  }

  var browserWindow = new BrowserWindow(options);

  // only show the window when the page has loaded
  browserWindow.once('ready-to-show', () => {
    browserWindow.show();
  });

  const webContents = browserWindow.webContents;

  // print a message when the page loads
  // webContents.on('did-finish-load', () => {});

  /**
   * @param {string} messageString the incoming string from the webview
   * the string is an Object with following properties
   * @example
   * {
   *   _id: number
   *   type: 'inform' | 'message' | selectElement | document
   *   data: any
   * }
   */
  webContents.on('SketchMessage', (messageString) => {
    const eventObj = JSON.parse(messageString);
    console.log(`✉️ INCOMING MESSAGE: from the webView (${eventObj.type})>>`);

    const response = { _id: eventObj._id };

    switch (eventObj.type) {
      case 'message':
      case 'inform':
        sketch.UI.message(eventObj.data);
        break;
      case 'selectElement':
        selectElement(currentDocument, eventObj.data);
        break;
      case 'playSound':
        playSound(eventObj.data);
        break;
      case 'documentMeta':
        response.data = getFileFormat(currentDocument, true);
        break;
      case 'document':
        response.data = getFileFormat(currentDocument);
        break;
      default: 
        console.log(`🚨 ERROR: Unknown event was fired with type: ${event.type}`);
        return;
    }
    
    sendToWebView(webContents, response);
  });

  browserWindow.loadURL('https://sketch-validation-interface-r39ibfqyj.now.sh/');
}
