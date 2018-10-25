// tslint:disable:max-line-length
export const ARTBOARD_SIZE_ERROR_MESSAGE = 'Every page needs to have at least one artboard with a valid width (360, 1280, 1920), that is not empty.';
export const ARTBOARD_EMPTY_ERROR_MESSAGE = 'Artboards should not be left empty.';
export const ARTBOARD_NAME_ERROR_MESSAGE = 'The artboard name should contain artboardsize, folder name and feature name e.g. 360-services-serviceflow.';

export const PAGE_NAME_ERROR_MESSAGE = artboardsizes => `Every file needs to include pages with the following names: {${artboardsizes.join(', ')}}`;

export const FILE_NAME_FOLDER_ERROR_MESSAGE = (filename: string) => `File name ${filename} is invalid, it needs to contain the folder name.`;
export const FILE_NAME_ERROR_MESSAGE = (filename: string) => `File name ${filename} is invalid, it should only contain [a-z, A-Z, 0-9, -].`;

export const DUPLICATE_SYMBOL_ERROR_MESSAGE = taskname => `Duplicated Symbol!\nThe Symbol {${taskname}} already exists!`;
export const THEME_NAME_ERROR_MESSAGE = themeNames => `The symbol name has to include a theme name: {${Object.values(themeNames).join(', ')}}`;
export const SYMBOL_NAME_ERROR_MESSAGE = 'The symbolname should contain at least 1 backslash / so that it is correct grouped!';

export const COLOR_ERROR_MESSAGE = hex => `The Color {hex('${hex}') ███} ${hex}} is not in the Dynatrace Color Palette!
Take a look at {grey https://styles.lab.dynatrace.org/resources/colors}\n`;

export const NO_FOREIGN_TEXT_STYLES_ERROR_MESSAGE = 'The Sketch file must include text files from a shared library.';
export const NO_SHARED_TEXT_STYLES_ERROR_MESSAGE = textElementName => `The text "${textElementName}" must use text styles from a shared library only, no custom text styles are allowed.`;
export const NO_SHARED_TEXT_STYLES_OVERRIDES_ERROR_MESSAGE = textElementName => `The shared text style for "${textElementName}" has been modified.`;
export const NO_WRONG_HEADLINE_ERROR = (textElementName, artboardSize) => `The headline "${textElementName}" uses the wrong text style for artboard size ${artboardSize}.`;
export const INVALID_TEXT_COLOR_ERROR = textElementName => `The text "${textElementName}" uses a wrong text color.`;
export const TEXT_TOO_SMALL_ERROR = textElementName => `Font of text "${textElementName}" is smaller than 12px.`;
