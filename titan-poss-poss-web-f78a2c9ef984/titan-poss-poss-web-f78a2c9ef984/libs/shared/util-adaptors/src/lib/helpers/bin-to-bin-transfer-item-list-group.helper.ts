import { BinToBinTransferItemListGroupAdaptor } from './../bin-to-bin-transfer/bin-to-bin-transfer-item-list-group.adaptor';
import {
  BinToBinTransferItemListGroup,
  BinToBinTransferLoadItemListGroupResponse
} from '@poss-web/shared/models';

export class BinToBinTransferItemListGroupHelper {
  static getInfo(data: any): BinToBinTransferLoadItemListGroupResponse {
    const itemListGroups: BinToBinTransferItemListGroup[] = [];
    for (const group of data.results) {
      itemListGroups.push(BinToBinTransferItemListGroupAdaptor.fromJson(group));
    }
    return {
      itemListGroups: itemListGroups,
      count: data.totalElements ? data.totalElements : 0
    };
  }
}
