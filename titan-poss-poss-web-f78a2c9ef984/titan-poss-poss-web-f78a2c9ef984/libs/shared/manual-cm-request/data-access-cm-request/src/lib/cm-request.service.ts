import { Injectable } from '@angular/core';
import {
  CashMemoDetailsResponse,
  ApprovalRequest,
  CmRequestList,
  CashMemoItemDetails,
  WorkflowTypeEnum,
  FileUploadDownloadPayload
} from '@poss-web/shared/models';
import {
  CashMemoAdaptor,
  CmRequestAdaptor,
  CmRequestHelper
} from '@poss-web/shared/util-adaptors';
import {
  ApiService,
  downloadManualBillUrl,
  getCashMemoEndPointUrl,
  getCashMemoItemEndPointUrl,
  getCmApprovalRequestUrl,
  getCmRequestDetailsUrl,
  getCmRequestListUrl,
  getWorkFlowProcessDetailsUrl,
  getWorkFlowProcessUrl,
  manualBillListUrl
} from '@poss-web/shared/util-api-service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CmRequestService {
  constructor(private apiService: ApiService) {}

  getCmRequestList(
    approvalStatus: string,
    appliedFilters: any,
    pageIndex: number,
    pageSize: number,
    workflowType: string,
    userType: boolean
  ): Observable<CmRequestList[]> {
    if (userType) {
      const url = getCmRequestListUrl(
        approvalStatus,
        pageIndex,
        pageSize,
        workflowType
      );

      return this.apiService
        .post(url.path, appliedFilters, url.params)
        .pipe(map(data => CmRequestHelper.getCmRequestList(data)));
    } else {
      const reqBody = appliedFilters;
      const requestParams = {
        workflowType: WorkflowTypeEnum.MANUAL_BILL,
        approvalStatus: approvalStatus,
        size: pageSize,
        page: pageIndex
      };

      const workflowUrl = getWorkFlowProcessUrl(requestParams);

      return this.apiService
        .post(workflowUrl.path, reqBody, workflowUrl.params)
        .pipe(map(data => CmRequestHelper.getCmRequestList(data)));
    }
  }

  getCmRequestDetails(
    processId: string,
    taskId: string,
    taskName: string,
    workflowType: string,
    userType: boolean
  ): Observable<any> {
    if (userType) {
      const url = getCmRequestDetailsUrl(
        processId,
        taskId,
        taskName,
        workflowType
      );

      return this.apiService
        .get(url.path, url.params)
        .pipe(
          map(data =>
            CmRequestAdaptor.getUserType(
              CmRequestAdaptor.getCmRequestDetailsFromJson(data),
              userType
            )
          )
        );
    } else {
      const requestParams = {
        workflowType: WorkflowTypeEnum.MANUAL_BILL,
        processId: processId
      };

      const workflowUrl = getWorkFlowProcessDetailsUrl(requestParams);
      return this.apiService
        .get(workflowUrl.path, workflowUrl.params)
        .pipe(
          map(data =>
            CmRequestAdaptor.getUserType(
              CmRequestAdaptor.getCmRequestDetailsFromJson(data),
              userType
            )
          )
        );
    }
  }

  getCmProductList(
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

  getCmProductDetails(
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

  getCmApprovalRequest(
    isApprove: boolean,
    requestBody: any,
    processId: string,
    taskId: string,
    taskName: string
  ): Observable<ApprovalRequest> {
    const url = getCmApprovalRequestUrl(isApprove, processId, taskId, taskName);

    return this.apiService
      .put(url.path, requestBody, url.params)
      .pipe(map(data => CmRequestAdaptor.getCmApprovalRequestFromJson(data)));
  }

  uploadFileList(fileDetails: FileUploadDownloadPayload): Observable<any> {
    const url = manualBillListUrl(fileDetails);
    return this.apiService.get(url).pipe(map((idData: any) => idData.results));
  }

  downloadFile(payload: { id: string; locationCode: string }): Observable<any> {
    const url = downloadManualBillUrl(payload);
    return this.apiService.get(url).pipe(map((idData: any) => idData.url));
  }
}
