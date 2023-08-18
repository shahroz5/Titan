import { Injectable } from '@angular/core';
import {
  CancelCnRequestPayload,
  CnRefundAmountDetails,
  ConfirmRequestTypePayload,
  CreditNoteSearch,
  LoadRequestsPayload,
  SentRequestPayload,
  TransferEghsPayload
} from '@poss-web/shared/models';
import { CreditNoteAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ApiService,
  getCalculateCnRefundAmountRequestUrl,
  getCancelAutoApprovedCnRequestUrl,
  getCancelRequestApprovedCnRequestUrl,
  getCancelRequstUrl,
  getCreditNoteSearchUrl,
  getCreditNotesUrl,
  getDownloadGHSUrl,
  getLoadSentRequestsUrl,
  getRequestUrl,
  getSearchTransferedCNUrl,
  getSentRequestUrl,
  getTransferedCNsurl,
  getTransfetToEghsUrl
} from '@poss-web/shared/util-api-service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CreditNoteService {
  constructor(private apiService: ApiService) {}
  searchCreditNotes(searchPayload: CreditNoteSearch) {
    const url = getCreditNoteSearchUrl(
      searchPayload.cnNumber,
      searchPayload.fiscalYear,
      searchPayload.mobileNumber,
      searchPayload.startDate,
      searchPayload.endDate,
      searchPayload.pageIndex,
      searchPayload.pageSize,
      searchPayload.isUnipayCN
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => CreditNoteAdaptor.getCreditNoteSearchResult(data)));
  }
  loadCreditNote(id: string) {
    const url = getCreditNotesUrl(id);
    return this.apiService
      .get(url)
      .pipe(map(data => CreditNoteAdaptor.getCreditNoteDetails(data)));
  }
  raiseRequest(sentRequestPayload: SentRequestPayload) {
    const url = getSentRequestUrl(
      sentRequestPayload.creditNoteType,
      sentRequestPayload.id
    );
    return this.apiService
      .post(url.path, sentRequestPayload.payload, url.params)
      .pipe(map(data => data.requestNo));
  }
  searchTransferedCN(payload: { cnNumber: string; fiscalYear: string }) {
    const url = getSearchTransferedCNUrl(payload.cnNumber, payload.fiscalYear);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => CreditNoteAdaptor.getCreditNoteSearchResult(data)));
  }
  loadSentRequests(requestPayload: LoadRequestsPayload) {
    const url = getLoadSentRequestsUrl(
      requestPayload.workFlowType,
      requestPayload.pageIndex,
      requestPayload.pageSize
    );
    return this.apiService
      .post(url.path, requestPayload.payload, url.params)
      .pipe(map(data => CreditNoteAdaptor.getSentRequests(data)));
  }
  confirmRequest(confirmPayload: ConfirmRequestTypePayload) {
    const url = getSentRequestUrl(
      confirmPayload.workFlowType,
      confirmPayload.id
    );
    return this.apiService
      .put(url.path, confirmPayload.payload, url.params)
      .pipe(map(data => data.docNo));
  }
  loadRequestById(payload: { processId: string; workFlowType: string }) {
    const url = getRequestUrl(payload.processId, payload.workFlowType);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => CreditNoteAdaptor.getRequest(data)));
  }
  transferToEghs(transferPayload: TransferEghsPayload) {
    const url = getTransfetToEghsUrl(transferPayload.id);
    return this.apiService
      .put(url, transferPayload.payload)
      .pipe(map(data => CreditNoteAdaptor.transferToEGHS(data)));
  }
  loadTransferedCNs() {
    const url = getTransferedCNsurl();
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => CreditNoteAdaptor.getTransferedCNs(data)));
  }
  downloadCN(payload: { id: string; ghsDocNo: number }) {
    const url = getDownloadGHSUrl(payload.id, payload.ghsDocNo);
    return this.apiService.patch(url.path, {}, url.params);
  }
  cancelRequest(payload: {
    remarks: string;
    id: string;
    workFlowType: string;
  }) {
    const url = getCancelRequstUrl(payload.id, payload.workFlowType);
    return this.apiService.put(
      url.path,
      { remarks: payload.remarks },
      url.params
    );
  }

  calculateCnRefundAmount(id: string): Observable<CnRefundAmountDetails> {
    const url = getCalculateCnRefundAmountRequestUrl(id);
    return this.apiService
      .get(url)
      .pipe(map(data => CreditNoteAdaptor.getCnRefundAmountDetails(data)));
  }
  cancelAutoApprovedCn(payload: CancelCnRequestPayload): Observable<number> {
    const requestBody = {
      paymentDetails: payload.paymentDetails,
      remarks: payload.remarks
    };
    const url = getCancelAutoApprovedCnRequestUrl(payload.id);
    return this.apiService.put(url, requestBody).pipe(map(data => data.docNo));
  }
  cancelRequestApprovedCn(payload: CancelCnRequestPayload): Observable<number> {
    const requestBody = {
      paymentDetails: payload.paymentDetails,
      remarks: payload.remarks
    };
    const url = getCancelRequestApprovedCnRequestUrl(
      payload.id,
      payload.creditNoteWorkFlowType
    );
    return this.apiService
      .put(url.path, requestBody, url.params)
      .pipe(map(data => data.docNo));
  }
}
