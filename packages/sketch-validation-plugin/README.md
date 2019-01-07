![Github banner for sketchmine](https://dt-cdn.net/images/github-banner-2x-1777-2b23e499af.png)

# @sketchmine/sketch-validaton-plugin

The sketch validation plugin is the [Sketch](https://www.sketchapp.com/) plugin to run the validation inside your local Sketch app.

- [@sketchmine/sketch-validaton-plugin](#sketchminesketch-validaton-plugin)
  - [Installation](#installation)
    - [Add the plugin to Sketch](#add-the-plugin-to-sketch)
    - [Symlinking](#symlinking)

## Installation

Install the package with `yarn` and build the plugin with a `yarn build`. Afterwards you should see a `.sketchplugin` folder where the builded files are inside.

The plugin get generated with the [official Sketch plugin manager](https://github.com/skpm/skpm).

### Add the plugin to Sketch

To install this plugin you can place it in the Plugin in Folders under `~/Library/Application\ Support/com.bohemiancoding.sketch3/Plugins/*`.

### Symlinking

But if you want to develop the plugin a **symlink** would be nice.
So for that you can run `yarn add:plugin`. This command will create a symlink and if you re-build your plugin it gets automatically changed in the Plugin folder.
