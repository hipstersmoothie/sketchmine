import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { resolve } from 'path';

const collectionPath = resolve('src', 'collection.json');
const SCHEMATIC_NAME = 'angular-app-shell';
const NPMRC_URL = 'http://artifactory.lab.dynatrace.org/artifactory/api/npm/';

describe('[app-builder] › angular-app-shell › schematics generation', () => {
  const runner = new SchematicTestRunner('schematics', collectionPath);

  test('schematic should fail if no config is provided', () => {
    expect(() => {
      runner.runSchematic(SCHEMATIC_NAME, {}, Tree.empty());
    }).toThrowError(
      `Schematic input does not validate against the Schema: {}
Errors:

  Data path "" should have required property 'config'.`);

  });

  test('schematics tree should contain examples from configuration', () => {
    const tree = runner.runSchematic(
      SCHEMATIC_NAME,
      { config: 'tests/fixtures/config.json' },
    );

    expect(tree.files).toBeInstanceOf(Array);
    expect(tree.files).toContain('/dist/sketch-library/src/app/examples/example-module.ts');
    expect(tree.files).toContain('/dist/sketch-library/src/app/examples/material-module.ts');
    expect(tree.files).toContain('/dist/sketch-library/src/app/examples/button/button-example.css');
    expect(tree.files).toContain('/dist/sketch-library/src/app/examples/button/button-example.html');
    expect(tree.files).toContain('/dist/sketch-library/src/app/examples/button/button-example.ts');
  });

  test('schematics tree have not to contain an .npmrc file with @angular/material', () => {
    const tree = runner.runSchematic(
      SCHEMATIC_NAME,
      { config: 'tests/fixtures/config.json' },
    );

    expect(tree.files).not.toContain('/dist/sketch-library/.npmrc');
  });

  test('schematics have to contain an .npmrc file if @dynatrace dependencies are found', () => {
    const tree = runner.runSchematic(
      SCHEMATIC_NAME,
      { config: 'tests/fixtures/config.dynatrace.json' },
    );

    expect(tree.files).toContain('/dist/sketch-library/.npmrc');
    expect(tree.readContent('/dist/sketch-library/.npmrc'))
      .toContain(
        `registry=${NPMRC_URL}registry-npmjs-org/
@dynatrace:registry=${NPMRC_URL}npm-dynatrace-release-local/`);
  });

  test('package.json contains the correct dependencies', () => {
    const tree = runner.runSchematic(
      SCHEMATIC_NAME,
      { config: 'tests/fixtures/config.dynatrace.json' },
    );

    const pkgJson = JSON.parse(tree.readContent('/dist/sketch-library/package.json'));

    expect(pkgJson.dependencies).toMatchObject({ '@dynatrace/angular-components': 'latest' });
    expect(pkgJson.dependencies).toMatchObject({ highcharts: '^6.1.0' });
    expect(pkgJson.devDependencies).toMatchObject({ '@types/highcharts': '^5.0.22' });
  });

  test('style.scss to contain framework styles', () => {
    const tree = runner.runSchematic(
      SCHEMATIC_NAME,
      { config: 'tests/fixtures/config.dynatrace.json' },
    );

    expect(tree.readContent('/dist/sketch-library/src/styles.scss'))
      .toContain('html {\n  margin: 0;\n  padding: 0;\n}');
  });

});
