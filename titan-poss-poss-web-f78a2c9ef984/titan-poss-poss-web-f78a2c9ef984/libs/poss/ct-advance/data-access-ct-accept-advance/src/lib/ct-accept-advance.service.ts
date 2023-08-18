import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ApiService,
  getAcceptAdvanceEndPointUrl,
  getAcceptAdvanceHistoryEndPointUrl
} from '@poss-web/shared/util-api-service';
import {
  CtAcceptAdvanceTxnEnum,
  InitiateAdvanceResponse,
  UpdateAdvanceTransactionResponse,
  UpdateAdvanceRequestPayload,
  PartialUpdateAdvanceRequestPayload,
  AdvanceHistoryItemsRequestPayload,
  AdvanceHistoryResponse
} from '@poss-web/shared/models';
import { map } from 'rxjs/operators';
import { CtAcceptAdvanceAdaptor } from '@poss-web/shared/util-adaptors';

@Injectable({
  providedIn: 'root'
})
export class CtAcceptAdvanceService {
  private txnType = CtAcceptAdvanceTxnEnum.ADV;
  private subtxnType = CtAcceptAdvanceTxnEnum.NON_FROZEN_RATES;

  constructor(private apiService: ApiService) {}

  initiateAdvanceTransaction(): Observable<InitiateAdvanceResponse> {
    const urlObject = getAcceptAdvanceEndPointUrl(
      this.subtxnType,
      this.txnType
    );
    const initiateAdvanceApiUrl = urlObject.path;
    const params = urlObject.params;
    return this.apiService
      .post(initiateAdvanceApiUrl, {}, params)
      .pipe(
        map((data: InitiateAdvanceResponse) =>
          CtAcceptAdvanceAdaptor.getInitiateAdvanceResponse(data)
        )
      );
  }

  updateAdvanceTransaction(
    id: string,
    requestPayload: UpdateAdvanceRequestPayload
  ): Observable<UpdateAdvanceTransactionResponse> {
    const urlObject = getAcceptAdvanceEndPointUrl(
      this.subtxnType,
      this.txnType,
      id
    );
    const updateAdvanceTransactionUrl = urlObject.path;
    const params = urlObject.params;
    return this.apiService
      .put(updateAdvanceTransactionUrl, requestPayload, params)
      .pipe(
        map((data: UpdateAdvanceTransactionResponse) =>
          CtAcceptAdvanceAdaptor.getUpdateAdvanceTransactionResponse(data)
        )
      );
  }

  partiallyUpdateAdvanceTransaction(
    id: string,
    requestPayload: PartialUpdateAdvanceRequestPayload
  ): Observable<any> {
    const urlObject = getAcceptAdvanceEndPointUrl(
      this.subtxnType,
      this.txnType,
      id
    );
    const partiallyUpdateAdvanceTransactionUrl = urlObject.path;
    const params = urlObject.params;
    return this.apiService
      .patch(partiallyUpdateAdvanceTransactionUrl, requestPayload, params)
      .pipe(map(data => data));
  }

  getAdvanceTransactionDetails(id: string): Observable<any> {
    const urlObject = getAcceptAdvanceEndPointUrl(
      this.subtxnType,
      this.txnType,
      id
    );
    const viewAdvanceTransactionUrl = urlObject.path;
    const params = urlObject.params;
    return this.apiService
      .get(viewAdvanceTransactionUrl, params)
      .pipe(map(data => data));
  }

  deleteAdvanceTransactionDetails(id: string): Observable<any> {
    const urlObject = getAcceptAdvanceEndPointUrl(
      this.subtxnType,
      this.txnType,
      id,
      'remarks'
    );
    const viewAdvanceTransactionUrl = urlObject.path;
    const params = urlObject.params;
    return this.apiService
      .delete(viewAdvanceTransactionUrl, params)
      .pipe(map(data => data));
  }

  getAdvanceHistoryItems(
    requestPayload: AdvanceHistoryItemsRequestPayload,
    searchField?: string,
    searchType?: string,
    status?: string,
    page?: number,
    size?: number
  ): Observable<AdvanceHistoryResponse> {
    const urlObject = getAcceptAdvanceHistoryEndPointUrl(
      this.subtxnType,
      this.txnType,
      searchField,
      searchType,
      status,
      page,
      size
    );
    return this.apiService
      .post(urlObject.path, requestPayload, urlObject.params)
      .pipe(
        map(data =>
          data && data.results
            ? { results: data.results, totalElements: data.totalElements }
            : { results: [], totalElements: 0 }
        )
      );
  }
}
