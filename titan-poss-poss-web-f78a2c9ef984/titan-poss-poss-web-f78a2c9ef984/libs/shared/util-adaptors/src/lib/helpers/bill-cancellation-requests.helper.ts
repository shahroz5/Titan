import {
  BillCancellationRequests,
  BillCancellation,
  CmBillList,
  bcHistoryResponse,
  bcHistoryDetails
} from '@poss-web/shared/models';
import { BillCancellationRequestsAdaptor } from '../bill-cancellation-requests/bill-cancellation.adaptor';

export class BillCancellationRequestsHelper {
  static getBills(data: any): BillCancellationRequests {
    const bills: BillCancellation[] = [];
    for (const bill of data.results) {
      bills.push(
        BillCancellationRequestsAdaptor.billCancellationRequestsfromJson(bill)
      );
    }
    return {
      count: data.totalElements ? data.totalElements : 0,
      results: bills
    };
  }

  static getCmBillList(data: any): CmBillList[] {
    const cmBillList: CmBillList[] = [];
    for (const bill of data.results) {
      cmBillList.push(
        BillCancellationRequestsAdaptor.getCmBillListFromJson(
          bill,
          data.totalElements
        )
      );
    }
    return cmBillList;
  }

  static getBcList(data: any): bcHistoryResponse {
    const  bcHistoryDetail:  bcHistoryDetails[] = [];
    for (const list of data.results) {
      bcHistoryDetail.push(
        BillCancellationRequestsAdaptor.getBillCancellationHistoryDetails(
          list,

        )
      );
    }
    return {
      bcHistoryDetails: bcHistoryDetail,
      totalElements: data.totalElements
    }
  }

}
