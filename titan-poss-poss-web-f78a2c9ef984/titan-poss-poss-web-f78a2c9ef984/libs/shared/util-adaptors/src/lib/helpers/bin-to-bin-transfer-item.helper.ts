import {
  BinToBinTransferItem,
  BinToBinTransferLoadItemsResponse
} from '@poss-web/shared/models';
import { BinToBinTransferItemAdaptor } from '../bin-to-bin-transfer/bin-to-bin-transfer-item.adaptor';

export class BinToBinTransferItemHelper {
  static getItems(
    data: any,
    studdedProductGroups: string[] = []
  ): BinToBinTransferLoadItemsResponse {
    console.log('binItem', data);
    const items: BinToBinTransferItem[] = [];
    for (const item of data.results?.items) {
      items.push(
        BinToBinTransferItemAdaptor.fromJson(item, studdedProductGroups)
      );
    }
    return {
      items: items,
      totalValue: data.results.totalValue,
      totalQuantity: data.results.totalQuantity,
      binToBinAllowedtotalQuantity: data.results?.binToBinAllowedtotalQuantity,
      binToBinAllowedtotalValue: data.results?.binToBinAllowedtotalValue,
      binToBinAllowedtotalItems: data.results?.binToBinAllowedtotalItems,
      count: data.totalElements
    };
  }

  static getUploadedItems(
    data: any,
    studdedProductGroups: string[] = []
  ): BinToBinTransferLoadItemsResponse {
    console.log('binItem', data);
    const items: BinToBinTransferItem[] = [];
    for (const item of data?.items?.results) {
      items.push(
        BinToBinTransferItemAdaptor.fromJson(item, studdedProductGroups)
      );
    }
    return {
      items: items,
      totalValue: data?.totalValue,
      totalQuantity: data?.totalQuantity,
      binToBinAllowedtotalQuantity: data?.binToBinAllowedtotalQuantity,
      binToBinAllowedtotalValue: data?.binToBinAllowedtotalValue,
      binToBinAllowedtotalItems: data?.binToBinAllowedtotalItems,
      count: data?.items?.totalElements,
      invalidItems: data?.invalidItems,
      notInStock: data?.notInStock
    };
  }

  static getHistoryItems(
    data: any,
    studdedProductGroups: string[] = []
  ): BinToBinTransferLoadItemsResponse {
    const items: BinToBinTransferItem[] = [];
    for (const item of data.results) {
      items.push(
        BinToBinTransferItemAdaptor.fromJson(item, studdedProductGroups)
      );
    }
    return {
      items: items,
      count: data?.totalElements ? data?.totalElements : 0
    };
  }
}
