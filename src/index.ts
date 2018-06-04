import { ElementFetcher } from "./ng-sketch/ElementFetcher";
import { SvgParser } from "./ng-sketch/sketchSvgParser/SvgParser";
import { Sketch } from "ng-sketch/sketchJSON/Sketch";
import { Page } from "ng-sketch/sketchJSON/models/Page";

process.env.DEBUG = 'true';
// process.env.DEBUG_SVG = 'true';
// process.env.DEBUG_BROWSER = 'true'; 

const pages = [
  '/icon/icon--agent',
  '/icon/icon--richface',
  '/button/button--icon', 
  '/button/button--primary', 
  '/button/button--secondary', 
  '/tile/tile--default',
];

// import './ng-sketch/sketchSvgParser/test';
new ElementFetcher().generateSketchFile(pages);
