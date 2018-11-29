import { readFile } from '@sketchmine/helpers';
import { TraversedLibrary } from '@sketchmine/dom-agent';
import { ElementFetcher } from '../src/element-fetcher';
import { SketchBuilderConfig } from '../src/config.interface';

// tslint:disable:max-line-length
describe('[sketch-generator] › element fetcher', () => {
  let fetcher: ElementFetcher;

  beforeEach(async () => {
    process.env.TRAVERSER = 'skip-traverser';
    const meta = JSON.parse(await readFile('tests/fixtures/meta-information.json'));
    fetcher = new ElementFetcher({} as SketchBuilderConfig, meta);
  });

  test('Sorting of tile has nested button', async () => {
    fetcher.result = [{
      type: 'library',
      symbols: [
        { name: 'icon/agent', symbol: { matchingComponent: 'dt-icon' }, hasNestedSymbols: [] },
        { name: 'tile/disabled', symbol: { matchingComponent: 'dt-tile' }, hasNestedSymbols: ['button[dt-button]', 'button[dt-button]'] },
        { name: 'button/primary', symbol: { matchingComponent: 'button[dt-button]' }, hasNestedSymbols: [] },
        { name: 'button/secondary', symbol: { matchingComponent: 'button[dt-button]' }, hasNestedSymbols: [] },
      ],
    }] as TraversedLibrary[];
    fetcher.sortSymbols();
    const symbols = (fetcher.result as TraversedLibrary[])[0].symbols;
    expect(symbols).toBeInstanceOf(Array);
    expect(symbols).toHaveLength(4);
    expect(symbols[0].name).toEqual('icon/agent');
    expect(symbols[1].name).toEqual('button/primary');
    expect(symbols[2].name).toEqual('button/secondary');
    expect(symbols[3].name).toEqual('tile/disabled');
  });

  test('tile has button and icon', async () => {
    fetcher.result = [{
      type: 'library',
      symbols: [
        { name: 'tile/disabled', symbol: { matchingComponent: 'dt-tile' }, hasNestedSymbols: ['dt-icon', 'button[dt-button]'] },
        { name: 'button/primary', symbol: { matchingComponent: 'button[dt-button]' }, hasNestedSymbols: [] },
        { name: 'button/secondary', symbol: { matchingComponent: 'button[dt-button]' }, hasNestedSymbols: [] },
        { name: 'icon/agent', symbol: { matchingComponent: 'dt-icon' }, hasNestedSymbols: [] },
      ],
    }] as TraversedLibrary[];
    fetcher.sortSymbols();
    const symbols = (fetcher.result as TraversedLibrary[])[0].symbols;
    expect(symbols).toHaveLength(4);
    expect(symbols[0].name).toEqual('button/primary');
    expect(symbols[1].name).toEqual('button/secondary');
    expect(symbols[2].name).toEqual('icon/agent');
    expect(symbols[3].name).toEqual('tile/disabled');
  });

  test('icon gets used by tile and afterwards by button but button is in tile before icon', async () => {
    fetcher.result = [{
      type: 'library',
      symbols: [
        { name: 'tile/disabled', symbol: { matchingComponent: 'dt-tile' }, hasNestedSymbols: ['button[dt-button]', 'dt-alert', 'dt-icon'] },
        { name: 'button/primary', symbol: { matchingComponent: 'button[dt-button]' }, hasNestedSymbols: [] },
        { name: 'button/secondary', symbol: { matchingComponent: 'button[dt-button]' }, hasNestedSymbols: ['dt-icon'] },
        { name: 'alert/warning', symbol: { matchingComponent: 'dt-alert' }, hasNestedSymbols: ['dt-icon', 'button[dt-button]'] },
        { name: 'icon/agent', symbol: { matchingComponent: 'dt-icon' }, hasNestedSymbols: [] },
      ],
    }] as TraversedLibrary[];
    fetcher.sortSymbols();
    const symbols = (fetcher.result as TraversedLibrary[])[0].symbols;
    expect(symbols).toHaveLength(5);
    expect(symbols[0].name).toEqual('icon/agent');
    expect(symbols[1].name).toEqual('button/primary');
    expect(symbols[2].name).toEqual('button/secondary');
    expect(symbols[3].name).toEqual('alert/warning');
    expect(symbols[4].name).toEqual('tile/disabled');
  });

  test('icon gets used by tile and afterwards by button but button is in tile before icon', async () => {
    fetcher.result = [{
      type: 'library',
      symbols: [
        { name: 'tile/disabled', symbol: { matchingComponent: 'dt-tile' }, hasNestedSymbols: ['dt-icon', 'button[dt-button]', 'dt-alert', 'dt-icon'] },
        { name: 'button/main', symbol: { matchingComponent: 'button[dt-button]' }, hasNestedSymbols: [] },
        { name: 'button/accent', symbol: { matchingComponent: 'button[dt-button]' }, hasNestedSymbols: [] },
        { name: 'icon/agent', symbol: { matchingComponent: 'dt-icon' }, hasNestedSymbols: [] },
        { name: 'icon/cassandra', symbol: { matchingComponent: 'dt-icon' }, hasNestedSymbols: [] },
        { name: 'icon/agent/light', symbol: { matchingComponent: 'dt-icon' }, hasNestedSymbols: [] },
        { name: 'alert/error', symbol: { matchingComponent: 'dt-alert' }, hasNestedSymbols: ['dt-icon'] },
        { name: 'alert/warning', symbol: { matchingComponent: 'dt-alert' }, hasNestedSymbols: ['dt-icon'] },
        { name: 'inline-editor/required', symbol: { matchingComponent: '[dt-inline-editor]' }, hasNestedSymbols: ['button[dt-icon-button]', 'dt-icon'] },
        { name: 'expandable-section/opened', symbol: { matchingComponent: 'dt-expandable-section' }, hasNestedSymbols: ['dt-expandable-panel'] },

      ],
    }] as TraversedLibrary[];
    fetcher.sortSymbols();
    const symbols = (fetcher.result as TraversedLibrary[])[0].symbols;
    expect(symbols).toHaveLength(10);
    expect(symbols[0].name).toEqual('icon/agent');
    expect(symbols[1].name).toEqual('icon/cassandra');
    expect(symbols[2].name).toEqual('icon/agent/light');
    expect(symbols[3].name).toEqual('alert/error');
    expect(symbols[4].name).toEqual('alert/warning');
    expect(symbols[5].name).toEqual('button/main');
    expect(symbols[6].name).toEqual('button/accent');
    expect(symbols[7].name).toEqual('tile/disabled');
    expect(symbols[8].name).toEqual('inline-editor/required');
    expect(symbols[9].name).toEqual('expandable-section/opened');
  });
});
