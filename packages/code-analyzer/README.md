# @sketchmine/code-analyzer

> Important: [Dynatrace](https://www.dynatrace.com/) internal tool. May not fit your needs.

- [@sketchmine/code-analyzer](#sketchminecode-analyzer)
  - [Dependency graph](#dependency-graph)
  - [Development](#development)
    - [command line args](#command-line-args)
    - [Prerequisites](#prerequisites)
  - [Annotations for the code](#annotations-for-the-code)
    - [How to install](#how-to-install)
    - [How to dev](#how-to-dev)
      - [Available debug spaces for granular logging:](#available-debug-spaces-for-granular-logging)
    - [How to run tests?](#how-to-run-tests)
  - [Deployment](#deployment)
    - [Urls](#urls)
  - [Architecture](#architecture)

The code-analyzer is a compiler, that generates an abstract syntax tree short AST from the
[Angular Components library](https://barista.dynatrace.com/components/) and transforms the AST to a JSON format that represents all components, that are related for the components library in sketch with all possible variants.

## Dependency graph

![Dependency graph of the sketchmine code-analyzer](https://dt-cdn.net/images/code-analyzer-3920-6b87ae5efe.png)

## Development

First you need the **Angular Components Library** source code. You can easily run a `sh ./src/code-analyzer/prepare.sh` script,
that takes control of that for you.

Afterwards just run in one window the rollup build: `npm run build:dev` this will start rollup in watch mode
with cokidar to compile the `.ts` files on the file in the specified dist folder *(specified in `./config/build.js`).
The compiled output can easy started with `node dist/code-analyzer`. The possible command line args for the application
are written as default values in the `./src/code-analyzer/config.json`. The commandline args overwrite the defaults from the JSON

### command line args

```
-h, --help              | display help
-c, --config            | path to the configuration file
--rootDir               | root dir of the angular components library
--library               | path to lib folder where the components are located from root
--inFile                | index.ts file as entry point for the lib
--outFile               | the file that holds the meta-information – as .json
```

### Prerequisites

* npm, node
* Where do I get these tools?
* Are there specific versions required?

## Annotations for the code

It is possible to add JSDoc annotatins that are specifc for the generation of the meta information abstraction of the library in case that some properties can be filled with values or classes can be ignored for design unrelated stuff.

// TODO: add optional selector to click and hoverable, to specify a trigger for clicking!

| Annotation | Explanation |
| --- | --- |
| `@internal` | Marks property, class, ..., as internal and will be ignored. The same like private class members. |
| `@design-unrelated` |  Marks property, class, ..., as unrelated for the design system and will be ignored by the parser. |
| `@design-hoverable` | the component is hoverable |
| `@design-clickable` | the component is clickable |
| `@design-prop-value "UNIQQUE_ID_FOR_ELEMENT"` | bind a custom value to a property. can be even a complex object or a number, string, etc.. [see Regex](https://regex101.com/r/SWxdIh/4) |
| `@design-param-value propToBeBinded {obj: "asdf"}` | bind a custom value to a specific param. can be even a complex object or a number, string, etc.. [see Regex](https://regex101.com/r/0scFW3/1) |
| `@no-design-combinations` | Does not combine all the properties together and did not generate all possible combinations. |
| `@design-action-timeout` | Uses a delay for drawing, if an action should be performed like an animation.|

### How to install

Just run `npm i` in the root.

### How to dev

For debbugging, you can specify specific debug spaces with `DEBUG=${space1},${space2},${space3}... node code-analyzer`
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

This code-analyzer is part of the .sketch generation ecosystem
