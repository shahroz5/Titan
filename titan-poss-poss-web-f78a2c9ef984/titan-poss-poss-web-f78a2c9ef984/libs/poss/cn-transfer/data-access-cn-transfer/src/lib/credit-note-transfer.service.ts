import { Injectable } from '@angular/core';
import { concatMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {
  ApiService,
  getCreditNoteTransferSearchUrl,
  getLoadCreditNoteSentRequestsUrl,
  getLoadCreditNoteReceivedRequestsUrl,
  getCreditNoteTransferSearchDetailsUrl,
  getCnTransferRequestUrl,
  getLoadCreditNoteSentRequestDetailsByIdUrl,
  getLoadCreditNoteReceivedRequestsDetailsByIdUrl,
  getCnTransferApprovalUrl,
  getCancelRequstUrl,
  getLegacyCNOutwardTransferUrl,
  getLegacyCNInwardTransferUrl,
  getLocationSummaryUrl
} from '@poss-web/shared/util-api-service';
import {
  CnTransferSearchPayload,
  CnTransferSearchResponsePayload,
  CNDetailsInfo,
  RequestTransferPayload,
  LoadCnTransferRequestsPayload,
  cnTransferTabEnum,
  LoadSelectedCnDetailsReqPayload,
  InwardCnPayload,
  ApproveOrRejectCnTransferPayaload,
  LegacyCNTransferPayload,
  LegacyOutwardTransferResponsePayload,
  LegacyInwardTransferResponsePayload,
  LocationSummaryList,
  CreditNoteAPITypes,
  SendRequestResponsePayload
} from '@poss-web/shared/models';
import { CreditNoteTransferAdaptor } from '@poss-web/shared/util-adaptors';

@Injectable({
  providedIn: 'root'
})
export class CreditNoteTransferService {
  constructor(private apiService: ApiService) {}
  //#region  load location codes
  getLocationCodes(
    isPageable?: boolean,
    pageIndex?: number,
    pageSize?: number,
    sort?: string[]
  ): Observable<LocationSummaryList[]> {
    const newLocationCodesUrl = getLocationSummaryUrl(
      { locationTypes: ['BTQ'], isMigartedFromLegacy: true },
      isPageable,
      pageIndex,
      pageSize,
      sort
    );
    const legacyLocationCodesUrl = getLocationSummaryUrl(
      { locationTypes: ['BTQ'], isMigartedFromLegacy: false },
      isPageable,
      pageIndex,
      pageSize,
      sort
    );
    return this.apiService
      .post(
        newLocationCodesUrl.path,
        newLocationCodesUrl.body,
        newLocationCodesUrl.params
      )
      .pipe(
        map((response: any) =>
          CreditNoteTransferAdaptor.getMigratedLocationCodesResponseData(
            response
          )
        )
      )
      .pipe(
        concatMap(response =>
          this.apiService
            .post(
              legacyLocationCodesUrl.path,
              legacyLocationCodesUrl.body,
              legacyLocationCodesUrl.params
            )
            .pipe(
              map((data: any) =>
                [
                  ...CreditNoteTransferAdaptor.getLegacyLocationCodesResponseData(
                    data
                  ),
                  ...response
                ].sort((a, b) => a.locationCode.localeCompare(b.locationCode))
              )
            )
        )
      );
  }
  //#endregion
  //#region  search credit notes
  searchCreditNotes(
    searchPayload: CnTransferSearchPayload
  ): Observable<CnTransferSearchResponsePayload> {
    const url = getCreditNoteTransferSearchUrl(
      searchPayload.srcBtqCode,
      searchPayload.docNo,
      searchPayload.fiscalYear,
      searchPayload.mobileNo,
      searchPayload.page,
      searchPayload.sort
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data =>
          CreditNoteTransferAdaptor.getCreditNotetransferSearchResult(data)
        )
      );
  }
  getCreditNotesDetailsById(
    payload: LoadSelectedCnDetailsReqPayload
  ): Observable<CNDetailsInfo> {
    let url;
    if (payload.tab === cnTransferTabEnum.SEARCH) {
      url = getCreditNoteTransferSearchDetailsUrl(
        payload.id,
        payload.srcBtqCode
      );
    } else if (payload.tab === cnTransferTabEnum.SENT_REQUESTS) {
      url = getLoadCreditNoteSentRequestDetailsByIdUrl(
        payload.id,
        payload.workflowType
      );
    } else if (payload.tab === cnTransferTabEnum.RECEIVED_REQUESTS) {
      url = getLoadCreditNoteReceivedRequestsDetailsByIdUrl(
        payload.id,
        payload.taskId,
        payload.taskName,
        payload.workflowType
      );
    }
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data =>
          CreditNoteTransferAdaptor.getCreditNoteTransferSearchDetailsData(
            data,
            payload.tab
          )
        )
      );
  }
  //#endregion
  //#region credit note transfer
  raiseTransferRequest(
    payload: RequestTransferPayload
  ): Observable<{ requestNo: string }> {
    const url = getCnTransferRequestUrl(
      payload.id,
      CreditNoteAPITypes.CREDIT_NOTE_TRANSFER
    );
    return this.apiService.post(url.path, payload.remarksDto, url.params);
  }
  legacyCNOutwardTransfer(
    payload: LegacyCNTransferPayload
  ): Observable<LegacyOutwardTransferResponsePayload> {
    const url = getLegacyCNOutwardTransferUrl(payload.id, payload.locationCode);
    return this.apiService
      .post(url.path, url.body, url.params)
      .pipe(
        map(data =>
          CreditNoteTransferAdaptor.getLegacyCNOutwardTransferResponseData(data)
        )
      );
  }
  legacyCNInwardTransfer(
    payload: LegacyCNTransferPayload
  ): Observable<LegacyInwardTransferResponsePayload> {
    const url = getLegacyCNInwardTransferUrl(payload.id, payload.locationCode);
    return this.apiService
      .post(url.path, url.body, url.params)
      .pipe(
        map(data =>
          CreditNoteTransferAdaptor.getLegacyCNInwardTransferResponseData(data)
        )
      );
  }
  inwardCn(payload: InwardCnPayload): Observable<CNDetailsInfo> {
    const url = getCnTransferApprovalUrl(payload.id, payload.workflowType);
    return this.apiService
      .put(url.path, payload.remarksDto, url.params)
      .pipe(
        map(data =>
          CreditNoteTransferAdaptor.getCreditNoteTransferSearchDetailsData(data)
        )
      );
  }
  //#endregion
  //#region  load requests
  loadRequests(
    requestPayload: LoadCnTransferRequestsPayload
  ): Observable<SendRequestResponsePayload> {
    let url;
    if (requestPayload.tab === cnTransferTabEnum.SENT_REQUESTS) {
      url = getLoadCreditNoteSentRequestsUrl(
        requestPayload.workflowType,
        requestPayload.page,
        requestPayload.size,
        requestPayload.approvalStatus
      );
    } else {
      url = getLoadCreditNoteReceivedRequestsUrl(
        requestPayload.workflowType,
        requestPayload.page,
        requestPayload.size,
        requestPayload.approvalStatus
      );
    }
    return this.apiService
      .post(url.path, requestPayload.payload, url.params)
      .pipe(map(data => CreditNoteTransferAdaptor.getRequestsDetails(data)));
  }
  //#endregion
  //#region  approve or reject or cancel requests
  approveOrRejectCnTransferRequest(
    payload: ApproveOrRejectCnTransferPayaload
  ): Observable<boolean> {
    const url = getCnTransferApprovalUrl(
      payload.id,
      payload.workflowType,
      payload.status
    );
    return this.apiService
      .post(url.path, payload.remarksDto, url.params)
      .pipe(map(data => true));
  }

  cancelCN(payload: InwardCnPayload): Observable<boolean> {
    const url = getCancelRequstUrl(payload.id, payload.workflowType);
    return this.apiService
      .put(url.path, payload.remarksDto, url.params)
      .pipe(map(data => true));
  }
  //#endregion
}
