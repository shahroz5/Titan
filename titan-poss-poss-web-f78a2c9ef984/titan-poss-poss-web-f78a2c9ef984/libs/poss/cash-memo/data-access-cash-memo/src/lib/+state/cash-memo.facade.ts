import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { CashMemoState } from './cash-memo.state';
import { cashMemoSelectors } from './cash-memo.selectors';
import {
  CashMemoDetailsRequestPayload,
  CashMemoHistoryRequestPayload,
  CashMemoItemDetailsRequestPayload,
  FileUploadDownloadPayload,
  MetalRatesPayload,
  ValidateMetalRatePayload
} from '@poss-web/shared/models';
import * as CashMemoActions from './cash-memo.actions';

@Injectable()
export class CashMemoFacade {
  constructor(private store: Store<CashMemoState>) {}

  private hasError$ = this.store.select(
    cashMemoSelectors.selectHasError
  );

  private isLoading$ = this.store.select(
    cashMemoSelectors.selectIsLoading
  );

  private createCashMemoResponse$ = this.store.select(
    cashMemoSelectors.selectCreateCashMemoResponse
  );

  private viewCashMemoResponse$ = this.store.select(
    cashMemoSelectors.selectViewCashMemoResponse
  );

  private tcsAmountResponse$ = this.store.select(
    cashMemoSelectors.selectTcsAmountResponse
  );

  private updateCashMemoResponse$ = this.store.select(
    cashMemoSelectors.selectUpdateCashMemoResponse
  );

  private partialUpdateCashMemoResponse$ = this.store.select(
    cashMemoSelectors.selectPartialUpdateCashMemoResponse
  );

  private updatePriceDetailsResponse$ = this.store.select(
    cashMemoSelectors.selectUpdatePriceDetailsResponse
  );

  private deleteCashMemoResponse$ = this.store.select(
    cashMemoSelectors.selectDeleteCashMemoResponse
  );

  private invokeOrderDetailsResponse$ = this.store.select(
    cashMemoSelectors.selectInvokeOrderDetailsResponse
  );

  private cashMemoHistory$ = this.store.select(
    cashMemoSelectors.selectCashMemoHistory
  );

  private cashMemoHistoryTotalElements$ = this.store.select(
    cashMemoSelectors.selectCashMemoHistoryTotalElements
  );

  private isHistoryDetailsLoading$ = this.store.select(
    cashMemoSelectors.selectIsHistoryDetailsLoading
  );
  private itemDetails$ = this.store.select(
    cashMemoSelectors.selectItemDetails
  );
  private isABInvoked$ = this.store.select(
    cashMemoSelectors.selectIsABInvoked
  );
  private historySearchParameter$ = this.store.select(
    cashMemoSelectors.selectHistorySearchParameter
  );

// Manual CM
  private materialPrices$ = this.store.select(
    cashMemoSelectors.selectMaterialPrices
  );

  private fileUpload$ = this.store.select(
    cashMemoSelectors.selectFileUploadRes
  );

  private fileUploadList$ = this.store.select(
    cashMemoSelectors.selectFileUploadListRes
  );

  private fileDownload$ = this.store.select(
    cashMemoSelectors.selectFileDownloadUrl
  );
  private getFocus$ = this.store.select(
    cashMemoSelectors.selectSetFocus
  );
  private isIGST$ = this.store.select(
    cashMemoSelectors.selectIsIGST
  );
  private isMetalRateValidated$ = this.store.select(
    cashMemoSelectors.selectIsMetalRateValidated
  );

  createCashMemo(createCashMemoPayload: CashMemoDetailsRequestPayload) {
    this.store.dispatch(
      new CashMemoActions.CreateCashMemo(createCashMemoPayload)
    );
  }

  viewCashMemo(viewCashMemoPayload: CashMemoDetailsRequestPayload) {
    this.store.dispatch(
      new CashMemoActions.ViewCashMemo(viewCashMemoPayload)
    );
  }

  loadTcsAmount(viewCashMemoPayload: CashMemoDetailsRequestPayload) {
    this.store.dispatch(
      new CashMemoActions.LoadTcsDetail(viewCashMemoPayload)
    );
  }

  partialUpdateCashMemo(
    partialUpdateCashMemoPayload: CashMemoDetailsRequestPayload
  ) {
    this.store.dispatch(
      new CashMemoActions.PartialUpdateCashMemo(
        partialUpdateCashMemoPayload
      )
    );
  }

  updateCashMemo(updateCashMemoPayload: CashMemoDetailsRequestPayload) {
    this.store.dispatch(
      new CashMemoActions.UpdateCashMemo(updateCashMemoPayload)
    );
  }

