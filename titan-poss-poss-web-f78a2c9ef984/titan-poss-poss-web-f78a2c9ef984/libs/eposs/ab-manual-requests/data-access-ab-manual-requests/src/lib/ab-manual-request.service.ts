import { Injectable } from '@angular/core';
import {
  CashMemoDetailsResponse,
  ApprovalRequest,
  AbManualRequestDetails,
  AbManualRequestList,
  AbManualItemDetails,
  FileUploadDownloadPayload
} from '@poss-web/shared/models';
import {
  CashMemoAdaptor,
  AbManulRequestAdaptor,
  AbManualRequestHelper
} from '@poss-web/shared/util-adaptors';
import {
  ApiService,
  downloadManualBillUrl,
  getCashMemoEndPointUrl,
  getCashMemoItemEndPointUrl,
  getCmApprovalRequestUrl,
  getCmRequestDetailsUrl,
  getCmRequestListUrl,
  getProductDetailsEndPointUrl,
  manualBillListUrl
} from '@poss-web/shared/util-api-service';
import { Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AbManualRequestService {
  constructor(private apiService: ApiService) {}

  getAbManualRequestList(
    approvalStatus: string,
    appliedFilters: any,
    pageIndex: number,
    pageSize: number,
    workflowType: string
  ): Observable<AbManualRequestList[]> {
    const url = getCmRequestListUrl(
      approvalStatus,
      pageIndex,
      pageSize,
      workflowType
    );

    return this.apiService
      .post(url.path, appliedFilters, url.params)
      .pipe(map(data => AbManualRequestHelper.getAbManualRequestList(data)));
  }

  getAbManualRequestDetails(
    processId: string,
    taskId: string,
    taskName: string,
    workflowType: string
  ): Observable<AbManualRequestDetails> {
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
          AbManulRequestAdaptor.getAbManualRequestDetailsFromJson(data)
        )
      );
  }

  getAbManualProductList(
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

  getAbManualProductDetails(
    id: string,
    itemId: string,
    txnType: string,
    subTxnType: string
  ): Observable<AbManualItemDetails> {
    const getItemFromCashMemoUrl = getCashMemoItemEndPointUrl(
      id,
      txnType,
      subTxnType,
      itemId
    );
    return this.apiService
      .get(getItemFromCashMemoUrl.path, getItemFromCashMemoUrl.params)
      .pipe(map((data: any) => data))
      .pipe(
        concatMap(itemData =>
          this.apiService
            .get(getProductDetailsEndPointUrl(itemData.itemCode).path)
            .pipe(
              map((data: any) =>
                AbManulRequestAdaptor.getItemDetailsResponseFromJson(
                  itemData,
                  data
                )
              )
            )
        )
      );
  }

  // TODO: to be checked and removed, added for getting item details in eposs
  getProductDetails(itemData: any): Observable<any> {
    return this.apiService
      .get(getProductDetailsEndPointUrl(itemData.itemCode).path)
      .pipe(
        map(
          (data: any) =>
            //AbManulRequestAdaptor.getItemDetailsResponseFromJson(itemData, data)
            data
        )
      );
  }

  getAbManualApprovalRequest(
    isApprove: boolean,
    requestBody: any,
    processId: string,
    taskId: string,
    taskName: string
  ): Observable<ApprovalRequest> {
    const url = getCmApprovalRequestUrl(isApprove, processId, taskId, taskName);

    return this.apiService
      .put(url.path, requestBody, url.params)
      .pipe(
        map(data =>
          AbManulRequestAdaptor.getAbManualApprovalRequestFromJson(data)
        )
      );
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
