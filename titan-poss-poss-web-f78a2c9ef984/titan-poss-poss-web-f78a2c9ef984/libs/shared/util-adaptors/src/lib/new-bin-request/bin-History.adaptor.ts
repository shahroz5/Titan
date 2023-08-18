//import { BinHistroyResponse } from './../../../../models/src/lib/request-approvals/bin-request-approvals.model';
import * as moment from 'moment';
import { BinHistroyResponse } from '@poss-web/shared/models';

export class HistoryAdaptor {


  static fromJson(item: any): BinHistroyResponse {

    return {
      id: item.id,
      reqDocNo: item.reqDocNo,
      reqLocationCode: item.reqLocationCode,
      reqDocDate: moment(item.reqDocDate),
      binName: item.binName,
      status: item.status,
      requestedRemarks: item.requestedRemarks,
      binGroupCode: item.binGroupCode,
      approvedRemarks: item.approvedRemarks,
      reqFiscalYear: moment(item.reqFiscalYear)


    };
  }
}
