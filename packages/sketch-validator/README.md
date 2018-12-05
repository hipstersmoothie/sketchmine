![Github banner for sketchmine](https://dt-cdn.net/images/github-banner-2x-1777-2b23e499af.png)

# @sketchmine/sketch-validator

The Sketch Validator helps to improve the quality of Sketch files by validating the naming and structure of files, the usage of colors and text styles and much more.

- [@sketchmine/sketch-validator](#sketchminesketch-validator)
  - [Dependency graph](#dependency-graph)
  - [How to run the Sketch file validation?](#how-to-run-the-sketch-file-validation)
  - [Validation configuration](#validation-configuration)
    - [Configuration of the rules](#configuration-of-the-rules)
    - [Validation environments](#validation-environments)
    - [Validation options](#validation-options)
  - [The validator](#the-validator)
  - [Validation rules](#validation-rules)
    - [The rule](#the-rule)
    - [Error handling](#error-handling)
    - [How to write and run tests?](#how-to-write-and-run-tests)


The file validation works like a teacher that is correcting homeworks of their students. The collection of homeworks is a collection of data (parts of a given Sketch file) that must meet the defined validation rules. Running tests means asking the teacher to correct all homeworks following those rules.

## Dependency graph

![Dependency graph of the sketchmine sketch-validator-nodejs-wrapper](https://dt-cdn.net/images/sketch-validator-nodejs-wrapper-3920-bda7b02d9d.png)

## How to run the Sketch file validation?

In a separate terminal window run `npm run build:dev -- --part="sketch-validator"` to start the Sketch validator. The build is always retriggered as soon as a file is updated and saved. To check if all **ts-lint** and **compiler** rules pass run `npm run lint`.

To display the help page run `node dist/sketch-validator -h`. It will give you an overview of all possible command line arguments that are needed for the validator.

To validate a given Sketch file open a new terminal window and run `node dist/sketch-validator --file="path/to/file.sketch"`. The default validation environment is `global` (see all environments below). You can change it by adding `ENVIRONMENT=<env-name>` or passing an environment with the command-line args to the command above. Enable the debug mode by adding `DEBUG=true`.

```sh
ENVIRONMENT=product DEBUG=true node dist/sketch-validator --file="tests/fixtures/fixtures-testfile.sketch"
```

## Validation configuration

The `config.ts` file defines all validation rules (the rules the teacher must stick to when checking all the homeworks). A rule consists of the following settings:

* name: the validation rule's name (kebab case), a unique identifier
* description (optional): the validation rule's description
* selector: the element (the `_class` property within a Sketch JSON file) the rule is applied to, e.g. an artboard, a shapegroup or a text
* validation: the validation function
* env (optional): the validation environment (see options below), default is global
* includePages (optional): pages of the Sketch file that should be validated
* ignoreArtboards (optional): artboards of the Sketch file that can be ignored
* options (optional): an array of additional options (see details below)

Furthermore you can specify which rules should validate and throw warnings with a `sketchlint.json` in the project root.
Then you have to provide the `-c` or `--config` argument to the call with the path to the sketchlint file.
This file follows following convention:

The version property is used to specify the docker image (it is the version of the library `${project-root}/package.json` and not the version of the validation)
It can be locked to a fix version like `1.2.2` or simply `latest`

```json
{
  "version": "1.2.2",
  "rules": {
    "artboard-validation": true,
    "color-palette-validation": false,
    "page-validation": true,
    "symbol-name-validation": true,
    "text-style-validation": {
      "warning": true
    }
  }
}

```


### Configuration of the rules

the selector can be `'document' | 'page' | 'symbolMaster' | 'group' | 'path' | 'shapeGroup' | 'rectangle'`

``` typescript
export const rules: IValidationRule[] = [
  {
    selector: ['symbolMaster','rectangle', 'path', ...], // all kind of sketch instances
    name: 'name-of-the-rule',
    description: `Description of the rule to display in output`,
    ignoreArtboards: ['artbord-name-to-be-ignored],
    validation: functionThatValidates,
  },
];
```

### Validation environments

Currently the following validation environments are defined:

* global (default)
* product

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

### How to write and run tests?

To ensure that your rules are working, write tests and put them in a `validation-rule-name.test.ts` file.

**Important!**

All tests according to this space should be wrapped in a describe with the prefix: `[sketch-validator] › ...` like the following:

```typescript
// import statements

describe('[sketch-validator] › ${folder} › ${description of the suite}', () => {
  // your tests should be placed here
});
```

For tests the **jest** Framework was chosen, see [jestjs.io](https://jestjs.io/) for details.

Run `yarn test` to run all tests specified for the Sketch validation rules. Run `npx jest -f validation-rule-name.test` to run tests for the specified rule only.
