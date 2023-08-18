import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ApiService,
  downloadManualBillUrl,
  getAcceptAdvanceEndPointUrl,
  getAcceptAdvanceHistoryEndPointUrl,
  getCashPaymentEngineUrl,
  getFrozenCNsUrl,
  getGenerateOTPUrl,
  getMegreCNsUrl,
  getSearchGRFUrl,
  getValidateOTPUrl,
  manualBillListUrl,
  uploadManualBillUrl
} from '@poss-web/shared/util-api-service';
import {
  CtGrfTxnEnum,
  InitiateAdvanceResponse,
  UpdateAdvanceTransactionResponse,
  UpdateAdvanceRequestPayload,
  PartialUpdateAdvanceRequestPayload,
  MergeCNPayload,
  AdvanceHistoryItemsRequestPayload,
  AdvanceHistoryResponse,
  FileUploadDownloadPayload
} from '@poss-web/shared/models';
import { map } from 'rxjs/operators';
import { CtGrfAdaptor } from '@poss-web/shared/util-adaptors';

@Injectable({
  providedIn: 'root'
})
export class CtGrfService {
  private txnType = CtGrfTxnEnum.ADV;
  private subtxnType = CtGrfTxnEnum.FROZEN_RATES;

  constructor(private apiService: ApiService) {}

  initiateGrfTransaction(
    subTransactionType: string,
    requestBody: any
  ): Observable<InitiateAdvanceResponse> {
    const urlObject = getAcceptAdvanceEndPointUrl(
      subTransactionType,
      this.txnType
    );
    const initiateAdvanceApiUrl = urlObject.path;
    const params = urlObject.params;
    return this.apiService
      .post(initiateAdvanceApiUrl, requestBody, params)
      .pipe(
        map((data: InitiateAdvanceResponse) =>
          CtGrfAdaptor.getInitiateAdvanceResponse(data)
        )
      );
  }

  updateGrfTransaction(
    subTransactionType: string,
    id: string,
    requestPayload: UpdateAdvanceRequestPayload
  ): Observable<UpdateAdvanceTransactionResponse> {
    const urlObj = getAcceptAdvanceEndPointUrl(
      subTransactionType,
      this.txnType,
      id
    );
    const updateAdvanceTransactionUrl = urlObj.path;
    const params = urlObj.params;
    return this.apiService
      .put(updateAdvanceTransactionUrl, requestPayload, params)
      .pipe(
        map((data: UpdateAdvanceTransactionResponse) =>
          CtGrfAdaptor.getUpdateAdvanceTransactionResponse(data)
        )
      );
  }

  partiallyUpdateGrfTransaction(
    subTransactionType: string,
    id: string,
    requestPayload: PartialUpdateAdvanceRequestPayload
  ): Observable<any> {
    const urlObject = getAcceptAdvanceEndPointUrl(
      subTransactionType,
      this.txnType,
      id
    );
    const partiallyUpdateAdvanceTransactionUrl = urlObject.path;
    const params = urlObject.params;
    return this.apiService
      .patch(partiallyUpdateAdvanceTransactionUrl, requestPayload, params)
      .pipe(map(data => data));
  }

  getGrfTransactionDetails(
    subTransactionType: string,
    id: string
  ): Observable<any> {
    const urlObject = getAcceptAdvanceEndPointUrl(
      subTransactionType,
      this.txnType,
      id
    );
    const viewGrfTransactionUrl = urlObject.path;
    const params = urlObject.params;
    return this.apiService
      .get(viewGrfTransactionUrl, params)
      .pipe(map(data => data));
  }

  loadFrozenCNs(customerId: string) {
    const url = getFrozenCNsUrl(customerId);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => data.results));
  }

  searchGRF(payload: { docNo: string; fiscalYear: string }) {
    const url = getSearchGRFUrl(payload.docNo, payload.fiscalYear);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => CtGrfAdaptor.getCreditNoteDetails(data)));
  }

  mergeCNs(mergeCNsPayload: MergeCNPayload) {
    const url = getMegreCNsUrl();
    return this.apiService.patch(url.path, mergeCNsPayload, url.params);
  }
  generateOTP(id: string) {
    const url = getGenerateOTPUrl(id);
    return this.apiService.post(url.path, {}, url.params);
  }
  validateOTP(validateOTP: { token: string; id: string }) {
    const url = getValidateOTPUrl(validateOTP.id, validateOTP.token);
    return this.apiService.put(url.path, {}, url.params);
  }

  getAdvanceHistoryItems(
    subTransactionType: string,
    requestPayload: AdvanceHistoryItemsRequestPayload,
    searchField?: string,
    searchType?: string,
    status?: string,
    page?: number,
    size?: number
  ): Observable<AdvanceHistoryResponse> {
    const urlObject = getAcceptAdvanceHistoryEndPointUrl(
      subTransactionType,
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
  getCNValidationDetails(payload: {
    ruleType: string;
    requestBody: any;
  }): Observable<any> {
    const url = getCashPaymentEngineUrl(payload.ruleType);
    return this.apiService.post(url, payload.requestBody);
  }

  uploadFileList(fileDetails: FileUploadDownloadPayload): Observable<any> {
    const url = manualBillListUrl(fileDetails);
    return this.apiService.get(url).pipe(map((idData: any) => idData.results));
  }

  uploadFile(fileDetails: FileUploadDownloadPayload): Observable<any> {
    const url = uploadManualBillUrl(fileDetails);
    return this.apiService
      .postImage(url, fileDetails.file, 'text')
      .pipe(map((data: any) => data));
  }

  downloadFile(data: { id: string; locationCode: string }): Observable<any> {
    const url = downloadManualBillUrl(data);
    return this.apiService.get(url).pipe(map((idData: any) => idData.url));
  }
}
