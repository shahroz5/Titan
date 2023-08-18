import {
  BinToBinTransferHistoryItemHeader,
  BinToBinTransferLoadHistoryItemsResponse
} from '@poss-web/shared/models';

import { BinToBinTransferHistoryAdaptor } from '../bin-to-bin-transfer/bin-to-bin-transfer-history.adaptor';

export class BinToBinTransferHistoryItemHelper {
  static getItems(data: any): BinToBinTransferLoadHistoryItemsResponse {
    const items: BinToBinTransferHistoryItemHeader[] = [];
    for (const item of data.results) {
      items.push(BinToBinTransferHistoryAdaptor.historyItemFromJson(item));
    }
    return {
      items: items,
      count: data.totalElements
    };
  }
}
