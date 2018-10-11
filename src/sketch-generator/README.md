# Sketch Generator – sketch-generator

The sketch-generator is the heart pice of this library. It takes control over generating **.sketch** files from any html that is provided to the library. It can draw a symbol Library or just a plain page. The orchestration for drawing a hole library is done by the library itself.

## Development

You need to adjust the `config.json` up to your needs like described in the [Prerequisites](#Prerequisites) section.

Afterwards just run in one window the rollup build: `npm run build:dev` this will start rollup in watch mode
with cokidar to compile the `.ts` files on the file in the specified dist folder *(specified in `./config/build.js`).
The compiled outup can easy started with `node dist/sketch-generator`.

### Prerequisites

* npm, node
* a website to be drawn

You have to edit the **config.json** to fit your needs.

there are two options to configure.

1. Drawing the Symbols Library
2. Drawing any other page

### General configuration

The general configuaration has to match the typings from `./sketch-generator.d.ts`
It has to include following properties:

```json
{
  "host": {
    "protocol": "https",
    "name": "dynatrace.com"
  },
  "rootElement": "body",
  "pages": [
    "/",
    "support/doc/appmon/",
    "support/doc/appmon/getting-started/architecture/"
  ],
  "outFile": "start-page.sketch",
  "chrome": {
    "defaultViewport": {
      "width": 800,
      "height": 600,
      "deviceScaleFactor": 1,
      "isMobile": false,
      "hasTouch": false,
      "isLandscape": false
    }
  }
}
```

The pages array is for the possibility to draw multiple pages. if only the root page should be drawn pass an empty string or a `/`.

TODO: @lukas.holzer@dynatrace.com

If the property `"metaInformation": "path/to/meta.json"` with the path to the meta information is set that holds all symbols the symbol detection can be processed.

#### Drawing the library

For drawing the Symbols Library the configuration has to include a property with `library` that points to the angular app that is served under the host informations for the command `ng serve`.

Furthermore the rootElement should be changed to get the first root element.

```json
{
  ...
  "host": {
    "protocol": "http",
    "name": "localhost",
    "port": 4200
  },
  "rootElement": "app-root > *",
  "library": {
    "app": "dist/sketch-library"
  },
  "pages": ["/"],
  "outFile": "dt-asset-lib.sketch",
  ...
}
```

### How to install

Just run `npm i` in the root.

### How to dev

For debbugging, you can specify specific debug spaces with `DEBUG=${space1},${space2},${space3}... node dist/sketch-generator`
or just set `DEBUG` to `true`.

#### Available debug spaces for granular logging:

* debug *general information about all the drawn symbols with measurements*
* dom-traverser *Result of the DOM Traverser*

### How to run tests?

**Important!**

All tests according to this space should be wrapped in a describe with the prefix: `[sketch-generator] › ...` like the following:

```typescript
//... import statements

describe('[sketch-generator] › ${folder} › ${description of the suite}', () => {

// .. your tests should place here.

});
```

There are **ts-lint** and **compiler** rules just run `npm run lint`

For tests the **jest** Framework was choosen [jestjs.io](https://jestjs.io/).
Just run `npm run test`

## Deployment

### Urls

* [webkins tests](https://webkins.lab.dynatrace.org/job/barista/job/sketch-generator/)

## Architecture

This sketch-generator is part of the .sketch generation ecosystem
