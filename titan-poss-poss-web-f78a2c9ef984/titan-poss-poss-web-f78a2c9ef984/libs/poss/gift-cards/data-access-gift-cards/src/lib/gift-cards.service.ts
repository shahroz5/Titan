import { Injectable } from '@angular/core';
import {
  AddGiftCardItemPayload,
  CancellableCashMemoData,
  CancellationReasonsEnum,
  CashMemoMinimalDetail,
  CreatedGiftCardCashMemoDetails,
  GcCashMemoCancelRequestBody,
  GcCashMemoCancelResponse,
  GcCashMemoDetailsRequest,
  GetAddedGiftCardItemResponse,
  GetCreatedGiftCardCmDetails,
  GetDeletedGiftCardItemResponse,
  GetGiftCardItemResponse,
  GetPartiallyUpdatedGcCmResponse,
  GetUpdatedGcCashMemoResponse,
  GiftCardsHistoryListItemsResponse,
  GiftCardsHistoryRequestPayload,
  GiftCardTxnEnum,
  PartiallyUpdateGiftDetailsPayload,
  QCGCCardDetails,
  QCGCGetBalancePayload
} from '@poss-web/shared/models';
import { GiftCardsAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ApiService,
  getCashMemoCancelEndPoint,
  getCashMemoEndPointUrl,
  getCashMemoGiftItemEndPointUrl,
  getGcHistoryListItemsEndpointURl,
  getQCGCPaymentEndpointURl
} from '@poss-web/shared/util-api-service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GiftCardsService {
  constructor(private apiService: ApiService) {}

  createGiftCardCashMemo(): Observable<GetCreatedGiftCardCmDetails> {
    const subTxnType = GiftCardTxnEnum.GIFT_SALE;
    const txnType = GiftCardTxnEnum.CM;
    const apiPath = getCashMemoEndPointUrl(txnType, subTxnType);
    return this.apiService
      .post(apiPath.path, {}, apiPath.params)
      .pipe(
        map((data: CreatedGiftCardCashMemoDetails) =>
          GiftCardsAdaptor.getCreatedGiftCardCmDetails(data)
        )
      );
  }

  partiallyUpdateGcCashMemo(
    cashMemoId: string,
    requestBody: any = {}
  ): Observable<GetPartiallyUpdatedGcCmResponse> {
    const subTxnType = GiftCardTxnEnum.GIFT_SALE;
    const txnType = GiftCardTxnEnum.CM;
    const apiPath = getCashMemoEndPointUrl(txnType, subTxnType, cashMemoId);
    return this.apiService
      .patch(apiPath.path, requestBody, apiPath.params)
      .pipe(
        map((data: any) => GiftCardsAdaptor.getPartiallyUpdatedGiftCardCm(data))
      );
  }

  addGiftCardItem(
    cashMemoId: string,
    requestBody: AddGiftCardItemPayload
  ): Observable<GetAddedGiftCardItemResponse> {
    const subTxnType = GiftCardTxnEnum.GIFT_SALE;
    const txnType = GiftCardTxnEnum.CM;
    const vendorCode = GiftCardTxnEnum.QC_VENDOR_CODE;
    const giftType = GiftCardTxnEnum.GIFT_TYPE;
    const urlObject = getCashMemoGiftItemEndPointUrl(
      txnType,
      subTxnType,
      cashMemoId,
      null,
      giftType,
      vendorCode
    );
    const apiPath = urlObject.path;
    const params = urlObject.params;
    return this.apiService
      .post(apiPath, requestBody, params)
      .pipe(
        map((data: any) => GiftCardsAdaptor.getAddedGiftCardItemResponse(data))
      );
  }

  getAddedGiftCardItem(
    cashMemoId: string,
    giftCardItemId: string
  ): Observable<GetGiftCardItemResponse> {
    const subTxnType = GiftCardTxnEnum.GIFT_SALE;
    const txnType = GiftCardTxnEnum.CM;
    const urlObject = getCashMemoGiftItemEndPointUrl(
      txnType,
      subTxnType,
      cashMemoId,
      giftCardItemId
    );
    const apiPath = urlObject.path;
    const params = urlObject.params;
    return this.apiService
      .get(apiPath, params)
      .pipe(map((data: any) => GiftCardsAdaptor.getGiftCardItemResponse(data)));
  }

  deleteAddedGiftCardItem(
    cashMemoId: string,
    giftCardItemId: string
  ): Observable<GetDeletedGiftCardItemResponse> {
    const subTxnType = GiftCardTxnEnum.GIFT_SALE;
    const txnType = GiftCardTxnEnum.CM;
    const urlObject = getCashMemoGiftItemEndPointUrl(
      txnType,
      subTxnType,
      cashMemoId,
      giftCardItemId
    );
    const apiPath = urlObject.path;
    const params = urlObject.params;
    return this.apiService
      .delete(apiPath, params)
      .pipe(
        map((data: any) =>
          GiftCardsAdaptor.getDeletedGiftCardItemResponse(data)
        )
      );
  }

  partiallyUpdateGiftCardItem(
    cashMemoId: string,
    giftCardItemId: string,
    requestBody: PartiallyUpdateGiftDetailsPayload
  ): Observable<GetAddedGiftCardItemResponse> {
    const subTxnType = GiftCardTxnEnum.GIFT_SALE;
    const txnType = GiftCardTxnEnum.CM;
    const urlObject = getCashMemoGiftItemEndPointUrl(
      txnType,
      subTxnType,
      cashMemoId,
      giftCardItemId
    );
    const apiPath = urlObject.path;
    const params = urlObject.params;
    return this.apiService
      .patch(apiPath, requestBody, params)
      .pipe(
        map((data: any) => GiftCardsAdaptor.getAddedGiftCardItemResponse(data))
      );
  }

  updateGcCashMemo(
    cashMemoId: string,
    requestDetails: GcCashMemoDetailsRequest
  ): Observable<GetUpdatedGcCashMemoResponse> {
    const txnType = GiftCardTxnEnum.CM;
    const subTxnType = GiftCardTxnEnum.GIFT_SALE;
    const status = GiftCardTxnEnum.CONFIRMED;
    const apiPath = getCashMemoEndPointUrl(
      txnType,
      subTxnType,
      cashMemoId,
      status
    );
    return this.apiService
      .put(apiPath.path, requestDetails, apiPath.params)
      .pipe(
        map((data: any) => GiftCardsAdaptor.getUpdatedGcCashMemoResponse(data))
      );
  }

  printGcCashMemo(): Observable<any> {
    // const printGcCmURL = './assets/print-gc-cm-data.txt';
    // const responseType = responseTypeEnum.Text;
    // return this.http.get(printGcCmURL, {responseType}).pipe(
    //   map(data => {
    //     return data;
    //   })
    //);
    return of('Print functionality To be implemented');
  }

  getCashMemoBillsAvailableForCancellation(
    mobileNumber?: string,
    cmNumber?: number,
    fiscalYear?: number,
    page?: number,
    size?: number
  ): Observable<CancellableCashMemoData[]> {
    const txnType = GiftCardTxnEnum.CMCAN;
    const subTxnType = GiftCardTxnEnum.GIFT_SALE;
    const urlObject = getCashMemoCancelEndPoint(
      txnType,
      subTxnType,
      mobileNumber,
      cmNumber,
      fiscalYear
    );
    const apiPath = urlObject.path;
    const params = urlObject.params;
    return this.apiService
      .get(apiPath, params)
      .pipe(
        map((data: any) => GiftCardsAdaptor.getCancellableGcCashMemo(data))
      );
  }

  getGcCashMemoById(id: string): Observable<CashMemoMinimalDetail> {
    const txnType = GiftCardTxnEnum.CM;
    const subTxnType = GiftCardTxnEnum.GIFT_SALE;
    const viewCashMemoUrl = getCashMemoEndPointUrl(txnType, subTxnType, id);
    return this.apiService
      .get(viewCashMemoUrl.path, viewCashMemoUrl.params)
      .pipe(
        map((data: any) => GiftCardsAdaptor.getGcCashMemoMinimalData(data))
      );
  }

  cancelGcCashMemo(
    requestBody: GcCashMemoCancelRequestBody
  ): Observable<GcCashMemoCancelResponse> {
    const txnType = GiftCardTxnEnum.CMCAN;
    const subTxnType = GiftCardTxnEnum.GIFT_SALE;
    const urlObj = getCashMemoCancelEndPoint(txnType, subTxnType);
    const cancelCashMemoUrl = urlObj.path;
    const params = urlObj.params;
    return this.apiService
      .post(cancelCashMemoUrl, requestBody, params)
      .pipe(
        map((data: any) => GiftCardsAdaptor.getGcCashMemoCancelResponse(data))
      );
  }

  getGcCancellationReasons(): Observable<string[]> {
    const cancellationReasons = [
      CancellationReasonsEnum.REASON_1,
      CancellationReasonsEnum.REASON_2,
      CancellationReasonsEnum.REASON_3
    ];
    return of(cancellationReasons);
  }

  getQCGCBalance(request: QCGCGetBalancePayload): Observable<QCGCCardDetails> {
    const firstApiUrl = getQCGCPaymentEndpointURl(request);
    return this.apiService
      .get(firstApiUrl.path, firstApiUrl.params)
      .pipe(map(data => data));
  }

  loadGiftCardsHistoryListItems(
    payload: GiftCardsHistoryRequestPayload
  ): Observable<GiftCardsHistoryListItemsResponse> {
    const url = getGcHistoryListItemsEndpointURl(
      payload.size,
      payload.page,
      payload.subTxnType,
      payload.txnType,
      payload.sort,
      payload.filterOptions.searchField,
      payload.filterOptions.searchType
    );
    const reqPayload = {
      docNo: payload.filterOptions.docNo,
      fiscalYear: payload.filterOptions.fiscalYear,
      fromDocDate: payload.filterOptions.fromDocDate,
      toDocDate: payload.filterOptions.toDocDate
    };

    return this.apiService
      .post(url.path, reqPayload, url.params)
      .pipe(map(res => GiftCardsAdaptor.giftCardsHistoryListItems(res)));
  }
}
