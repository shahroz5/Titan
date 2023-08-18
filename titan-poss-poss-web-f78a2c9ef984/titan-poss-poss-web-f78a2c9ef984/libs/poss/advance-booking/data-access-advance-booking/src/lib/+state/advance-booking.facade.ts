import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AdvanceBookingState } from './advance-booking.state';
import { advanceBookingSelectors } from './advance-booking.selectors';
import {
  ABRequestStatusDownValues,
  ABSearchValues,
  AdvanceBookingDetailsRequestPayload,
  AdvanceBookingSearchPayload,
  FileUploadDownloadPayload,
  RequestPayload,
  ValidateABMetalRatePayload,
  workflowPayload
} from '@poss-web/shared/models';
import * as AdvanceBookingActions from './advance-booking.actions';

@Injectable()
export class AdvanceBookingFacade {
  constructor(private store: Store<AdvanceBookingState>) {}

  private hasError$ = this.store.select(advanceBookingSelectors.selectHasError);

  private isLoading$ = this.store.select(
    advanceBookingSelectors.selectIsLoading
  );

  private searchValues$ = this.store.select(
    advanceBookingSelectors.selectSearchValues
  );
  private orderNumber$ = this.store.select(
    advanceBookingSelectors.selectOrderNumber
  );

  private requestCout$ = this.store.select(
    advanceBookingSelectors.selectRequestCount
  );

  private minABVAlue$ = this.store.select(
    advanceBookingSelectors.selectminABValue
  );

  private frozenABVAlue$ = this.store.select(
    advanceBookingSelectors.selectABFrozenValue
  );

  private minFrozenABAmount$ = this.store.select(
    advanceBookingSelectors.selectMinABFrozenAmount
  );

  private RSODetails$ = this.store.select(
    advanceBookingSelectors.selectRSODetails
  );

  private createCashMemoResponse$ = this.store.select(
    advanceBookingSelectors.selectCreateCashMemoResponse
  );

  private viewCashMemoResponse$ = this.store.select(
    advanceBookingSelectors.selectViewCashMemoResponse
  );

  private searchABResponse$ = this.store.select(
    advanceBookingSelectors.selectSearchABResponse
  );
  private selectedData$ = this.store.select(
    advanceBookingSelectors.selectedData
  );

  private searchABcount$ = this.store.select(
    advanceBookingSelectors.selectABCount
  );

  private freezeRateResponse$ = this.store.select(
    advanceBookingSelectors.selectFreezeAdvanceBookingResponse
  );

  private updateCashMemoResponse$ = this.store.select(
    advanceBookingSelectors.selectUpdateCashMemoResponse
  );

  private setABStatus$ = this.store.select(
    advanceBookingSelectors.selectABStatus
  );

  private deleteCashMemoResponse$ = this.store.select(
    advanceBookingSelectors.selectDeleteCashMemoResponse
  );

  private selectRequests$ = this.store.select(
    advanceBookingSelectors.selectRequests
  );

  private partialUpdateCashMemoResponse$ = this.store.select(
    advanceBookingSelectors.selectPartailUpdateCashMemoResponse
  );

  private dropDownValue$ = this.store.select(
    advanceBookingSelectors.dropDownValues
  );

  private fileUpload$ = this.store.select(
    advanceBookingSelectors.selectFileUploadRes
  );

  private fileUploadList$ = this.store.select(
    advanceBookingSelectors.selectFileUploadListRes
  );

  private fileDownload$ = this.store.select(
    advanceBookingSelectors.selectFileDownloadUrl
  );

  private frozenBestRate$ = this.store.select(
    advanceBookingSelectors.selectBestRate
  );

  private searchABDetails$ = this.store.select(
    advanceBookingSelectors.selectSearchABDetails
  );
  
  private isMetalRateValidated$ = this.store.select(
    advanceBookingSelectors.selectIsMetalRateValidated
  );

  createCashMemo(createCashMemoPayload: AdvanceBookingDetailsRequestPayload) {
    this.store.dispatch(
      new AdvanceBookingActions.CreateCashMemo(createCashMemoPayload)
    );
  }

  viewCashMemo(viewCashMemoPayload: AdvanceBookingDetailsRequestPayload) {
    this.store.dispatch(
      new AdvanceBookingActions.ViewCashMemo(viewCashMemoPayload)
    );
  }

  loadSelectedData(data) {
    this.store.dispatch(new AdvanceBookingActions.LoadSelectedData(data));
  }

  partialUpdateCashMemo(
    partialUpdateCashMemoPayload: AdvanceBookingDetailsRequestPayload
  ) {
    this.store.dispatch(
      new AdvanceBookingActions.PartialUpdateCashMemo(
        partialUpdateCashMemoPayload
      )
    );
  }

  setDropDownValue(payload: ABRequestStatusDownValues) {
    this.store.dispatch(new AdvanceBookingActions.SetDropownValues(payload));
  }

  setSearchValue(payload: ABSearchValues) {
    this.store.dispatch(new AdvanceBookingActions.SetSearchValues(payload));
  }

