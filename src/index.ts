import { ElementFetcher } from './ng-sketch/ElementFetcher';
import { SvgParser } from './ng-sketch/sketchSvgParser/SvgParser';
import { Sketch } from 'ng-sketch/sketchJSON/Sketch';
import { Page } from 'ng-sketch/sketchJSON/models/Page';

const pages = [
  '/icon/icon--agent',
  // '/icon/icon--richface',
  // '/button/button--icon',
  // '/button/button--primary',
  // '/button/button--secondary',
  // '/tile/tile--default',
];

// import './ng-sketch/sketchSvgParser/test';
const elementFetcher = new ElementFetcher();
elementFetcher.host = 'http://localhost:4200';
elementFetcher.generateSketchFile(pages);
