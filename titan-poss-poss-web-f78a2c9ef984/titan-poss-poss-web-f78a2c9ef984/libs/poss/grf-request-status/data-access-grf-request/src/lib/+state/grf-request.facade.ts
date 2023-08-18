import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  CashMemoDetailsRequestPayload,
  CashMemoItemDetailsRequestPayload,
  CmApprovalRequestPayload,
  CmRequestDetailsPayload,
  FileUploadDownloadPayload,
  grfRequestListPayload,
  StatusTypesEnum
} from '@poss-web/shared/models';

import { cmRequestSelectors } from './grf-request.selectors';
import { CmRequestState } from './grf-request.state';
import * as GrfRequestActions from './grf-request.actions';

@Injectable()
export class grfRequestFacade {
  constructor(private store: Store<CmRequestState>) {}

  private hasError$ = this.store.select(cmRequestSelectors.selectHasError);

  private isLoading$ = this.store.select(cmRequestSelectors.selectIsLoading);

  private cmRequestList$ = this.store.select(
    cmRequestSelectors.selectGrfRequestList
  );

  private cmRequestDetails$ = this.store.select(
    cmRequestSelectors.selectGrfRequestDetails
  );

  private cmProductList$ = this.store.select(
    cmRequestSelectors.selectGrfProductList
  );

  private cmProductDetails$ = this.store.select(
    cmRequestSelectors.selectGrfProductDetails
  );

  private cmCustomerDetails$ = this.store.select(
    cmRequestSelectors.selectGrfCustomerDetails
  );

  private cmHeaderDetails$ = this.store.select(
    cmRequestSelectors.selectGrfHeaderDetails
  );

  private cmApprovalRequest$ = this.store.select(
    cmRequestSelectors.selectGrfApprovalRequest
  );

  private updateCashMemoResponse$ = this.store.select(
    cmRequestSelectors.selectUpdateCashMemoResponse
  );

  private fileUploadList$ = this.store.select(
    cmRequestSelectors.selectFileUploadListRes
  );

  private fileDownload$ = this.store.select(
    cmRequestSelectors.selectFileDownloadUrl
  );

  private dropDownValue$ = this.store.select(
    cmRequestSelectors.dropDownValues
  );

  loadGrfRequestList(grfRequestListPayload: grfRequestListPayload) {
    this.store.dispatch(
      new GrfRequestActions.LoadGrfRequestList(grfRequestListPayload)
    );
  }

  loadGrfRequestDetails(cmRequestDetailsPayload: CmRequestDetailsPayload) {
    this.store.dispatch(
      new GrfRequestActions.LoadGrfRequestDetails(cmRequestDetailsPayload)
    );
  }

  setDropDownValue(payload: StatusTypesEnum) {
    this.store.dispatch(new GrfRequestActions.SetDropownValues(payload));
  }

  loadGrfProductList(cmRequestListPayload: CashMemoDetailsRequestPayload) {
    this.store.dispatch(
      new GrfRequestActions.LoadGrfProductList(cmRequestListPayload)
    );
  }

  loadGrfProductDetails(
    cmRequestDetailsPayload: CashMemoItemDetailsRequestPayload
  ) {
    this.store.dispatch(
      new GrfRequestActions.LoadGrfProductDetails(cmRequestDetailsPayload)
    );
  }

  loadGrfApprovalRequest(cmApprovalRequestPayload: CmApprovalRequestPayload) {
    this.store.dispatch(
      new GrfRequestActions.GrfApprovalRequest(cmApprovalRequestPayload)
    );
  }

  updateCashMemo(updateCashMemoPayload: CashMemoDetailsRequestPayload) {
    this.store.dispatch(
      new GrfRequestActions.ConfirmManualGRF(updateCashMemoPayload)
    );
  }

  loadFileUploadList(payload: FileUploadDownloadPayload) {
    this.store.dispatch(new GrfRequestActions.FileUploadList(payload));
  }

  loadFileDownloadUrl(payload: { id: string; locationCode: string }) {
    this.store.dispatch(new GrfRequestActions.FileDownloadUrl(payload));
  }

  clearGrfRequestList() {
    this.store.dispatch(new GrfRequestActions.ClearGrfRequestList());
  }

  clearGrfRequestDetails() {
    this.store.dispatch(new GrfRequestActions.ClearGrfRequestDetails());
  }

  getHasError() {
    return this.hasError$;
  }

  getIsLoading() {
    return this.isLoading$;
  }

  getGrfRequestList() {
    return this.cmRequestList$;
  }

  getGrfRequestDetails() {
    return this.cmRequestDetails$;
  }

  getGrfProductList() {
    return this.cmProductList$;
  }

  getGrfProductDetails() {
    return this.cmProductDetails$;
  }

  getGrfCustomerDetails() {
    return this.cmCustomerDetails$;
  }

  getGrfHeaderDetails() {
    return this.cmHeaderDetails$;
  }

  getGrfApprovalRequest() {
    return this.cmApprovalRequest$;
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

  getDropDownValue() {
    return this.dropDownValue$;
  }
}
