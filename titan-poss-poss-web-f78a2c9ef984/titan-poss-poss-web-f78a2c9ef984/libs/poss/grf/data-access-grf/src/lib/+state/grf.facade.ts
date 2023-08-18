import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as CtGrfActions from './grf.actions';
import { CtGrfSelectors } from './grf.selectors';
import { CtGrfState } from './grf.state';
import {
  UpdateGrfRequestPayload,
  PartialUpdateGrfRequestPayload,
  InitiateGrfResponse,
  UpdateGrfTransactionResponse,
  CustomErrors,
  MergeCNPayload,
  AdvanceHistoryItemsRequestPayload,
  HistorySearchParamDetails,
  RsoNameObject,
  FileUploadDownloadPayload
} from '@poss-web/shared/models';
import { Observable } from 'rxjs';

@Injectable()
export class CtGrfFacade {
  constructor(private store: Store<CtGrfState>) {}

  private error$ = this.store.select(CtGrfSelectors.selectError);

  private isLoading$ = this.store.select(CtGrfSelectors.selectIsLoading);

  private selectedRsoName$ = this.store.select(
    CtGrfSelectors.selectSelectedRsoName
  );

  private initiateGrfResponse$ = this.store.select(
    CtGrfSelectors.selectInitiateGrfResponse
  );

  private updateGrfResponse$ = this.store.select(
    CtGrfSelectors.selectUpdateGrfResponse
  );

  private partiallyUpdateGrfResponse$ = this.store.select(
    CtGrfSelectors.selectPartiallyUpdateGrfResponse
  );

  private goldWeight$ = this.store.select(CtGrfSelectors.selectGoldWeight);

  private remarks$ = this.store.select(CtGrfSelectors.selectRemarks);

  private rsoDetails$ = this.store.select(CtGrfSelectors.selectRsoDetails);

  private viewGrfResponse$ = this.store.select(
    CtGrfSelectors.selectViewGrfResponse
  );

  private frozenCNs$ = this.store.select(CtGrfSelectors.selectFrozenCNs);
  private grfCN$ = this.store.select(CtGrfSelectors.selectGRFCN);

  private mergeCNsResponse$ = this.store.select(
    CtGrfSelectors.selectMergeCNsResponse
  );
  private hasValidateOTP$ = this.store.select(
    CtGrfSelectors.selectHasOtpValidated
  );
  private anotherCustomerGRFCN$ = this.store.select(
    CtGrfSelectors.selectAnotherCustomerCN
  );

  private grfHistoryItems$ = this.store.select(
    CtGrfSelectors.selectGrfHistoryResponse
  );

  private historySearchParamDetails$ = this.store.select(
    CtGrfSelectors.selectHistorySearchParamDetails
  );

  private orderNumber$ = this.store.select(CtGrfSelectors.selectOrderNumber);

  private cnValidationDetails$ = this.store.select(
    CtGrfSelectors.selectCNValidationDetails
  );

  private fileUploadList$ = this.store.select(
    CtGrfSelectors.selectFileUploadListRes
  );

  private fileUpload$ = this.store.select(CtGrfSelectors.selectFileUploadRes);

  private fileDownload$ = this.store.select(
    CtGrfSelectors.selectFileDownloadUrl
  );

  setTotalAmount(totalAmount: number) {
    this.store.dispatch(new CtGrfActions.SetTotalAmount(totalAmount));
  }

  initiateGrf(subTransactionType: string, requestBody: any) {
    this.store.dispatch(
      new CtGrfActions.InitiateGrf(subTransactionType, requestBody)
    );
  }

  updateGrf(
    subTransactionType: string,
    id: string,
    requestPayload: UpdateGrfRequestPayload
  ) {
    this.store.dispatch(
      new CtGrfActions.UpdateGrf(subTransactionType, id, requestPayload)
    );
  }

  partiallyUpdateGrf(
    subTransactionType: string,
    id: string,
    requestPayload: PartialUpdateGrfRequestPayload
  ) {
    this.store.dispatch(
      new CtGrfActions.PartiallyUpdateGrf(
        subTransactionType,
        id,
        requestPayload
      )
    );
  }

  getViewGrfDetails(subTransactionType: string, id: string) {
    this.store.dispatch(new CtGrfActions.ViewGrf(subTransactionType, id));
  }

  loadAdvanceHistory(
    subTransactionType: string,
    requestPayload: AdvanceHistoryItemsRequestPayload,
    searchField?: string,
    searchType?: string,
    status?: string,
    page?: number,
    size?: number
  ) {
    this.store.dispatch(
      new CtGrfActions.LoadGrfHistory(
        subTransactionType,
        requestPayload,
        searchField,
        searchType,
        status,
        page,
        size
      )
    );
  }

  clearGrfHistoryItems() {
    this.store.dispatch(new CtGrfActions.LoadGrfHistorySuccess(null));
  }

