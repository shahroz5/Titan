import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { GepSelector } from './gep.selectors';
import * as gepActions from './gep.actions';
import { GepState } from './gep.state';
import {
  AdvanceHistoryItemsRequestPayload,
  DiscountListPayload,
  DiscountsList,
  HistorySearchParamDetails
} from '@poss-web/shared/models';
import { Observable } from 'rxjs';

@Injectable()
export class GepFacade {
  constructor(private store: Store<GepState>) {}

  private gepDetails$ = this.store.select(GepSelector.selectGepDetails);

  private updateGep$ = this.store.select(GepSelector.selectUpdatedGep);

  private customerUpdate$ = this.store.select(
    GepSelector.selectCustomerDetails
  );

  private gepResponse$ = this.store.select(GepSelector.selectGepInit);
  private rso$ = this.store.select(GepSelector.selectRsoCancel);
  private reason$ = this.store.select(GepSelector.selectReason);

  private holdConfrmResponse$ = this.store.select(
    GepSelector.selectHoldRespone
  );

  private summaryResponse$ = this.store.select(GepSelector.selectSummary);
  private rsoResponse$ = this.store.select(GepSelector.selectRso);

  private deleteResponse$ = this.store.select(GepSelector.selectDelete);

  private totalBreakUp$ = this.store.select(GepSelector.selectTotalBreakUp);

  private postGepResponse$ = this.store.select(GepSelector.selectGepResponse);

  private metalPrice$ = this.store.select(GepSelector.selectMetalPrice);

  private uploadResponse$ = this.store.select(GepSelector.selectUploadResponse);
  private metal$ = this.store.select(GepSelector.selectMetalType);
  private item$ = this.store.select(GepSelector.selectItemType);

  private hasError$ = this.store.select(GepSelector.selectHasError);
  private OnHoldExpiredTime$ = this.store.select(
    GepSelector.selectLastHoldTime
  );
  private isLoaded$ = this.store.select(GepSelector.selectIsLoaded);
  private isCustomerUpdate$ = this.store.select(GepSelector.selectIsCustomerUpdate);
  private gepTotalValue$ = this.store.select(
    GepSelector.selectproductTotalValue
  );
  private gepNetValue$ = this.store.select(
    GepSelector.selectproductNetValue
  );
  private gepTotalTax$ = this.store.select(GepSelector.selectProductTax);
  private gepCancelCount$ = this.store.select(GepSelector.selecttCancelCount);
  private gepTotalWeight$ = this.store.select(GepSelector.selectProductWeight);
  private gepTotalqty$ = this.store.select(GepSelector.selectProductQuantity);

  private saveCancel$ = this.store.select(GepSelector.selectsaveCancelGep);
  private loadCancel = this.store.select(GepSelector.selectloadCancelGep);
  private loadOnHold = this.store.select(GepSelector.selectloadOnHold);
  private loadCountHold = this.store.select(GepSelector.selectcountOnhold);
  private deleteGep$ = this.store.select(GepSelector.selectdeleteGep);
  private gepItem$ = this.store.select(GepSelector.selectloadgepitem);
  private gepItemResponse$ = this.store.select(GepSelector.gepItemResponse);
  private gepProductDetail$ = this.store.select(GepSelector.selectgepDetails);
  private fileUploadList$ = this.store.select(
    GepSelector.selectFileUploadListRes
  );
  private fileDownload$ = this.store.select(GepSelector.selectFileDownloadUrl);
  private historySearchParamDetails$ = this.store.select(
    GepSelector.selectHistorySearchParamDetails
  );

  private gepHistoryItems$ = this.store.select(
    GepSelector.selectGEPHistoryResponse
  );

  private viewGEPResponse$ = this.store.select(
    GepSelector.selectViewGEPResponse
  );

  private availableDiscountsList$ = this.store.select(
    GepSelector.selectAvailableDiscountsList
  );

  getgepProductDetail() {
    return this.gepProductDetail$;
  }
  getCancelValidation() {
    return this.rso$;
  }
  getgepItemResponse$() {
    return this.gepItemResponse$;
  }
  getCancelValidation2() {
    return this.reason$;
  }

