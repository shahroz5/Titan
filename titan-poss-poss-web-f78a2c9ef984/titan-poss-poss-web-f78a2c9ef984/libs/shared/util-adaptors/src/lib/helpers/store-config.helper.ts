import { StoreConfigAdaptor } from '../masters/store-config.adaptors';
import { StoreBin } from '@poss-web/shared/models';

export class StoreConfigHelper {
  static getbins(data: any): StoreBin[] {
    const storeBins: StoreBin[] = [];
    for (const storeBin of data) {
      storeBins.push(StoreConfigAdaptor.StoreBinDataFromJson(storeBin));
    }
    return storeBins;
  }
}
