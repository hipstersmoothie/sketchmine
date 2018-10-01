export const ArtboardSizeErrorMessage = 'Every page needs to have at least one artboard with a valid width (360, 1280, 1920), that is not empty.';
export const ArtboardEmptyErrorMessage = 'Artboards should not be left empty.';
export const ArtboardNameErrorMessage = 'The artboard name should contain at artboardsize, folder name and feature name e.g. 360-services-serviceflow.';

export const PageNameErrorMessage = (artboardsizes) => `Every file needs to include pages with the following names: {${artboardsizes.join(', ')}}`;

export const FileNameFolderErrorMessage = (filename: string) => `File name ${filename} is invalid, it needs to contain the folder name.`;
export const FileNameErrorMessage = (filename: string) => `File name ${filename} is invalid, it should only contain [a-z, A-Z, 0-9, -].`;

export const DuplicatedSymbolErrorMessage = (taskname) => `Duplicated Symbol!\nThe Symbol {${taskname}} already exists!`;
export const ThemeNameErrorMessage = (themeNames) => `The symbol name has to include a theme name: {${Object.values(themeNames).join(', ')}}`;
export const SymbolNameErrorMessage = `The symbolname should contain at least 1 backslash / so that it is correct grouped!`;


export const ColorErrorMessage = (hex) => `The Color {hex('${hex}') ███} ${hex}} is not in the Dynatrace Color Palette!\n` +
`Take a look at {grey https://styles.lab.dynatrace.org/resources/colors}\n`;