  getCustomerUpdate() {
    return this.customerUpdate$;
  }

  getCancelCount() {
    return this.gepCancelCount$;
  }

  getGepInit() {
    return this.gepResponse$;
  }

  getDelete() {
    return this.deleteResponse$;
  }

  getHold() {
    return this.holdConfrmResponse$;
  }
  getOnHoldExpiredTimeList() {
    return this.OnHoldExpiredTime$;
  }
  getGepDetails() {
    return this.gepDetails$;
  }

  getUpdatedGep() {
    return this.updateGep$;
  }

  getSummary() {
    return this.summaryResponse$;
  }
  getTotalBreakUp() {
    return this.totalBreakUp$;
  }

  getMetalPrice() {
    return this.metalPrice$;
  }

  getMetal() {
    return this.metal$;
  }

  getItem() {
    return this.item$;
  }

  getGepResponse() {
    return this.postGepResponse$;
  }

  getError() {
    return this.hasError$;
  }

  getIsLoaded() {
    return this.isLoaded$;
  }

  getIsCustomerUpdate() {
    return this.isCustomerUpdate$;
  }

  getSaveCancel() {
    return this.saveCancel$;
  }

  getCancelGep() {
    return this.loadCancel;
  }
  getUploadResponse() {
    return this.uploadResponse$;
  }

  getTotalValue() {
    return this.gepTotalValue$;
  }

  getNetValue() {
    return this.gepNetValue$;
  }

  getTotalTax() {
    return this.gepTotalTax$;
  }
  getTotalWeight() {
    return this.gepTotalWeight$;
  }
  getTotalqty() {
    return this.gepTotalqty$;
  }

  getloadOnHold() {
    return this.loadOnHold;
  }

  getloadCountHold() {
    return this.loadCountHold;
  }

  getdeleteGep() {
    return this.deleteGep$;
  }

  getHeaderDetails() {
    return this.rsoResponse$;
  }

  getgepItem() {
    return this.gepItem$;
  }

  getFileUploadListRes() {
    return this.fileUploadList$;
  }

  getFileDownloadUrl() {
    return this.fileDownload$;
  }

  clearGEPHistoryItems() {
    this.store.dispatch(new gepActions.LoadGEPHistorySuccess(null));
  }

  clearHistorySearchParamDetails() {
    this.store.dispatch(new gepActions.SetHistoryGEPSearchParamDetails(null));
  }
  getHistorySearchParamDetails(): Observable<HistorySearchParamDetails> {
    return this.historySearchParamDetails$;
  }

  setHistorySearchParamDetails(payload: HistorySearchParamDetails) {
    this.store.dispatch(
      new gepActions.SetHistoryGEPSearchParamDetails(payload)
    );
  }
  getGEPHistoryItems() {
    return this.gepHistoryItems$;
  }

  getViewGEPResponse(): Observable<any> {
    return this.viewGEPResponse$;
  }

  loadGepInit(data: gepActions.GepInitPayload) {
    this.store.dispatch(new gepActions.GepInit(data));
  }

  getViewGEPDetails(id: string, subTxnType: string) {
    this.store.dispatch(new gepActions.ViewGEP(id, subTxnType));
  }

  loadAdvanceHistory(
    requestPayload: AdvanceHistoryItemsRequestPayload,
    searchField?: string,
    searchType?: string,
    status?: string,
    page?: number,
    size?: number,
    txnType?: string,
    subTxnType?: string
  ) {
    this.store.dispatch(
      new gepActions.LoadGEPHistory(
        requestPayload,
        searchField,
        searchType,
        status,
        page,
        size,
        txnType,
        subTxnType
      )
    );
  }

  postGepResponse(data: gepActions.GepItemPayload) {
    this.store.dispatch(new gepActions.PostGepItems(data));
  }

  metalPrice(date) {
    this.store.dispatch(new gepActions.GepMetalRate(date));
  }
  loadMetal(data: string) {
    this.store.dispatch(new gepActions.LoadMetal(data));
  }
  loadItem(data: string) {
    this.store.dispatch(new gepActions.LoadITEM(data));
  }
  totalBreakUp(data: gepActions.GepPriceRequest) {
    this.store.dispatch(new gepActions.TotalValueBreakUp(data));
  }