  setSelectedRsoName(selectedRsoName: { value: string; description: string }) {
    this.store.dispatch(new CtGrfActions.SetSelectedRsoName(selectedRsoName));
  }

  setGoldWeight(goldWeight: number) {
    this.store.dispatch(new CtGrfActions.SetGoldWeight(goldWeight));
  }

  loadRsoDetails(roleCode: string) {
    this.store.dispatch(new CtGrfActions.LoadRsoDetails(roleCode));
  }

  loadFileUpload(payload: FileUploadDownloadPayload) {
    this.store.dispatch(new CtGrfActions.FileUpload(payload));
  }

  loadFileUploadList(payload: FileUploadDownloadPayload) {
    this.store.dispatch(new CtGrfActions.FileUploadList(payload));
  }

  loadFileDownloadUrl(payload: { id: string; locationCode: string }) {
    this.store.dispatch(new CtGrfActions.FileDownloadUrl(payload));
  }

  setRemarks(remarks: string) {
    this.store.dispatch(new CtGrfActions.SetRemarks(remarks));
  }

  setHistorySearchParamDetails(payload: HistorySearchParamDetails) {
    this.store.dispatch(
      new CtGrfActions.SetHistoryGrfSearchParamDetails(payload)
    );
  }

  clearHistorySearchParamDetails() {
    this.store.dispatch(new CtGrfActions.SetHistoryGrfSearchParamDetails(null));
  }

  setOrderNumber(value: number, status: string) {
    this.store.dispatch(new CtGrfActions.SetOrderNumber(value, status));
  }

  resetGrf() {
    this.store.dispatch(new CtGrfActions.ResetGrf());
  }
  //merging cn's
  loadFrozenCNs(customerId: string) {
    this.store.dispatch(new CtGrfActions.LoadFrozenCNs(customerId));
  }

  searchGRF(grfPayload: { docNo: string; fiscalYear: string }) {
    this.store.dispatch(new CtGrfActions.SearchGRF(grfPayload));
  }

  mergeCNs(mergeCNsPayload: MergeCNPayload) {
    this.store.dispatch(new CtGrfActions.MergeCNs(mergeCNsPayload));
  }
  generateOTP(id: string) {
    this.store.dispatch(new CtGrfActions.GenerateOTP(id));
  }
  validateOTP(validateOTP: { token: string; id: string }) {
    this.store.dispatch(new CtGrfActions.ValidateOTP(validateOTP));
  }
  removeGRFCN(id: string) {
    this.store.dispatch(new CtGrfActions.RemoveGRFCN(id));
  }
  removeAllGEFCNs() {
    this.store.dispatch(new CtGrfActions.RemoveALLGRFCNs());
  }
  loadCNValidationDetails(payload: { ruleType: string; requestBody: any }) {
    this.store.dispatch(new CtGrfActions.LoadCNValidation(payload));
  }

  getSelectedRsoName(): Observable<{ value: string; description: string }> {
    return this.selectedRsoName$;
  }

  getInitiateGrfResponse(): Observable<InitiateGrfResponse> {
    return this.initiateGrfResponse$;
  }

  getUpdateGrfResponse(): Observable<UpdateGrfTransactionResponse> {
    return this.updateGrfResponse$;
  }

  getPartiallyUpdateGrfResponse(): Observable<any> {
    return this.partiallyUpdateGrfResponse$;
  }

  getError(): Observable<CustomErrors> {
    return this.error$;
  }

  getIsLoading(): Observable<boolean> {
    return this.isLoading$;
  }

  getGoldWeight(): Observable<number> {
    return this.goldWeight$;
  }

  getRsoDetails(): Observable<RsoNameObject[]> {
    return this.rsoDetails$;
  }

  getRemarks(): Observable<string> {
    return this.remarks$;
  }

  getViewGrfResponse(): Observable<any> {
    return this.viewGrfResponse$;
  }

  getFrozenCNs() {
    return this.frozenCNs$;
  }
  getGRFCN() {
    return this.grfCN$;
  }
  getMergeCNs() {
    return this.mergeCNsResponse$;
  }
  getHasOtpValidated() {
    return this.hasValidateOTP$;
  }
  getAnotherCustomerGRFCN() {
    return this.anotherCustomerGRFCN$;
  }

  getGrfHistoryItems() {
    return this.grfHistoryItems$;
  }

  getHistorySearchParamDetails(): Observable<HistorySearchParamDetails> {
    return this.historySearchParamDetails$;
  }

  getOrderNumber() {
    return this.orderNumber$;
  }

  getCnValidationDetails() {
    return this.cnValidationDetails$;
  }

  getFileUploadListRes() {
    return this.fileUploadList$;
  }

  getFileDownloadUrl() {
    return this.fileDownload$;
  }

  getFileUploadRes() {
    return this.fileUpload$;
  }
}
