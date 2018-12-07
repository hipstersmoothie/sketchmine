![Github banner for sketchmine](https://dt-cdn.net/images/github-banner-2x-1777-2b23e499af.png)

# @sketchmine/sketch-validator

The Sketch Validator helps to improve the quality of Sketch files by validating the naming and structure of files, the usage of colors and text styles and much more. This package is a platform independent package that is only responsible for validating the JSON structure and providing the result of the validation. This package is consumed by an Angular application that is run by a Sketch Plugin and via the CLI from the **@sketchmine/sketch-validator-nodejs-wrapper**.

- [@sketchmine/sketch-validator](#sketchminesketch-validator)
  - [Dependency graph](#dependency-graph)
  - [How to run the Sketch validation?](#how-to-run-the-sketch-validation)
    - [how to build](#how-to-build)
    - [Configuration](#configuration)
    - [Configuration of the rules](#configuration-of-the-rules)
    - [Validation environments](#validation-environments)
    - [Validation options](#validation-options)
  - [The validator](#the-validator)
  - [Validation rules](#validation-rules)
    - [The rule](#the-rule)
    - [Error handling](#error-handling)
  - [Linting](#linting)
  - [How to write and run tests?](#how-to-write-and-run-tests)

The validation works like a teacher that is correcting homeworks of their students. The collection of homeworks is a collection of data (parts of a given Sketch file) that must meet the defined validation rules. Running the validation means asking the teacher to correct all homeworks following those rules.

## Dependency graph

![Dependency graph of the sketchmine sketch-validator-nodejs-wrapper](https://dt-cdn.net/images/sketch-validator-nodejs-wrapper-3920-bda7b02d9d.png)

## How to run the Sketch validation?

To run the validation in the terminal take use of the **@sketchmine/sketch-validator-nodejs-wrapper**, that consumes this package.


### how to build

To build the package [Rollup.js](https://rollupjs.org/guide/en) is used as a module bundler. The configuration can be found in the `rollup.config.js` file and is orchestrated by the [yarn](https://yarnpkg.com/en/) package manager.
The package emits three types of bundles. Therefore it is a platform independent package a **umd**, **commonjs** (for node), and a **ecmascriptmodule** package is being built in the `./lib` folder, to be consumed by any type of application.

The build can be started with the following two commands:

- `yarn build` for building the package.
- `yarn dev` for building and watching the sources of the package *(rebuilds after safe)*.

### Configuration

The `config.ts` file defines all validation rules (the rules the teacher must stick to when checking all the homeworks). A rule consists of the following settings:

* **name**: the validation rule's name (kebab case), a unique identifier
* **description (optional)**: the validation rule's description
* **selector**: the element (the `_class` property within a Sketch JSON file) the rule is applied to, e.g. an artboard, a shapegroup or a text
* **validation**: the validation function
* **env (optional)**: the validation environment (see options below), default is global
* **includePages (optional)**: pages of the Sketch file that should be validated
* **ignoreArtboards (optional)**: artboards of the Sketch file that can be ignored
* **options (optional)**: an array of additional options (see details below)

### Configuration of the rules

the selector can be `'document' | 'page' | 'symbolMaster' | 'group' | 'path' | 'shapeGroup' | 'rectangle' ...`, basically every SketchObjectType from the **@sketchmine/sketch-file-format** package.

``` typescript
export const rules: IValidationRule[] = [
  {
    selector: ['symbolMaster','rectangle', 'path', ...], // all kind of SketchObjectTypes
    name: 'name-of-the-rule',
    description: `Description of the rule to display in output`,
    ignoreArtboards: ['artbord-name-to-be-ignored],
    validation: functionThatValidates,
  },
];
```

### Validation environments

Currently the following validation environments are defined:

* `global` *(default)*
* `product`

Some validations are only needed for global UX resources (e.g. symbol name validation), others only for product screens (artboard name validation), some for both (color palette validation).

### Validation options

Additional options can be passed to the validation, i.e. additional data that is needed for checks within the validation function. This could be the defined artboard sizes – needed for the validation of page names – or validation requirements, i.e. parts of the Sketch files's JSON format that has to be copied when preparing the homework.

## The validator

The validator (`validator.ts`) holds all JSON files the Sketch file contains of. When triggered the validator collects the parts of the JSON files needed for the validation (this is defined in the `config.ts` file) and as soon as everything is set up tells the teacher to start with the correction of homeworks, i.e. applying all validation rules to the collected data (the homeworks).

## Validation rules

Validation rules are applied to the specified selector(s) set in the `config.ts` file. Validation rules can be found in the `validate/rules` folder.

The folder name must be the same as the rule name specified in the `config.ts` file. Within a folder you can find an `index.ts` file exporting everything that is part of the folder, a file containing the rule(s) itself, a test file, and optional additional files (e.g. for helper functions or fixtures).

### The rule

A rule is a validation function taking an array of homeworks (i.e. the data collected by the validator) and the current task number (i.e. the homework of the array that should be checked) as an argument.

The file `validation-rule-name.ts` is the place where all kinds of Sketch file properties are checked according to the validation rule.

### Error handling

For better and meaningful error handling define your own errors and error messages needed for your validation rules. Put them in the `validate/error/validation-error.ts` and `validate/error/error-messages.ts` file, respectively.

## Linting

The source code of this package is going to be linted by our CI environment. To ensure a coding standard and quality use the configured linter [tslint](https://palantir.github.io/tslint/). This package extends from the `tslint-config-airbnb` and the linting configuration extends from the root `tslint.json`.

Run `yarn lint` to execute the linter.

## How to write and run tests?

To ensure that the sketch-validator is working, write tests and put them in proper named file.

**Important!**

All tests according to this package should be wrapped in a describe with the prefix: `[sketch-validator] › ...` like the following:

```typescript
// import statements

describe('[sketch-validator] › ${folder} › ${description of the suite}', () => {
  // your tests should be placed here
});
```

> For tests the **jest** Framework was chosen, see [jestjs.io](https://jestjs.io/) for details.

Run `yarn test` to execute all tests specified for the sketch-validator. Run `yarn test -f filename.test` to execute only tests that match the provided RegExp for the filename.
