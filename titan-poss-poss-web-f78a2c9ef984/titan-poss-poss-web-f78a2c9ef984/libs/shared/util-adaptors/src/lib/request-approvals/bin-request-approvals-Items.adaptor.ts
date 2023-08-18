import { BinRequestApprovalsItems } from '@poss-web/shared/models';
import * as moment from 'moment';

export class BinRequestApprovalsItemsAdaptor {
  static fromJson(item: any): BinRequestApprovalsItems {
    return {
      id: item.id,
      binName: item.binName,
      reqDocDate: moment(item.reqDocDate),
      reqDocNo: item.reqDocNo,
      reqLocationCode: item.reqLocationCode,
      status: item.status,
      requestedRemarks: item.requestedRemarks,
      binGroupCode: item.binGroupCode
    };
  }
}
