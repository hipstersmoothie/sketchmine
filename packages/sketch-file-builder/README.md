# @sketchmine/sketch-file-builder

## Dependency graph

![Dependency graph of the sketchmine sketch-file-builder](https://dt-cdn.net/images/sketch-file-builder-3920-aaa3e21a95.png)

### Useful bash scripts

convert a folder to a .sketch file

``` bash
declare filename=dt-asset-lib
# rm -rf ${filename}.sketch
cd ${filename}
zip -r -X ../${filename}.zip *
cd ..
mv ${filename}.zip ${filename}.sketch
rm -rf ${filename}.zip
open ${filename}.sketch

```

convert .sketch file to folder:

``` bash
declare filename=dt-asset-lib
# rm -rf ${filename}.sketch
# cp ./${filename}.bak.sketch ${filename}.sketch
mv ${filename}.sketch ${filename}.zip
unzip ${filename}.zip -d ./${filename}
rm -rf ${filename}.zip
```
