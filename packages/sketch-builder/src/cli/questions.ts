export const questions = {
  hasConfigFile: {
    type: 'confirm',
    name: 'hasConfigFile',
    message: 'Do you already have a config.json file?',
    default: false,
  },
  config: {
    type: 'fuzzyPath',
    name: 'config',
    rootPath: process.cwd(),
    message: 'Select your configuration file:',
    default: 'config.json',
  },
  url: {
    type: 'input',
    name: 'url',
    message: 'Provide the url of the page you want to draw:',
    default: 'https://barista.dynatrace.com/',
  },
  outFile: {
    type: 'input',
    name: 'outFile',
    message: 'The file name of the result:',
    validate: (input: string) =>
      input.match(/.+?\.sketch/) ? true : 'The filename has to end with .sketch',
  },
  saveConfig: {
    type: 'input',
    name: 'saveConfig',
    message: 'The destination file where the config should be stored:',
    default: 'config.json',
    validate: (input: string) =>
      input.match(/.+?\.json/) ? true : 'The file has to be a JSON file.',
  },
};
