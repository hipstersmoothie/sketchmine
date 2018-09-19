/// <reference path="index.d.ts" />
import * as puppeteer from 'puppeteer';
import { AssetHelper } from '../../dom-traverser/asset-helper';
import { DomVisitor } from '../../dom-traverser/dom-visitor';
import { DomTraverser } from '../../dom-traverser/dom-traverser';
import { ITraversedElement, TraversedSymbol } from '../../dom-traverser/traversed-dom';
import { Logger } from '@utils';

const log = new Logger();
export async function sketchGeneratorApi(
  browser: puppeteer.Browser,
  url: string,
  rootSelector: string,
  traverser: string,
  ): Promise<any> {

  const page = await browser.newPage();
  let resolveFinish;
  const finished = new Promise((resolve) => { resolveFinish = resolve; });

  async function resolvePending(cbID: number) {
    return await page.evaluate((cbID: number) => (window as any).sketchGenerator._resolvePending(cbID), cbID);
  }

  await page.exposeFunction('_handleFocus', async (cbID: number, selector: string) => {
    log.debug(`Puppeteer › focus:${selector}`);
    await page.focus(selector);
    return resolvePending(cbID);
  });

  await page.exposeFunction('_handleClick', async (cbID: number, selector: string) => {
    log.debug(`Puppeteer › click:${selector}`);
    await page.click(selector);
    return resolvePending(cbID);
  });

  await page.exposeFunction('_handleHover', async (cbID: number, selector: string) => {
    log.debug(`Puppeteer › hover:${selector}`);
    await page.hover(selector);
    return resolvePending(cbID);
  });

  await page.exposeFunction('_draw', async (cbID: number, symbolName: string) => {
    log.debug(`Traverser › draw Symbol ${symbolName}`);
    await page.evaluate(
      (rootSelector: string, symbolName: string) => {
        const hostElement = document.querySelector(rootSelector) as HTMLElement;
        const visitor = new DomVisitor(hostElement);
        const traverser = new DomTraverser();
        window.library.symbols.push({
          name: symbolName,
          symbol: traverser.traverse(hostElement, visitor),
        } as TraversedSymbol);
      },
      rootSelector,
      symbolName);
    return resolvePending(cbID);
  });

  await page.exposeFunction('_finish', async (cbID: number) => {
    log.debug(`Traverser › finish with all actions`);
    resolveFinish();
    return resolvePending(cbID);
  });

  await page.evaluateOnNewDocument(() => {
    const pending = new Map<number, () => void>();
    // TODO: Add asset helper
    // const images = new AssetHelper();
    window.library = {
      type: 'library',
      assets: [],
      symbols: [],
    };

    /**
     * returns new Promise for pending user action.
     * @param fn function like handleClick, handleHover or handleFocus
     * @param args [selector...]
     */
    function emitAction(fn: (...args: any[]) => void, ...args: any[]) {
      return new Promise((resolve) => {
        const id = Date.now();
        pending.set(id, () => resolve());
        fn(id, ...args);
      });
    }
    /**
     * get a useraction by id and calls the function and remove it from
     * the pending stack
     * @param cbID Id of the useraction to be resolved
     */
    function resolvePending(cbID: number) {
      const cb = pending.get(cbID);
      if (cb) {
        cb();
        pending.delete(cbID);
      }
    }

    window.sketchGenerator = {
      _resolvePending: resolvePending,
      emitClick: (selector: string) => emitAction(window._handleClick, selector),
      emitHover: (selector: string) => emitAction(window._handleHover, selector),
      emitFocus: (selector: string) => emitAction(window._handleFocus, selector),
      emitDraw: (symbolName: string) => emitAction(window._draw, symbolName),
      emitFinish: () => emitAction(window._finish),
    };
  });

  await page.evaluateOnNewDocument(traverser);
  await page.goto(url, { waitUntil: 'networkidle0' });

  await finished;

  return await page.evaluate(() => window.library) as ITraversedElement[];
}