  delete(data: gepActions.DeletePayload) {
    this.store.dispatch(new gepActions.Delete(data));
  }
  loadGepItem(data: gepActions.DeletePayload) {
    this.store.dispatch(new gepActions.LoadGepItem(data));
  }

  holdConfirm(data: gepActions.HoldPayload) {
    this.store.dispatch(new gepActions.HoldConfirm(data));
  }

  summary(data: any) {
    this.store.dispatch(new gepActions.UpdateSummaryBar(data));
  }

  patchPso(data: gepActions.GepItemPayload) {
    this.store.dispatch(new gepActions.PostRSO(data));
  }

  updateGep(data: gepActions.PatchItemPayload) {
    this.store.dispatch(new gepActions.UpdateITEM(data));
  }

  loadGep(data: gepActions.LoadGepPayload) {
    this.store.dispatch(new gepActions.GetGepITEM(data));
  }

  clearSearchList() {
    this.store.dispatch(new gepActions.ClearSearchList());
  }

  resetGep() {
    this.store.dispatch(new gepActions.ResetGep());
  }

  saveRso(data) {
    this.store.dispatch(new gepActions.SaveRso(data));
  }
  saveReason(data) {
    this.store.dispatch(new gepActions.SaveReason(data));
  }

  loadCancelGep(data: gepActions.LoadCanclPayload) {
    this.store.dispatch(new gepActions.LoadCancelGep(data));
  }

  loadOnHoldGep(data: gepActions.LoadOnHoldPayload) {
    this.store.dispatch(new gepActions.LoadOnHold(data));
  }
  loadOnoldCount(data: gepActions.LoadOnHoldPayload) {
    this.store.dispatch(new gepActions.LoadCountOnHoLd(data));
  }
  deleteGep(data: gepActions.LoadGepPayload) {
    this.store.dispatch(new gepActions.DeleteGepITEM(data));
  }
  saveCancelGep(data: gepActions.GepInitPayload) {
    this.store.dispatch(new gepActions.SaveCanceleGep(data));
  }

  uploadForm(data: gepActions.FileUploadPayload) {
    this.store.dispatch(new gepActions.ImageUpload(data));
  }
  addProduct(data: {
    weight: number;
    purity: number;
    metalType: string;
    itemType?: string;
  }) {
    this.store.dispatch(new gepActions.SaveProduct(data));
  }
  updateProduct(data: { metal: string; item: string; id: string }) {
    this.store.dispatch(new gepActions.UpdateProduct(data));
  }
  updatePremelt(data: { preMelting: any; id: string }) {
    this.store.dispatch(new gepActions.UpdatePremelting(data));
  }
  deleteTempId(data: string) {
    this.store.dispatch(new gepActions.DeleteTempId(data));
  }
  updatePrice(data: gepActions.LoadGepPayload) {
    this.store.dispatch(new gepActions.UpdatePrice(data));
  }
  updateWeight(data) {
    this.store.dispatch(new gepActions.UpdateWeight(data));
  }
  updatePurity(data) {
    this.store.dispatch(new gepActions.UpdatePurity(data));
  }

  loadFileUploadList(payload: gepActions.FileUploadPayload) {
    this.store.dispatch(new gepActions.FileUploadList(payload));
  }

  loadFileDownloadUrl(payload: { id: string; locationCode: string }) {
    this.store.dispatch(new gepActions.FileDownloadUrl(payload));
  }

  loadAvailableDiscountsList(requestPayload: DiscountListPayload) {
    this.store.dispatch(
      new gepActions.LoadAvailableDiscountsList(requestPayload)
    );
  }

  resetAvailableDiscountsList() {
    this.store.dispatch(new gepActions.LoadAvailableDiscountsListSuccess(null));
  }

  getAvailableDiscountsList(): Observable<DiscountsList[]> {
    return this.availableDiscountsList$;
  }
}
