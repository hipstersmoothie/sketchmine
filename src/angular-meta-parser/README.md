# Angular Meta Parser – angular-meta-parser

The angular-meta-parser is a compiler, that generates an abstract syntax tree short AST from the
Angular Components library and transforms the AST to a JSON format that represents all components,
that are related for the components library in sketch with all possible variants

## Development

First you need the **Angular Components Library** source code. You can easily run a `sh ./src/angular-meta-parser/prepare.sh` script,
that takes control of that for you.

Afterwards just run in one window the rollup build: `npm run build:dev` this will start rollup in watch mode
with cokidar to compile the `.ts` files on the file in the specified dist folder *(specified in `./config/build.js`).
The compiled outup can easy started with `npm run run:angular-meta-parser`. The possible command line args for the application
are written as default values in the `./src/angular-meta-parser/config.json`. The commandline args overwrite the defaults from the JSON

### Prerequisites

* npm, node
* Where do I get these tools? 
* Are there specific versions required?

### How to install

Just run `npm i` in the root.

### How to dev

For debbugging, you can specify specific debug spaces with `DEBUG=${space1},${space2},${space3}... node angular-meta-parser`
or just set `DEBUG` to `true`.

#### Available debug spaces for granular logging:

* annotations

### How to run tests?

There are **ts-lint** and **compiler** rules just run `npm run lint`

For tests the **jest** Framework was choosen [jestjs.io](https://jestjs.io/).
Just run `npm run test`

## Deployment

### Urls

* [webkins tests](https://webkins.lab.dynatrace.org/job/barista/job/sketch-generator/)

## Architecture

This angular-meta-parser is part of the .sketch generation ecosystem
