import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';

const enum MessageType  {
  Inform = 'inform',
  Document = 'document',
  DocumentMeta = 'documentMeta',
  SelectElement = 'selectElement',
  PlaySound = 'playSound',
}

export interface DocumentMetaResponseData {
  path: string;
  pages: any[];
}

export interface DocumentResponseData extends DocumentMetaResponseData {
  document: any;
}

export interface Response<T> {
  _id: number;
  data?: T;
}

export interface Request<T> extends Response<T> {
  type: MessageType;
}

export interface MessageEvent<T> extends CustomEvent {
  detail: Response<T>;
}

const MESSAGE_ORIGIN = 'http://localhost:4200';
let uniqueId = 0;

@Injectable({
  providedIn: 'root',
})
export class CommunicationService implements OnDestroy {

  private isSketchContext: boolean = isSketchContext();
  private openRequests = new Map<number, Subject<any>>();
  private messageDisposable = () => {};

  constructor() {
    const callback = event => this.handleResponse(event);
    window.addEventListener('SketchMessage', callback as any);
    this.messageDisposable = () => window.removeEventListener('SketchMessage', callback as any, false);
  }

  ngOnDestroy() {
    this.messageDisposable();
    this.openRequests.forEach(sbj => sbj.complete());
    this.openRequests.clear();
  }

  /**
   * logs a message to the Sketch UI
   * @param message message to be logged to sketch
   */
  inform(message: string): Observable<void> {
    return this.postMessage(MessageType.Inform, message);
  }

  getDocumentMeta(): Observable<DocumentMetaResponseData> {
    return this.postMessage<DocumentMetaResponseData>(MessageType.DocumentMeta);
  }

  /** Requests the actual document to be sent to sketch */
  getDocument(): Observable<DocumentResponseData> {
    return this.postMessage<DocumentResponseData>(MessageType.Document);
  }

  playSound(type: string): Observable<void> {
    return this.postMessage(MessageType.PlaySound, type);
  }

  /**
   * Selects an object in Sketch by it's id
   * @param id Unique ID (RCF4 compliant) of the object in sketch
   */
  selectElement(id: string): Observable<void> {
    return this.postMessage(MessageType.SelectElement, id);
  }

  private postMessage<T>(type: MessageType, data?: any) {
    const event: Request<T> = {
      _id: uniqueId += 1,
      type,
      data,
    };
    const sbj = new Subject<T>();
    this.openRequests.set(event._id, sbj);
    if (this.isSketchContext) {
      // sketch implemented postMessage differently
      (window as any).postMessage('SketchMessage', JSON.stringify(event));
    } else {
      window.postMessage(JSON.stringify(event), MESSAGE_ORIGIN);
    }
    return sbj.asObservable();
  }

  private handleResponse<T>(event: MessageEvent<T>) {
    if (event.detail && event.detail._id !== undefined) {
      const sbj = this.openRequests.get(event.detail._id);
      if (sbj) {
        sbj.next(event.detail.data);
        sbj.complete();
        this.openRequests.delete(event.detail._id);
      } else {
        console.error(`No open request found with id ${event.detail._id}`);
      }
    }
  }
}

/**
 * Check if we are in the Sketch Webview Context
 * they have overridden the postMessage function so that it should throw an error in the
 * normal browser window.
 */
function isSketchContext() {
  try {
    (window as any).postMessage('');
    return false;
  } catch {
    return true;
  }
}
