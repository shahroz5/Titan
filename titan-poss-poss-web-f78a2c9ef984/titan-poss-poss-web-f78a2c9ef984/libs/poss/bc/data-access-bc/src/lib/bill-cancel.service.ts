import { Injectable } from '@angular/core';
import {
  ApiService,
  confirmBillCancelUrl,
  getCashMemoEndPointUrl,
  getCashMemoItemEndPointUrl,
  getCmBillListEndpointUrl,
  directCancelBillCancelUrl,
  getCancelTypeEndPointUrl,
  getBillCancellationHistoryDetailsUrl
} from '@poss-web/shared/util-api-service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  bcHistoryRequestPayload,
  bcHistoryResponse,
  CancelResponse,
  CashMemoDetailsResponse,
  CashMemoItemDetails,
  CmBillList,
  CmBillListPayload,
  ConfirmResponse
} from '@poss-web/shared/models';
import {
  BillCancellationRequestsAdaptor,
  BillCancellationRequestsHelper,
  CashMemoAdaptor,
} from '@poss-web/shared/util-adaptors';

@Injectable({
  providedIn: 'root'
})
export class BillCancelService {
  constructor(private apiService: ApiService) {}

  confirm(confirmData): Observable<ConfirmResponse> {
    const url = confirmBillCancelUrl(confirmData);
    return this.apiService
      .post(url.path, confirmData.body, url.params)
      .pipe(
        map(data => BillCancellationRequestsAdaptor.getConfirmResFromJson(data))
      );
  }

  cancel(cancelData): Observable<CancelResponse> {
    const url = directCancelBillCancelUrl(cancelData);
    return this.apiService
      .post(url.path, cancelData.body, url.params)
      .pipe(
        map(data => BillCancellationRequestsAdaptor.getCancelResFromJson(data))
      );
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

  getItemFromCashMemo(
    id: string,
    itemId: string,
    txnType: string,
    subTxnType: string
  ): Observable<CashMemoItemDetails> {
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

  getCmBillList(billData: CmBillListPayload): Observable<CmBillList[]> {
    const cmBillListUrl = getCmBillListEndpointUrl(
      billData.txnType,
      billData.subTxnType,
      billData.pageIndex,
      billData.pageSize,
      billData.customerName,
      billData.refDocNo,
      billData.sort
    );

    return this.apiService
      .get(cmBillListUrl.path, cmBillListUrl.params)
      .pipe(
        map((data: any) => BillCancellationRequestsHelper.getCmBillList(data))
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

  getHistoryItems(
    requestPayload: bcHistoryRequestPayload,
    searchField?: string,
    searchType?: string,
    page?: number,
    size?: number,
    txnType?: string,
    subTxnType?: string
  ): Observable<bcHistoryResponse> {
    const urlObject = getBillCancellationHistoryDetailsUrl(
      subTxnType,
      txnType,
      searchField,
      searchType,
      page,
      size
    );
    return this.apiService
      .post(urlObject.path, requestPayload, urlObject.params)
      .pipe(map((res: any) => BillCancellationRequestsHelper.getBcList(res)));
  }
}
