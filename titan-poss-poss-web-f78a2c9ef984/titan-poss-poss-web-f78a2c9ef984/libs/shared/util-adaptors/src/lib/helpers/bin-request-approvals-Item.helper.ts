import { BinRequestApprovalsItems, LoadBinRequestResponse } from '@poss-web/shared/models';
import { BinRequestApprovalsItemsAdaptor } from '../request-approvals/bin-request-approvals-Items.adaptor';

export class BinRequestApprovalsItemHelper {

  static getItems(data: any): LoadBinRequestResponse {
    const items: BinRequestApprovalsItems[] = [];
    for (const item of data.results) {
      items.push(BinRequestApprovalsItemsAdaptor.fromJson(item));
    }
    return {

      count: data.totalElements ? data.totalElements : 0,
      items: items
    }
  }
}
