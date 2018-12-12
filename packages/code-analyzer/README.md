![Github banner for sketchmine](https://dt-cdn.net/images/github-banner-2x-1777-2b23e499af.png)

# @sketchmine/code-analyzer

> **Note**: This is a [Dynatrace](https://www.dynatrace.com/) internal tool that may not fit your needs.

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

The code-analyzer works like a compiler, analyzing the provided source code of the [Angular Component Libraries](https://barista.dynatrace.com/components/) and generating an abstract syntax tree (AST) from the Angular components. The output of the meta information is provided in JSON format and contains all information about all the components in the library and their variants.

This solution is currently tailored for the Dynatrace Angular Component Libraries. Feel free to commit a pull request with your solution for your company.

## Dependency graph

![Dependency graph of the sketchmine code-analyzer](https://dt-cdn.net/images/code-analyzer-3920-6b87ae5efe.png)

## Development

First, you need the **Angular Component Libraries** source code. You can easily run a `sh ./src/code-analyzer/prepare.sh` script,
which takes care of this for you.

Afterward, run the rollup build in one window: `npm run build:dev` this will start rollup in watch mode with cokidar to compile the `.ts` files on the file in the specified dist folder (specified in `./config/build.js`).
The compiled output can easily be started with `node dist/code-analyzer`. The possible command line arguments for the application
are written as default values in the `./src/code-analyzer/config.json`. The commandline arguments overwrite the defaults from the JSON.

### Command line arguments

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

It's possible to add JSDoc annotations that are specific for the generation of the meta information abstraction of the library in case some properties are filled with values or classes that can be ignored for design unrelated stuff. <!-- I do not understand this previous sentence -->

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

### How to develop

For debbugging, you can specify specific debug spaces with `DEBUG=${space1},${space2},${space3}... node code-analyzer`
or just set `DEBUG` to `true`.

#### Available debug spaces for granular logging:

* annotations

### How to run tests

There are **ts-lint** and **compiler** rules. Just run `npm run lint`.

For tests, the [Jest framework](https://jestjs.io/) was selected.
Just run `npm run test`

## Deployment

### URLs

* [Webkins tests](https://webkins.lab.dynatrace.org/job/barista/job/sketch-generator/)

## Architecture

This code-analyzer is part of the .sketch generation ecosystem.