  ResetSearchValue() {
    this.store.dispatch(new AdvanceBookingActions.ResetSearchValues());
  }
  clearSearchList() {
    this.store.dispatch(new AdvanceBookingActions.ClearSearchList());
  }

  getSelectedData() {
    return this.selectedData$;
  }

  getABStatus() {
    return this.setABStatus$;
  }

  getSearchValues() {
    return this.searchValues$;
  }
  getDropdownValue() {
    return this.dropDownValue$;
  }
  getSelectedRequests() {
    return this.selectRequests$;
  }

  freezeAdvanceBooking(
    partialUpdateCashMemoPayload: AdvanceBookingDetailsRequestPayload
  ) {
    this.store.dispatch(
      new AdvanceBookingActions.FreezeAdvanceBooking(
        partialUpdateCashMemoPayload
      )
    );
  }

  updateCashMemo(updateCashMemoPayload: AdvanceBookingDetailsRequestPayload) {
    this.store.dispatch(
      new AdvanceBookingActions.UpdateCashMemo(updateCashMemoPayload)
    );
  }

  deleteCashMemo(deleteCashMemoPayload: AdvanceBookingDetailsRequestPayload) {
    this.store.dispatch(
      new AdvanceBookingActions.DeleteCashMemo(deleteCashMemoPayload)
    );
  }

  updatePriceDetails(
    updateCashMemoPayload: AdvanceBookingDetailsRequestPayload,
    action?: string
  ) {
    this.store.dispatch(
      new AdvanceBookingActions.UpdatePriceDetails(
        updateCashMemoPayload,
        action
      )
    );
  }

  loadLotNumber(lotNumber: string) {
    this.store.dispatch(
      new AdvanceBookingActions.LoadSelectedLotNumberDetails(lotNumber)
    );
  }
  searchAB(searchValue: AdvanceBookingSearchPayload) {
    this.store.dispatch(new AdvanceBookingActions.SearchAB(searchValue));
  }
  setOrderNumber(value: number, status: string) {
    this.store.dispatch(
      new AdvanceBookingActions.SetOrderNumber(value, status)
    );
  }
  resetValues() {
    this.store.dispatch(new AdvanceBookingActions.ResetValues());
  }

  loadRequests(data: RequestPayload) {
    this.store.dispatch(new AdvanceBookingActions.LoadRequests(data));
  }

  resetLotNumberValues() {
    this.store.dispatch(new AdvanceBookingActions.ResetLotNumberValues());
  }

  resetProductValues() {
    this.store.dispatch(new AdvanceBookingActions.ResetProductValues());
  }

  loadworkflowProcessDetails(data: workflowPayload) {
    this.store.dispatch(new AdvanceBookingActions.LoadWorkflowDeatils(data));
  }

  loadFileUpload(payload: FileUploadDownloadPayload) {
    this.store.dispatch(new AdvanceBookingActions.FileUpload(payload));
  }

  loadFileUploadList(payload: FileUploadDownloadPayload) {
    this.store.dispatch(new AdvanceBookingActions.FileUploadList(payload));
  }

  loadFileDownloadUrl(payload: { id: string; locationCode: string }) {
    this.store.dispatch(new AdvanceBookingActions.FileDownloadUrl(payload));
  }

  ValidateMetalRate(payload: ValidateABMetalRatePayload) {
    this.store.dispatch(new AdvanceBookingActions.ValidateMetalRate(payload));
  }

  resetSearchABDetails() {
    this.store.dispatch(new AdvanceBookingActions.ResetSearchABDetails());
  }

  getHasError() {
    return this.hasError$;
  }

  getIsLoading() {
    return this.isLoading$;
  }
  getPartailUpdateCashMemoResponse() {
    return this.partialUpdateCashMemoResponse$;
  }

  getRSODetails() {
    return this.RSODetails$;
  }

  getMinABValue() {
    return this.minABVAlue$;
  }

  getFrozenABValue() {
    return this.frozenABVAlue$;
  }

  getMinFrozenABAmount() {
    return this.minFrozenABAmount$;
  }
  getRequestCount() {
    return this.requestCout$;
  }

  getSearchABCount() {
    return this.searchABcount$;
  }

  getCreateCashMemoResponse() {
    return this.createCashMemoResponse$;
  }

  getViewCashMemoResponse() {
    return this.viewCashMemoResponse$;
  }

  getOrderNumber() {
    return this.orderNumber$;
  }

  getSearchABResponse() {
    return this.searchABResponse$;
  }
  getFreezeRateResponse() {
    return this.freezeRateResponse$;
  }

  getUpdateCashMemoResponse() {
    return this.updateCashMemoResponse$;
  }

  getDeleteCashMemoResponse() {
    return this.deleteCashMemoResponse$;
  }

  getFileUploadRes() {
    return this.fileUpload$;
  }

  getFileUploadListRes() {
    return this.fileUploadList$;
  }

  getFileDownloadUrl() {
    return this.fileDownload$;
  }

  getBestGoldRate() {
    return this.frozenBestRate$;
  }

  getSearchABDetails() {
    return this.searchABDetails$;
  }

  getIsMetalRateValidated() {
    return this.isMetalRateValidated$;
  }
}
