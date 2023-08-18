import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  CashMemoDetailsRequestPayload,
  CashMemoItemDetailsRequestPayload,
  CmApprovalRequestPayload,
  CmRequestDetailsPayload,
  CmRequestListPayload,
  FileUploadDownloadPayload,
  StatusTypesEnum
} from '@poss-web/shared/models';

import { cmRequestSelectors } from './cm-request.selectors';
import { CmRequestState } from './cm-request.state';
import * as CmRequestActions from './cm-request.actions';

@Injectable()
export class CmRequestFacade {
  constructor(private store: Store<CmRequestState>) {}

  private hasError$ = this.store.select(cmRequestSelectors.selectHasError);

  private isLoading$ = this.store.select(cmRequestSelectors.selectIsLoading);

  private cmRequestList$ = this.store.select(
    cmRequestSelectors.selectCmRequestList
  );

  private cmRequestDetails$ = this.store.select(
    cmRequestSelectors.selectCmRequestDetails
  );

  private cmProductList$ = this.store.select(
    cmRequestSelectors.selectCmProductList
  );

  private cmProductDetails$ = this.store.select(
    cmRequestSelectors.selectCmProductDetails
  );

  private cmCustomerDetails$ = this.store.select(
    cmRequestSelectors.selectCmCustomerDetails
  );

  private cmHeaderDetails$ = this.store.select(
    cmRequestSelectors.selectCmHeaderDetails
  );

  private cmApprovalRequest$ = this.store.select(
    cmRequestSelectors.selectCmApprovalRequest
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

  loadCmRequestList(cmRequestListPayload: CmRequestListPayload) {
    this.store.dispatch(
      new CmRequestActions.LoadCmRequestList(cmRequestListPayload)
    );
  }

  loadCmRequestDetails(cmRequestDetailsPayload: CmRequestDetailsPayload) {
    this.store.dispatch(
      new CmRequestActions.LoadCmRequestDetails(cmRequestDetailsPayload)
    );
  }

  loadCmProductList(cmRequestListPayload: CashMemoDetailsRequestPayload) {
    this.store.dispatch(
      new CmRequestActions.LoadCmProductList(cmRequestListPayload)
    );
  }

  loadCmProductDetails(
    cmRequestDetailsPayload: CashMemoItemDetailsRequestPayload
  ) {
    this.store.dispatch(
      new CmRequestActions.LoadCmProductDetails(cmRequestDetailsPayload)
    );
  }

  loadCmApprovalRequest(cmApprovalRequestPayload: CmApprovalRequestPayload) {
    this.store.dispatch(
      new CmRequestActions.CmApprovalRequest(cmApprovalRequestPayload)
    );
  }

  updateCashMemo(updateCashMemoPayload: CashMemoDetailsRequestPayload) {
    this.store.dispatch(
      new CmRequestActions.ConfirmManualCM(updateCashMemoPayload)
    );
  }

  loadFileUploadList(payload: FileUploadDownloadPayload) {
    this.store.dispatch(new CmRequestActions.FileUploadList(payload));
  }

  loadFileDownloadUrl(payload: { id: string; locationCode: string }) {
    this.store.dispatch(new CmRequestActions.FileDownloadUrl(payload));
  }

  clearCmRequestList() {
    this.store.dispatch(new CmRequestActions.ClearCmRequestList());
  }

  clearCmRequestDetails() {
    this.store.dispatch(new CmRequestActions.ClearCmRequestDetails());
  }

  clearCmRequestProductDetails() {
    this.store.dispatch(new CmRequestActions.ClearCmRequestProductDetails());
  }

  setDropDownValue(payload: StatusTypesEnum) {
    this.store.dispatch(new CmRequestActions.SetDropownValues(payload));
  }

  getHasError() {
    return this.hasError$;
  }

  getIsLoading() {
    return this.isLoading$;
  }

  getCmRequestList() {
    return this.cmRequestList$;
  }

  getCmRequestDetails() {
    return this.cmRequestDetails$;
  }

  getCmProductList() {
    return this.cmProductList$;
  }

  getCmProductDetails() {
    return this.cmProductDetails$;
  }

  getCmCustomerDetails() {
    return this.cmCustomerDetails$;
  }

  getCmHeaderDetails() {
    return this.cmHeaderDetails$;
  }

  getCmApprovalRequest() {
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

  getDropdownValue() {
    return this.dropDownValue$;
  }
}
