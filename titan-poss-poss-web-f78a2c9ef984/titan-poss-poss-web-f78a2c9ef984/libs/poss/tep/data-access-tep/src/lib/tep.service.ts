import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ApiService,
  getWorkFlowProcessUrl,
  getWorkFlowProcessDetailsUrl,
  getRefundStatusUrl,
  getRefundDetailsUrl,
  getTepItemConfigUrl,
  searchTEPWithActionUrl,
  getTEPHistoryEndPointUrl
} from '@poss-web/shared/util-api-service';
import { map } from 'rxjs/operators';
import { CashMemoHelper, TEPHelper } from '@poss-web/shared/util-adaptors';
import {
  RequestPayload,
  ABRequestStatusList,
  workflowPayload,
  RefundStatusCount,
  RefundRequestPayload,
  GetTepItemConfiguratonResponse,
  AdvanceBookingSearchPayload,
  TEPSearchResponse,
  AdvanceHistoryItemsRequestPayload,
  SortItem
} from '@poss-web/shared/models';

@Injectable()
export class TEPService {
  constructor(private apiService: ApiService) {}

  loadWorkflowDeatils(data: workflowPayload): Observable<any> {
    const workflowUrl = getWorkFlowProcessDetailsUrl(data);

    return this.apiService
      .get(workflowUrl.path, workflowUrl.params)
      .pipe(map(res => res));
  }

  getloadRequest(data: RequestPayload): Observable<ABRequestStatusList> {
    const reqBody = data.reqBody;

    const workflowUrl = getWorkFlowProcessUrl(data.requestParams);

    return this.apiService
      .post(workflowUrl.path, reqBody, workflowUrl.params)
      .pipe(map((res: any) => CashMemoHelper.loadRequest(res)));
  }

  getRefundRequest(data: RequestPayload): Observable<RefundStatusCount> {
    const reqBody = data.reqBody;

    const workflowUrl = getRefundStatusUrl(data.requestParams);

    return this.apiService
      .post(workflowUrl.path, reqBody, workflowUrl.params)
      .pipe(map((res: any) => CashMemoHelper.loadRefundDeatils(res)));
  }

  searchTep(
    TepSearchPayload?: AdvanceBookingSearchPayload,
    notConfirmedpayload?: RequestPayload
  ): Observable<TEPSearchResponse> {
    if (TepSearchPayload) {
      const urlObject = searchTEPWithActionUrl(TepSearchPayload);
      const apiPath = urlObject.path;
      const params = urlObject.params;
      return this.apiService
        .get(apiPath, params)
        .pipe(map((res: any) => TEPHelper.getTEPDetails(res)));
    } else {
      const reqBody = notConfirmedpayload.reqBody;

      const workflowUrl = getRefundStatusUrl(notConfirmedpayload.requestParams);

      return this.apiService
        .post(workflowUrl.path, reqBody, workflowUrl.params)
        .pipe(map((res: any) => res));
    }
  }
  getHistoryItems(
    requestPayload: AdvanceHistoryItemsRequestPayload,
    searchField?: string,
    searchType?: string,
    status?: string,
    page?: number,
    size?: number,
    txnType?: string,
    subTxnType?: string,
    sort?: SortItem
  ): Observable<TEPSearchResponse> {
    const urlObject = getTEPHistoryEndPointUrl(
      subTxnType,
      txnType,
      sort,
      searchField,
      searchType,
      status,
      page,
      size
    );
    return this.apiService
      .post(urlObject.path, requestPayload, urlObject.params)
      .pipe(map((res: any) => TEPHelper.getHistoryDetails(res)));
  }
  getRefundRequestDetails(data: RefundRequestPayload): Observable<any> {
    const api = getRefundDetailsUrl(data);

    return this.apiService
      .get(api.path, api.params)
      .pipe(map((res: any) => res));
  }

  ApproveRefundRequestDetails(data: RefundRequestPayload): Observable<any> {
    const api = getRefundDetailsUrl(data);

    return this.apiService
      .put(api.path, {}, api.params)
      .pipe(map((res: any) => res));
  }

  getTepItemConfiguration(
    itemCode: string,
    tepType: string,
    customerMobileNo?: string
  ): Observable<GetTepItemConfiguratonResponse> {
    const getTepItemConfigurationUrl = getTepItemConfigUrl(
      itemCode,
      tepType,
      false,
      customerMobileNo
    );
    return this.apiService.get(
      getTepItemConfigurationUrl.path,
      getTepItemConfigurationUrl.params
    );
  }
}
