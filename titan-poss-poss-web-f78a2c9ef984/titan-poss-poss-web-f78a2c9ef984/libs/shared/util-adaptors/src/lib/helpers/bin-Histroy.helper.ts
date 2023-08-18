//import { BinHistroyResponse } from './../../../../models/src/lib/request-approvals/bin-request-approvals.model';
import {  LoadBinHistoryResponse, BinHistroyResponse } from '@poss-web/shared/models';

import { HistoryAdaptor } from '../new-bin-request/bin-History.adaptor';

export class BinHistoryHelper {

  static getItems(data: any): LoadBinHistoryResponse {
    const items: BinHistroyResponse[] = [];
    for (const item of data.results) {
      items.push(HistoryAdaptor.fromJson(item));
    }
    return {

      count: data.totalElements ? data.totalElements : 0,
      items: items
    }
  }
}