  deleteCashMemo(deleteCashMemoPayload: CashMemoDetailsRequestPayload) {
    this.store.dispatch(
      new CashMemoActions.DeleteCashMemo(deleteCashMemoPayload)
    );
  }

  updatePriceDetails(updateCashMemoPayload: CashMemoDetailsRequestPayload) {
    this.store.dispatch(
      new CashMemoActions.UpdatePriceDetails(updateCashMemoPayload)
    );
  }

  invokeOrderDetails(invokeOrderDetailsPayload: CashMemoDetailsRequestPayload) {
    this.store.dispatch(
      new CashMemoActions.InvokeOrderDetails(invokeOrderDetailsPayload)
    );
  }

  loadCashMemoHistory(
    cashMemoHistoryRequestPayload: CashMemoHistoryRequestPayload
  ) {
    this.store.dispatch(
      new CashMemoActions.LoadCashMemoHistory(
        cashMemoHistoryRequestPayload
      )
    );
  }
  resetHistory() {
    this.store.dispatch(new CashMemoActions.ResetHistory());
  }

  updatetHistorySearchParameter(
    cashMemoHistoryRequestPayload: CashMemoHistoryRequestPayload
  ) {
    this.store.dispatch(
      new CashMemoActions.UpdateHistorySearchParameter(
        cashMemoHistoryRequestPayload
      )
    );
  }

  getItemFromCashMemoHistory(data: CashMemoItemDetailsRequestPayload) {
    this.store.dispatch(
      new CashMemoActions.LoadItemFromCashMemoHistory(data)
    );
  }

  setIsABInvoked(invokePayload: boolean) {
    this.store.dispatch(new CashMemoActions.SetABInvoked(invokePayload));
  }

  resetValues() {
    this.store.dispatch(new CashMemoActions.ResetValues());
  }

  // Manual CM
  loadMaterialPrices(materialPricesPayload: MetalRatesPayload) {
    this.store.dispatch(
      new CashMemoActions.GetMaterialPrices(materialPricesPayload)
    );
  }

  loadFileUpload(payload: FileUploadDownloadPayload) {
    this.store.dispatch(new CashMemoActions.FileUpload(payload));
  }

  loadFileUploadList(payload: FileUploadDownloadPayload) {
    this.store.dispatch(new CashMemoActions.FileUploadList(payload));
  }

  loadFileDownloadUrl(payload: { id: string; locationCode: string }) {
    this.store.dispatch(new CashMemoActions.FileDownloadUrl(payload));
  }

  ValidateMetalRate(payload: ValidateMetalRatePayload) {
    this.store.dispatch(new CashMemoActions.ValidateMetalRate(payload));
  }

  setFocus(focusValue: number) {
    this.store.dispatch(new CashMemoActions.SetFocus(focusValue));
  }

  getItemDetails() {
    return this.itemDetails$;
  }
  getCashMemoHistory() {
    return this.cashMemoHistory$;
  }

  getCashMemoHistoryTotalElements() {
    return this.cashMemoHistoryTotalElements$;
  }

  getIsHistoryDetailsLoading() {
    return this.isHistoryDetailsLoading$;
  }

  getHasError() {
    return this.hasError$;
  }

  getIsLoading() {
    return this.isLoading$;
  }

  getCreateCashMemoResponse() {
    return this.createCashMemoResponse$;
  }

  getViewCashMemoResponse() {
    return this.viewCashMemoResponse$;
  }

  getUpdateCashMemoResponse() {
    return this.updateCashMemoResponse$;
  }

  getPartialUpdateCashMemoResponse() {
    return this.partialUpdateCashMemoResponse$;
  }

  getUpdatePriceDetailsResponse() {
    return this.updatePriceDetailsResponse$;
  }

  getDeleteCashMemoResponse() {
    return this.deleteCashMemoResponse$;
  }

  getInvokeOrderDetailsResponse() {
    return this.invokeOrderDetailsResponse$;
  }

  getIsABInvoked() {
    return this.isABInvoked$;
  }

  getHistorySearchParameter() {
    return this.historySearchParameter$;
  }

  getTcsAmount() {
    return this.tcsAmountResponse$;
  }
  
  // Manual CM
  getMaterialPrices() {
    return this.materialPrices$;
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
  getFocus() {
    return this.getFocus$;
  }
  getIsIGST() {
    return this.isIGST$;
  }
  getIsMetalRateValidated() {
    return this.isMetalRateValidated$;
  }
}
