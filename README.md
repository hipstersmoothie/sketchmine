# 💎 Amgular to Sketch App Generator 💎 

Generates a Sketch App Symbol library out of the Dynatrace Components Library.


## How to get running? 🛵
The generator needs a list of pages (urls) to crawl and draw. 
Each page is drawn as own Symbol. 
To modify the host of the page go to `./ng-sketch/ElementFetcher.ts` and update the **_host** variable:
``` typescript
private static _host = 'http://localhost:4200';
```

Just start the angular app on port **4200**, and pass the pages for the symbols in the index.ts
then hit in the terminal `npm start` and your sketch file is generated!

```typescript
const pages = [
  '/button/button--icon',
  '/button/button--primary',
  '/button/button--secondary',
  '/tile/tile--default',
];

new ElementFetcher().generateSketchFile(pages);
```


### Debugging 🚨
There are some debugging variables specified to modify the console output.

``` javascript
process.env.DEBUG = 'true';
process.env.DEBUG_SVG = 'true';
process.env.DEBUG_BROWSER = 'true'; 
```

### Testing the SVG generator 📉
Import the testfile from the **sketchSvgParser** where you can create symbols with an svg

``` typescript
import './ng-sketch/sketchSvgParser/test';
```

#### Maintainer
[Lukas Holzer](lukas.holzer@dynatrace.com)
