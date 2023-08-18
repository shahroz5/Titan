import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ApiService,
  getAdvanceBookingEndPointUrl,
  getAdvanceBookingPriceUpdateEndPointUrl,
  searchABWithActionUrl,
  getAdvanceBookingActionUrl,
  getWorkFlowProcessUrl,
  getWorkFlowProcessDetailsUrl,
  uploadManualBillUrl,
  downloadManualBillUrl,
  manualBillListUrl,
  validateABMetalRateUrl
} from '@poss-web/shared/util-api-service';
import { map } from 'rxjs/operators';
import {
  CashMemoHelper,
  CashMemoAdaptor
} from '@poss-web/shared/util-adaptors';
import {
  CashMemoDetailsRequest,
  AdvanceBookingDetailsResponse,
  AdvanceBookingSearchPayload,
  ABSearchResponse,
  RequestPayload,
  ABRequestStatusList,
  workflowPayload,
  FileUploadDownloadPayload
} from '@poss-web/shared/models';
@Injectable()
export class AdvanceBookingService {
  constructor(private apiService: ApiService) {}

  createCashMemo(
    txnType: string,
    subTxnType: string,
    requestDetails?: any
  ): Observable<AdvanceBookingDetailsResponse> {
    const createCashMemoUrl = getAdvanceBookingEndPointUrl(txnType, subTxnType);
    return this.apiService
      .post(createCashMemoUrl.path, requestDetails, createCashMemoUrl.params)
      .pipe(
        map((data: any) =>
          CashMemoAdaptor.cashMemoDetailsResponseFromJson(data)
        )
      );
  }

  viewCashMemo(
    id: string,
    txnType: string,
    subTxnType: string
  ): Observable<AdvanceBookingDetailsResponse> {
    const viewCashMemoUrl = getAdvanceBookingEndPointUrl(
      txnType,
      subTxnType,
      id
    );
    return this.apiService
      .get(viewCashMemoUrl.path, viewCashMemoUrl.params)
      .pipe(
        map((data: any) =>
          CashMemoAdaptor.cashMemoDetailsResponseFromJson(data)
        )
      );
  }

  searchAB(
    searchPaylaod: AdvanceBookingSearchPayload
  ): Observable<ABSearchResponse> {
    const getsearchABUrl = searchABWithActionUrl(searchPaylaod);

    return this.apiService
      .get(getsearchABUrl.path, getsearchABUrl.params)
      .pipe(map((data: any) => CashMemoHelper.getABDetails(data)));
  }

  partialUpdateCashMemo(
    id: string,
    requestDetails: string,
    txnType: string,
    subTxnType: string,
    actionType?: string
  ): Observable<AdvanceBookingDetailsResponse> {
    const partialUpdateCashMemoUrl = getAdvanceBookingEndPointUrl(
      txnType,
      subTxnType,
      id,
      null,
      actionType
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

  updateABActions(
    id: string,
    requestDetails: string,
    txnType: string,
    subTxnType: string,
    actionType?: string,
    acknowledge?: boolean
  ): Observable<AdvanceBookingDetailsResponse> {
    const partialUpdateCashMemoUrl = getAdvanceBookingActionUrl(
      txnType,
      subTxnType,
      id,
      actionType,
      acknowledge
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
  ): Observable<AdvanceBookingDetailsResponse> {
    const updateCashMemoUrl = getAdvanceBookingEndPointUrl(
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
    const deleteCashMemoUrl = getAdvanceBookingEndPointUrl(
      txnType,
      subTxnType,
      id
    );
    return this.apiService
      .delete(deleteCashMemoUrl.path, deleteCashMemoUrl.params)
      .pipe(map((data: any) => data));
  }

  updatePriceDetails(
    id: string,
    txnType: string,
    subTxnType: string,
    action?: string
  ): Observable<AdvanceBookingDetailsResponse> {
    const updatePriceDetailsUrl = getAdvanceBookingPriceUpdateEndPointUrl(
      id,
      txnType,
      subTxnType,
      action
    );
    return this.apiService
      .patch(updatePriceDetailsUrl.path, {}, updatePriceDetailsUrl.params)
      .pipe(
        map((data: any) =>
          CashMemoAdaptor.cashMemoDetailsResponseFromJson(data)
        )
      );
  }

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

  uploadFile(fileDetails: FileUploadDownloadPayload): Observable<any> {
    const url = uploadManualBillUrl(fileDetails);
    return this.apiService
      .postImage(url, fileDetails.file, 'text')
      .pipe(map((data: any) => data));
  }

  uploadFileList(fileDetails: FileUploadDownloadPayload): Observable<any> {
    const url = manualBillListUrl(fileDetails);
    return this.apiService.get(url).pipe(map((idData: any) => idData.results));
  }

  downloadFile(data: { id: string; locationCode: string }): Observable<any> {
    const url = downloadManualBillUrl(data);
    return this.apiService.get(url).pipe(map((idData: any) => idData.url));
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
    const validateMetalRateUrl = validateABMetalRateUrl(rquestParam);
    return this.apiService
      .post(validateMetalRateUrl.path, reqPayload, validateMetalRateUrl.params)
      .pipe(map(res => res));
  }
}
