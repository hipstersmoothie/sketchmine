import { ElementFetcher } from "./ng-sketch/ElementFetcher";

process.env.DEBUG = 'true';
// process.env.DEBUG_BROWSER = 'true'; 

const pages = [
  '/button/button--icon', 
  // '/button/button--primary', 
  // '/button/button--secondary', 
  // '/tile/tile--default',
]

new ElementFetcher().generateSketch(pages);
