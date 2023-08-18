import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  CnTransferSearchPayload,
  RequestTransferPayload,
  LoadCnTransferRequestsPayload,
  LoadSelectedCnDetailsReqPayload,
  InwardCnPayload,
  ApproveOrRejectCnTransferPayaload,
  LegacyCNTransferPayload,
  LegacyInwardTransferResponsePayload,
  LegacyOutwardTransferResponsePayload,
  CustomErrors,
  LocationSummaryList,
  CnTransferSearchResult,
  CNDetailsInfo
} from '@poss-web/shared/models';
import { CreditNoteTransferState } from './cn-transfer.state';
import { CreditNoteTransferSelectors } from './cn-transfer.selector';
import * as CreditNoteTransferActions from './cn-transfer.actions';
@Injectable()
export class CreditNoteTransferFacade {
  constructor(private store: Store<CreditNoteTransferState>) {}
  //#region  error details
    private error$ = this.store.select(CreditNoteTransferSelectors.selectError);
    getError(): Observable<CustomErrors> {
      return this.error$;
    }
  //#endregion
  //#region  loading indicator
    private isLoading$ = this.store.select(
      CreditNoteTransferSelectors.selectIsLoading
    );
    getIsLoading(): Observable<boolean> {
      return this.isLoading$;
    }
  //#endregion
  //#region location codes details
    private locationCodes$ = this.store.select(
      CreditNoteTransferSelectors.selectLocationCodes
    );

    getLocationCodes(): Observable<LocationSummaryList[]> {
      return this.locationCodes$;
    }
    loadLocationCodes() {
      this.store.dispatch(new CreditNoteTransferActions.GetLocationCodes());
    }
    loadLegacyLocationCodes() {
      this.store.dispatch(new CreditNoteTransferActions.GetLegacyLocationCodes());
    }
  //#endregion
  //#region credit note deatils
    private creditNoteSearchResult$ = this.store.select(
      CreditNoteTransferSelectors.selectCreditNoteSearchResult
    );
    private creditNoteSearchResultCount$ = this.store.select(
      CreditNoteTransferSelectors.selectCreditNoteSearchResultCount
    );
    private creditNoteDetails$ = this.store.select(
      CreditNoteTransferSelectors.selectCreditNoteDetails
    );

    getCreditNoteSearchResult(): Observable<CnTransferSearchResult[]> {
      return this.creditNoteSearchResult$;
    }
    getCreditNoteSearchResultCount(): Observable<number> {
      return this.creditNoteSearchResultCount$;
    }
    getSelectedCreditNoteDetails(): Observable<CNDetailsInfo> {
      return this.creditNoteDetails$;
    }
    loadSearchResulut(searchPayload: CnTransferSearchPayload) {
      this.store.dispatch(
        new CreditNoteTransferActions.SearchCreditNotes(searchPayload)
      );
    }
    loadSelectedCreditNoteDetailsById(payload: LoadSelectedCnDetailsReqPayload) {
      this.store.dispatch(
        new CreditNoteTransferActions.GetCreditNoteDetailsById(payload)
      );
    }
  //#endregion
  //#region  cn transfer request details
    private raisedTransferRequestDocNo$ = this.store.select(
      CreditNoteTransferSelectors.selectRaisedRequestNo
    );
    private raisedTransferRequests$ = this.store.select(
      CreditNoteTransferSelectors.selectRaisedRequests
    );
    private raisedTransferRequestsTotalCount$ = this.store.select(
      CreditNoteTransferSelectors.selectRaisedRequestsTotalCount
    );

    getRaisedRequestDocNo(): Observable<string> {
      return this.raisedTransferRequestDocNo$;
    }
    getRaisedTransferRequests(): Observable<CNDetailsInfo[]> {
      return this.raisedTransferRequests$;
    }
    getRaisedTransferRequestsTotalCount(): Observable<number> {
      return this.raisedTransferRequestsTotalCount$;
    }
    raiseTransferRequest(paylaod: RequestTransferPayload) {
      this.store.dispatch(
        new CreditNoteTransferActions.RaiseTransferRequest(paylaod)
      );
    }
    inwardCN(paylaod: InwardCnPayload) {
      this.store.dispatch(
        new CreditNoteTransferActions.InwardCreditNote(paylaod)
      );
    }
  //#endregion
  //#region update request details
    private hasCnUpdateRequestStatus$ = this.store.select(
      CreditNoteTransferSelectors.selectHasCnRequestUpdateStatus
    );
    private creditNoteUpdateResponse$ = this.store.select(
      CreditNoteTransferSelectors.selectCnUpdateResponse
    );

    getHasCNUpdatedStatus(): Observable<boolean> {
      return this.hasCnUpdateRequestStatus$;
    }
    getCnUpdateResponse(): Observable<CNDetailsInfo> {
      return this.creditNoteUpdateResponse$;
    }
  //#endregion
  //#region  approve/reject/cancel requests
    private isApprovedOrRejected$ = this.store.select(
      CreditNoteTransferSelectors.selectIsApporvedOrRejected
    );
    private isCNTransferRequestCancelled$ = this.store.select(
      CreditNoteTransferSelectors.selectIsCnTransferRequestCancelled
    );

    getIsApprovedOrRejectedStatus(): Observable<boolean> {
      return this.isApprovedOrRejected$;
    }
    getIsCnTransferRquestCancelled(): Observable<boolean> {
      return this.isCNTransferRequestCancelled$;
    }
    cancelRequest(paylaod: InwardCnPayload) {
      this.store.dispatch(
        new CreditNoteTransferActions.CancelCnTransferRequest(paylaod)
      );
    }
    approveOrRejectCNTransfer(payload: ApproveOrRejectCnTransferPayaload) {
      this.store.dispatch(
        new CreditNoteTransferActions.ApproveOrRejectCnTransfer(payload)
      );
    }
    loadRequests(payload: LoadCnTransferRequestsPayload) {
      this.store.dispatch(
        new CreditNoteTransferActions.LoadTransferRequests(payload)
      );
    }
  //#endregion
  //#region legacy inward/outward transfer requests
    private legacyOutwardTransferResponsePayload$ = this.store.select(
      CreditNoteTransferSelectors.selectlegacyOutwardTransferResponsePayload
    );
    private legacyInwardTransferResponsePayload$ = this.store.select(
      CreditNoteTransferSelectors.selectlegacyInwardTransferResponsePayload
    );

    getLegacyOutwardTransferResponsePayload(): Observable<LegacyOutwardTransferResponsePayload> {
      return this.legacyOutwardTransferResponsePayload$;
    }
    getLegacyInwardTransferResponsePayload(): Observable<LegacyInwardTransferResponsePayload> {
      return this.legacyInwardTransferResponsePayload$;
    }
    LegacyCNOutwardTransfer(payload: LegacyCNTransferPayload) {
      this.store.dispatch(
        new CreditNoteTransferActions.LegacyCNOutwardTransfer(payload)
      );
    }
    LegacyCNInwardTransfer(payload: LegacyCNTransferPayload) {
    this.store.dispatch(
      new CreditNoteTransferActions.LegacyCNInwardTransfer(payload)
    );
    }
  //#endregion
  //#region reset details
    resetListPage() {
      this.store.dispatch(new CreditNoteTransferActions.ResetListPage());
    }
    resetSearch() {
      this.store.dispatch(new CreditNoteTransferActions.ResetSearch());
    }
    resetCnTransfer() {
      this.store.dispatch(new CreditNoteTransferActions.ResetCnTransfer());
    }
  //#endregion
}
