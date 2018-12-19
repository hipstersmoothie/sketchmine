import { resolve, basename } from 'path';
import { compile, registerPartial, registerHelper } from 'handlebars';
import { readDirRecursively, readFile } from '@sketchmine/node-helpers';

const PARTIALS_DIR = 'templates/partials';

/**
 * Renders a provided .hbs file and returns the string
 * @param file input file that should be rendered
 * @param context The context that should be used for rendering (your data)
 * @param options optional Handlebars runtimeOptions
 */
export async function render(file: string, context: any, options?: Handlebars.RuntimeOptions): Promise<string> {
  // register hbs partials
  await registerPartials(PARTIALS_DIR);
  // register global variables
  registerGlobals(context.globals);

  // if there was a previous changelog remove the existing header
  if (context.previousChangelog) {
    context.previousChangelog = await removeHeader(context.previousChangelog);
  }

  const content = await readFile(file);
  const template = compile(content);
  return template(context, options);
}

function registerGlobals(globals: {[key: string]: string}) {
  registerHelper('global', (key: string) => {
    if (globals.hasOwnProperty(key)) {
      return globals[key];
    }
  });
}

/**
 * Registers all handlebars partials
 * @param dir dir relative to package root
 * @param regex regular expression to filter all handlebars files default /.hbs$/
 */
export async function registerPartials(dir: string, regex =  /\.hbs$/) {
  // get all files in the partials directory
  const files = await readDirRecursively(resolve(dir), regex);

  for (let i = 0, max = files.length; i < max; i += 1) {
    const file: string = files[i];

    const content = await readFile(file);
    registerPartial(basename(file, '.hbs'), content);
  }
}

/**
 * removes the header of the old changelog
 * @param prevChangelog old changelog
 */
async function removeHeader(prevChangelog: string) {
  const header = await readFile(resolve(PARTIALS_DIR, 'header.hbs'));
  return prevChangelog.replace(`${header}\n`, '');
}
