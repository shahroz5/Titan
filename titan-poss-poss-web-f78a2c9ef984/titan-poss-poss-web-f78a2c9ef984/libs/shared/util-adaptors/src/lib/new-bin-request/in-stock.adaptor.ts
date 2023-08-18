
import { BinCodes, BinTranferProduct } from '@poss-web/shared/models';

/**
 * Adapters for the In-Stock
 */
export class InStockAdaptor {
  /**
   * The function maps the json data to respective model type
   */
  static binProducts: BinTranferProduct[] = [];
  static binCodes: BinCodes[] = [];


  static BinCodesJson(data: any): BinCodes[] {
    // for (const stockTransferNote of data.results) {
    this.binCodes = [];
    for (const binCode of data) {
      this.binCodes.push({
        binCode: binCode.binCode,
        quantity: binCode.quantity
      });
    }

    return this.binCodes;
  }
}
