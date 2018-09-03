export class AssetHelper {

  constructor(public assets = []) { }

  addAsset(id: string, src: string) {
    if (!Object.values(this.assets).includes(src)) {
      this.assets.push({ [id]:  src });
    }
  }
}
