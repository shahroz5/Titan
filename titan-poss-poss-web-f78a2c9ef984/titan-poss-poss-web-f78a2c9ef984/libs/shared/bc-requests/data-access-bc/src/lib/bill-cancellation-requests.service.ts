//import { BillCancellationRequests } from './../../../../../shared/models/src/lib/bill-cancellation-requests/bill-cancellation-requests.model';
import {
  BillCancellationRequestsHelper,
  CashMemoAdaptor,
} from '@poss-web/shared/util-adaptors';

import { Injectable } from '@angular/core';
import {
  ApiService,
  getCancelTypeEndPointUrl,
  getBillCancellationRequestUrl,
  putBillCancellationUrl,
  getBillCountUrl,
  cancelBillCancelUrl,
  confirmBillCancelUrl,
  deleteBillCancelUrl,
  getCashMemoEndPointUrl,
  getCashMemoItemEndPointUrl,
  getWorkFlowProcessUrl,
  getWorkFlowProcessDetailsUrl
} from '@poss-web/shared/util-api-service';
import * as actions from './+state/bill-cancellation-requests.actions';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  BillCancellationRequests,
  CashMemoDetailsResponse
} from '@poss-web/shared/models';
import * as moment from 'moment';
@Injectable({
  providedIn: 'root'
})
export class BillCancellationRequestsService {
  constructor(private apiService: ApiService) {}
  getloadBillRequest(
    data: actions.BillCancellationRequestsListPayload
  ): Observable<BillCancellationRequests> {
    const url = getBillCancellationRequestUrl(data);

    return this.apiService
      .post(url.path, data.body, url.params)
      .pipe(map(resData => BillCancellationRequestsHelper.getBills(resData)));
  }

  putBillCancellation(data: actions.ApprovePayload): Observable<any> {
    const url = putBillCancellationUrl(data);

    return this.apiService
      .put(url.path, data.body, url.params)
      .pipe(map((resData: any) => resData));
  }

  getloadBillRequestCount(data: any): Observable<any> {
    const url = getBillCountUrl(data);

    return this.apiService
      .get(url.path, url.params)
      .pipe(map((resData: any) => resData.results));
  }

  getloadBillRequestStatus(
    data: actions.BillCancelListPayload
  ): Observable<any> {
    const workflowUrl = getWorkFlowProcessUrl(data.requestParams);

    return this.apiService
      .post(workflowUrl.path, data.reqBody, workflowUrl.params)
      .pipe(
        map(resData => ({
          ...resData,
          results: resData.results.map(item => ({
            ...item,
            requestedDate: moment(item.requestedDate)
          }))
        }))
      );
  }
  selectedData(data: any): Observable<any> {
    const workflowUrl = getWorkFlowProcessDetailsUrl(data);

    return this.apiService
      .get(workflowUrl.path, workflowUrl.params)
      .pipe(map(resData => resData));
  }
  delete(data): Observable<any> {
    const url = deleteBillCancelUrl(data);

    return this.apiService
      .delete(url.path, url.params)
      .pipe(map(resData => resData));
  }
  confirm(data): Observable<any> {
    const url = confirmBillCancelUrl(data);

    return this.apiService
      .post(url.path, data.body, url.params)
      .pipe(map(resData => resData));
  }
  cancel(data): Observable<any> {
    const url = cancelBillCancelUrl(data);

    return this.apiService
      .put(url.path, data.body, url.params)
      .pipe(map(resData => resData));
  }
  viewCashMemo(
    id: string,
    txnType: string,
    subTxnType: string
  ): Observable<CashMemoDetailsResponse> {
    const viewCashMemoUrl = getCashMemoEndPointUrl(txnType, subTxnType, id);
    return this.apiService
      .get(viewCashMemoUrl.path, viewCashMemoUrl.params)
      .pipe(
        map((data: any) =>
          CashMemoAdaptor.cashMemoDetailsResponseFromJson(data)
        )
      );
  }

  CancelType(
    id: string,
    subTxnType: string,
    txnType: string
  ): Observable<CashMemoDetailsResponse> {
    const cancelTypeUrl = getCancelTypeEndPointUrl(id, subTxnType, txnType);
    return this.apiService
      .get(cancelTypeUrl.path, cancelTypeUrl.params)
      .pipe(map(data => data));
  }

  getItemFromCashMemo(
    id: string,
    itemId: string,

    txnType: string,
    subTxnType: string
  ): Observable<any> {
    const getItemFromCashMemoUrl = getCashMemoItemEndPointUrl(
      id,
      txnType,
      subTxnType,
      itemId
    );

    return this.apiService
      .get(getItemFromCashMemoUrl.path, getItemFromCashMemoUrl.params)
      .pipe(
        map((data: any) => CashMemoAdaptor.cashMemoItemDetailsFromJson(data))
      );
  }
}
