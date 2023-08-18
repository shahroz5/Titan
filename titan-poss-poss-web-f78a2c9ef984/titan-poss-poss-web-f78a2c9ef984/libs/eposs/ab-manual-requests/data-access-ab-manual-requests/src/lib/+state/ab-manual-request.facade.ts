import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  CashMemoDetailsRequestPayload,
  CashMemoItemDetailsRequestPayload,
  AbManualApprovalRequestPayload,
  AbManualRequestDetailsPayload,
  AbManualRequestListPayload,
  HistoryFiltersData,
  FileUploadDownloadPayload
} from '@poss-web/shared/models';

import { AbManualRequestSelectors } from './ab-manual-request.selectors';
import { AbManualRequestState } from './ab-manual-request.state';
import * as AbManualRequestActions from './ab-manual-request.actions';

@Injectable()
export class AbManualRequestFacade {
  constructor(private store: Store<AbManualRequestState>) {}

  private hasError$ = this.store.select(
    AbManualRequestSelectors.selectHasError
  );

  private isLoading$ = this.store.select(
    AbManualRequestSelectors.selectIsLoading
  );
  private historyFilterData$ = this.store.select(
    AbManualRequestSelectors.selectHistoryFilterData
  );
  private abManualRequestList$ = this.store.select(
    AbManualRequestSelectors.selectAbManualRequestList
  );

  private abManualRequestDetails$ = this.store.select(
    AbManualRequestSelectors.selectAbManualRequestDetails
  );

  private abManualProductList$ = this.store.select(
    AbManualRequestSelectors.selectAbManualProductList
  );

  private abManualProductDetails$ = this.store.select(
    AbManualRequestSelectors.selectAbManualProductDetails
  );

  private abManualCustomerDetails$ = this.store.select(
    AbManualRequestSelectors.selectAbManualCustomerDetails
  );

  private abManualHeaderDetails$ = this.store.select(
    AbManualRequestSelectors.selectAbManualHeaderDetails
  );

  private abManualApprovalRequest$ = this.store.select(
    AbManualRequestSelectors.selectAbManualApprovalRequest
  );

  private updateCashMemoResponse$ = this.store.select(
    AbManualRequestSelectors.selectUpdateCashMemoResponse
  );

  private fileUploadList$ = this.store.select(
    AbManualRequestSelectors.selectFileUploadListRes
  );

  private fileDownload$ = this.store.select(
    AbManualRequestSelectors.selectFileDownloadUrl
  );
  loadAbManualRequestList(
    abManualRequestListPayload: AbManualRequestListPayload
  ) {
    this.store.dispatch(
      new AbManualRequestActions.LoadAbManualRequestList(
        abManualRequestListPayload
      )
    );
  }

  loadAbManualRequestDetails(
    abManualRequestDetailsPayload: AbManualRequestDetailsPayload
  ) {
    this.store.dispatch(
      new AbManualRequestActions.LoadAbManualRequestDetails(
        abManualRequestDetailsPayload
      )
    );
  }

  loadAbManualProductList(
    abManualRequestListPayload: CashMemoDetailsRequestPayload
  ) {
    this.store.dispatch(
      new AbManualRequestActions.LoadAbManualProductList(
        abManualRequestListPayload
      )
    );
  }

  loadAbManualProductDetails(
    abManualRequestDetailsPayload: CashMemoItemDetailsRequestPayload
  ) {
    this.store.dispatch(
      new AbManualRequestActions.LoadAbManualProductDetails(
        abManualRequestDetailsPayload
      )
    );
  }

  loadProductDetails(abManualRequestDetailsPayload: any) {
    this.store.dispatch(
      new AbManualRequestActions.LoadProductDetails(
        abManualRequestDetailsPayload
      )
    );
  }

  loadAbManualApprovalRequest(
    abManualApprovalRequestPayload: AbManualApprovalRequestPayload
  ) {
    this.store.dispatch(
      new AbManualRequestActions.AbManualApprovalRequest(
        abManualApprovalRequestPayload
      )
    );
  }

  updateCashMemo(updateCashMemoPayload: CashMemoDetailsRequestPayload) {
    this.store.dispatch(
      new AbManualRequestActions.ConfirmManualAbManual(updateCashMemoPayload)
    );
  }

  clearAbManualRequestList() {
    this.store.dispatch(new AbManualRequestActions.ClearAbManualRequestList());
  }

  clearAbManualRequestDetails() {
    this.store.dispatch(
      new AbManualRequestActions.ClearAbManualRequestDetails()
    );
  }
  loadHistoryFilterData(date: HistoryFiltersData) {
    this.store.dispatch(new AbManualRequestActions.LoadHistoryFilterData(date));
  }
  resetFilter() {
    this.store.dispatch(new AbManualRequestActions.RESETFILTER());
  }

  loadFileUploadList(payload: FileUploadDownloadPayload) {
    this.store.dispatch(new AbManualRequestActions.FileUploadList(payload));
  }

  loadFileDownloadUrl(payload: { id: string; locationCode: string }) {
    this.store.dispatch(new AbManualRequestActions.FileDownloadUrl(payload));
  }

  getHasError() {
    return this.hasError$;
  }

  getIsLoading() {
    return this.isLoading$;
  }

  getAbManualRequestList() {
    return this.abManualRequestList$;
  }

  getAbManualRequestDetails() {
    return this.abManualRequestDetails$;
  }

  getAbManualProductList() {
    return this.abManualProductList$;
  }
  getHistoryFilterData() {
    return this.historyFilterData$;
  }

  getAbManualProductDetails() {
    return this.abManualProductDetails$;
  }

  getAbManualCustomerDetails() {
    return this.abManualCustomerDetails$;
  }

  getAbManualHeaderDetails() {
    return this.abManualHeaderDetails$;
  }

  getAbManualApprovalRequest() {
    return this.abManualApprovalRequest$;
  }

  getUpdateCashMemoResponse() {
    return this.updateCashMemoResponse$;
  }

  getFileUploadListRes() {
    return this.fileUploadList$;
  }

  getFileDownloadUrl() {
    return this.fileDownload$;
  }
}
