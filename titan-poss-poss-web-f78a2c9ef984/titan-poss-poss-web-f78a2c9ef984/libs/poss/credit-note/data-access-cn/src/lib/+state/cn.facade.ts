import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CreditNoteSelectors } from './cn.selector';
import { CreditNoteState } from './cn.state';
import * as CreditNoteActions from './cn.actions';
import {
  CancelCnRequestPayload,
  ConfirmRequestTypePayload,
  CreditNoteSearch,
  LoadRequestsPayload,
  SentRequestPayload,
  TransferEghsPayload
} from '@poss-web/shared/models';

@Injectable()
export class CreditNoteFacade {
  constructor(private store: Store<CreditNoteState>) {}
  private error$ = this.store.select(CreditNoteSelectors.selectError);
  private isLoading$ = this.store.select(CreditNoteSelectors.selectIsLoading);
  private creditNoteSearchResult$ = this.store.select(
    CreditNoteSelectors.selectCreditNoteSearchResult
  );
  private creditNoteDetails$ = this.store.select(
    CreditNoteSelectors.selectCreditNoteDetails
  );
  private requestId$ = this.store.select(CreditNoteSelectors.selectRequestId);
  private search$ = this.store.select(CreditNoteSelectors.selectSearch);
  private totalCount$ = this.store.select(CreditNoteSelectors.selectTotalCount);
  private sentRequests$ = this.store.select(
    CreditNoteSelectors.selectSentRequests
  );
  private searchRequests$ = this.store.select(
    CreditNoteSelectors.selectSearchRequests
  );
  private hasSearched$ = this.store.select(
    CreditNoteSelectors.selectHasSearched
  );
  private request$ = this.store.select(CreditNoteSelectors.selectRequest);
  private cnNumber$ = this.store.select(CreditNoteSelectors.selectCNNumber);

  private requestType$ = this.store.select(
    CreditNoteSelectors.selectRequestType
  );
  private selectEGHSDetails$ = this.store.select(
    CreditNoteSelectors.selecttransferToEghsDetails
  );

  private trnasferedCNs$ = this.store.select(
    CreditNoteSelectors.selectTransfteredCNs
  );
  private downloadCN$ = this.store.select(CreditNoteSelectors.selectDownloadCN);
  private transferedCNsCount$ = this.store.select(
    CreditNoteSelectors.selectCNsCount
  );

  private hasCancelled$ = this.store.select(
    CreditNoteSelectors.selectHasCancelled
  );
  private totalElements$ = this.store.select(
    CreditNoteSelectors.selectTotalElements
  );
  private searchResult$ = this.store.select(
    CreditNoteSelectors.selectSearchResult
  );
  private cnRefundAmountDetails$ = this.store.select(
    CreditNoteSelectors.selectCnRefundAmountDetails
  );

  getError() {
    return this.error$;
  }
  getIsLoading() {
    return this.isLoading$;
  }
  getCreditNoteSearchResult() {
    return this.creditNoteSearchResult$;
  }
  getCreditNoteDetails() {
    return this.creditNoteDetails$;
  }
  getRequestId() {
    return this.requestId$;
  }
  getSearch() {
    return this.search$;
  }
  getTotalCount() {
    return this.totalCount$;
  }
  getSentRequests() {
    return this.sentRequests$;
  }
  getSearchRequests() {
    return this.searchRequests$;
  }
  getHasSearched() {
    return this.hasSearched$;
  }
  getRequest() {
    return this.request$;
  }
  getcnNumber() {
    return this.cnNumber$;
  }

  getRequestType() {
    return this.requestType$;
  }
  getEGHSDetails() {
    return this.selectEGHSDetails$;
  }
  getTransfteredCNs() {
    return this.trnasferedCNs$;
  }
  getDownloadCN() {
    return this.downloadCN$;
  }
  getTransferedCNsCount() {
    return this.transferedCNsCount$;
  }
  getHasCancelled() {
    return this.hasCancelled$;
  }
  getTotalElements() {
    return this.totalElements$;
  }
  getTransferedCN() {
    return this.searchResult$;
  }
  getCnRefundAmountDetails() {
    return this.cnRefundAmountDetails$;
  }
  loadSearchResult(searchPayload: CreditNoteSearch) {
    this.store.dispatch(new CreditNoteActions.SearchCreditNotes(searchPayload));
  }
  searchTransferedCN(payload: { cnNumber: string; fiscalYear: string }) {
    this.store.dispatch(new CreditNoteActions.SearchTrasnferedCN(payload));
  }

  loadCreditNoteDetails(id: string) {
    this.store.dispatch(new CreditNoteActions.CreditNoteDetailsById(id));
  }

  raiseRequest(payload: SentRequestPayload) {
    this.store.dispatch(new CreditNoteActions.RaiseRequest(payload));
  }
  resetListPage() {
    this.store.dispatch(new CreditNoteActions.ResetListPage());
  }
  clearSearchList() {
    this.store.dispatch(new CreditNoteActions.ClearSearchList());
  }
  storeSearch(searchPayload: CreditNoteSearch) {
    this.store.dispatch(new CreditNoteActions.StoreSearch(searchPayload));
  }
  loadSentRequest(payload: LoadRequestsPayload) {
    this.store.dispatch(new CreditNoteActions.LoadSentRequests(payload));
  }
  resetDetailPage() {
    this.store.dispatch(new CreditNoteActions.ResetDetailPage());
  }
  resetRequests() {
    this.store.dispatch(new CreditNoteActions.ResetRequests());
  }
  searchRequest(payload: LoadRequestsPayload) {
    this.store.dispatch(new CreditNoteActions.SearchRequst(payload));
  }
  confirmRequest(payload: ConfirmRequestTypePayload) {
    this.store.dispatch(new CreditNoteActions.ConfirmRequestType(payload));
  }
  loadRequestById(payload: { processId: string; workFlowType: string }) {
    this.store.dispatch(new CreditNoteActions.LoadRequestById(payload));
  }
  storeRequestType(requestType: string) {
    this.store.dispatch(new CreditNoteActions.StoreRequestType(requestType));
  }
  transfterToEghs(payload: TransferEghsPayload) {
    this.store.dispatch(new CreditNoteActions.TransfetToEghs(payload));
  }
  loadTransferedCNs() {
    this.store.dispatch(new CreditNoteActions.LoadTransferedCNS());
  }
  downloadCN(payload: { id: string; ghsDocNo: number }) {
    this.store.dispatch(new CreditNoteActions.DownloadCN(payload));
  }
  resetSearch() {
    this.store.dispatch(new CreditNoteActions.ResetSearch());
  }
  cancelRequest(payload: {
    remarks: string;
    id: string;
    workFlowType: string;
  }) {
    this.store.dispatch(new CreditNoteActions.CancelRequest(payload));
  }
  resetError() {
    this.store.dispatch(new CreditNoteActions.ResetError());
  }
  loadCnRefundAmountDetails(id: string) {
    this.store.dispatch(new CreditNoteActions.CalculateCnRefundAmount(id));
  }
  cancelAutoApprovedCn(payload: CancelCnRequestPayload) {
    this.store.dispatch(new CreditNoteActions.CancelAutoApprovedCn(payload));
  }
  cancelRequestApprovedCn(payload: CancelCnRequestPayload) {
    this.store.dispatch(new CreditNoteActions.CancelRequestApprovedCn(payload));
  }
}
