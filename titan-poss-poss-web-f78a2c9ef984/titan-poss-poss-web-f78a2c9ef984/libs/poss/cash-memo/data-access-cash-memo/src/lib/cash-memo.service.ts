import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ApiService,
  getCashMemoEndPointUrl,
  getInvokeOrderDetailsEndPointUrl,
  getPriceUpdateEndPointUrl,
  getCashMemoHistoryDetailsUrl,
  getCashMemoItemEndPointUrl,
  getTcsDetailUrl,
  validateCMMetalRateUrl
} from '@poss-web/shared/util-api-service';
import { map } from 'rxjs/operators';
import { CashMemoAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CashMemoDetailsRequest,
  CreateCashMemoResponse,
  CashMemoDetailsResponse,
  CashMemoItemDetails
} from '@poss-web/shared/models';

@Injectable()
export class CashMemoService {
  constructor(private apiService: ApiService) {}

  createCashMemo(
    txnType: string,
    subTxnType: string,
    manualBillRequest: any
  ): Observable<CreateCashMemoResponse> {
    const createCashMemoUrl = getCashMemoEndPointUrl(txnType, subTxnType);
    return this.apiService
      .post(createCashMemoUrl.path, manualBillRequest, createCashMemoUrl.params)
      .pipe(
        map((data: any) => CashMemoAdaptor.createCashMemoResponseFromJson(data))
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

  getTcsAmount(
    id: string,
    txnType: string,
    subTxnType: string
  ): Observable<any> {
    const rquestParam = {
      id: id,
      txnType: txnType,
      subTxnType: subTxnType
    };
    const viewCashMemoUrl = getTcsDetailUrl(rquestParam);
    return this.apiService
      .get(viewCashMemoUrl.path, viewCashMemoUrl.params)
      .pipe(map((data: any) => CashMemoAdaptor.getTcsDataFromJson(data)));
  }

  validateMetalRate(
    id: string,
    status: string,
    reqPayload: any,
    txnType: string,
    subTxnType: string
  ): Observable<any> {
    const rquestParam = {
      id: id,
      status: status,
      txnType: txnType,
      subTxnType: subTxnType
    };
    const validateMetalRateUrl = validateCMMetalRateUrl(rquestParam);
    return this.apiService
      .post(validateMetalRateUrl.path, reqPayload, validateMetalRateUrl.params)
      .pipe(map(res => res));
  }

  partialUpdateCashMemo(
    id: string,
    requestDetails: any,
    txnType: string,
    subTxnType: string
  ): Observable<CashMemoDetailsResponse> {
    const partialUpdateCashMemoUrl = getCashMemoEndPointUrl(
      txnType,
      subTxnType,
      id
    );
    return this.apiService
      .patch(
        partialUpdateCashMemoUrl.path,
        requestDetails,
        partialUpdateCashMemoUrl.params
      )
      .pipe(
        map((data: any) =>
          CashMemoAdaptor.cashMemoDetailsResponseFromJson(data)
        )
      );
  }

  updateCashMemo(
    updateCashMemoRequest: CashMemoDetailsRequest,
    id: string,
    status: string,
    txnType: string,
    subTxnType: string
  ): Observable<CashMemoDetailsResponse> {
    const updateCashMemoUrl = getCashMemoEndPointUrl(
      txnType,
      subTxnType,
      id,
      status
    );
    return this.apiService
      .put(
        updateCashMemoUrl.path,
        updateCashMemoRequest,
        updateCashMemoUrl.params
      )
      .pipe(
        map((data: any) =>
          CashMemoAdaptor.cashMemoDetailsResponseFromJson(data)
        )
      );
  }

  deleteCashMemo(
    id: string,
    txnType: string,
    subTxnType: string
  ): Observable<any> {
    const deleteCashMemoUrl = getCashMemoEndPointUrl(txnType, subTxnType, id);
    return this.apiService
      .delete(deleteCashMemoUrl.path, deleteCashMemoUrl.params)
      .pipe(map((data: any) => data));
  }

  updatePriceDetails(
    id: string,
    txnType: string,
    subTxnType: string
  ): Observable<CashMemoDetailsResponse> {
    const updatePriceDetailsUrl = getPriceUpdateEndPointUrl(
      id,
      txnType,
      subTxnType
    );
    return this.apiService
      .patch(updatePriceDetailsUrl.path, {}, updatePriceDetailsUrl.params)
      .pipe(
        map((data: any) =>
          CashMemoAdaptor.cashMemoDetailsResponseFromJson(data)
        )
      );
  }

  invokeOrderDetails(
    txnType: string,
    subTxnType: string,
    requestDetails: any
  ): Observable<CashMemoDetailsResponse> {
    const invokeOrderDetailsUrl = getInvokeOrderDetailsEndPointUrl(
      txnType,
      subTxnType
    );
    return this.apiService
      .patch(
        invokeOrderDetailsUrl.path,
        requestDetails,
        invokeOrderDetailsUrl.params
      )
      .pipe(
        map((data: any) =>
          CashMemoAdaptor.cashMemoDetailsResponseFromJson(data)
        )
      );
  }

  loadCashMemoHistory(
    txnType: string,
    subTxnType: string,
    page: number,
    size: number,
    sort: string,
    requestDetails: any
  ) {
    const url = getCashMemoHistoryDetailsUrl(
      size,
      page,
      subTxnType,
      txnType,
      sort,
      requestDetails?.searchField,
      requestDetails?.searchType
    );
    const reqPayload = {
      docNo: requestDetails?.docNo,
      fromDocDate: requestDetails?.fromDocDate,
      toDocDate: requestDetails?.toDocDate,
      fromNetAmount: requestDetails?.fromNetAmount,
      toNetAmount: requestDetails?.toNetAmount,
      fiscalYear: requestDetails?.fiscalYear
    };
    return this.apiService
      .post(url.path, reqPayload, url.params)
      .pipe(map(res => CashMemoAdaptor.getCashMemoHistoryDetails(res)));
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
}
