import { delDir, createDir } from '@utils';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { IAsset } from '../traversed-dom';
import chalk from 'chalk';

export class AssetHandler {

  private static ASSET_TMP = '_tmp/images';

  download(_assets: IAsset[]): Promise<any>[] {
    if (Object.keys(_assets).length === 0) {
      return null;
    }
    createDir(AssetHandler.ASSET_TMP);
    return _assets.map(asset => this.downloadAsset(asset));
  }

  private async downloadAsset(asset: IAsset): Promise<any> {
    const url = Object.keys(asset)[0];
    const id = asset[url];
    const filename = `${id}.${url.split('.').pop()}`;
    const dest = path.resolve(AssetHandler.ASSET_TMP, filename);

    if (process.env.DEBUG) {
      console.log(chalk`\t → ${id}: {grey ${url}}`);
    }
    // axios image download with response type "stream"
    const response = await axios({
      method: 'GET',
      url,
      responseType: 'stream',
    });

    // pipe the result stream into a file on disc
    response.data.pipe(fs.createWriteStream(dest));

    // return a promise and resolve when download finishes
    return new Promise((resolve, reject) => {
      response.data.on('end', () => {
        resolve();
      });

      response.data.on('error', () => {
        reject();
      });
    });

  }

  clean() {
    delDir(AssetHandler.ASSET_TMP);
  }
}
