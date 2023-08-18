import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as TepActions from './direct-tep.actions';
import { TepSelectors } from './direct-tep.selectors';
import { TepState } from './direct-tep.state';
import {
  CreateOpenTepTransactionResponse,
  PatchTepRequestPayload,
  GetTepItemConfiguratonResponse,
  GetTepCashMemoResponse,
  GetTepPriceDetailsRequestPayload,
  GetTepPriceDetailsResponse,
  AddTepItemRequestPayload,
  AddOrUpdateTepItemResponse,
  UpdateTepItemRequestPayload,
  ConfirmOrHoldTepRequestPayload,
  ConfirmTepItemResponse,
  DeleteTepItemResponse,
  CustomErrors,
  TepItemResponse,
  TepTransactionResponse,
  GoldPlusLocation,
  FileUploadDownloadPayload,
  workflowPayload,
  ConfirmRequestTepRequestPayload,
  BillCancelPayload,
  createOpenOrPatchCutPieceTepStockManagementResponse,
  addOrPatchCutPieceTepItemInStockManagementResponse,
  patchCutPieceTepStockManagementPayload,
  addCutPieceTepItemInStockManagementPayload,
  patchCutPieceTepItemInStockManagementPayload,
  confirmCutPieceTepItemInStockManagementPayload,
  DiscountListPayload,
  DiscountsList,
  SelectDropDownOption,
  RsoNameObject
} from '@poss-web/shared/models';
import { Observable } from 'rxjs';
import { AnyFn } from '@ngrx/store/src/selector';

@Injectable()
export class TepFacade {
  constructor(private store: Store<TepState>) {}

  private error$ = this.store.select(TepSelectors.selectError);

  private isLoading$ = this.store.select(TepSelectors.selectIsLoading);
  private IsLoadingPriceUpdate$ = this.store.select(
    TepSelectors.selectIsLoadingPriceUpdate
  );

  private isOpenTaskLoading$ = this.store.select(
    TepSelectors.selectIsOpenTaskLoading
  );

  private selectedRsoName$ = this.store.select(
    TepSelectors.selectSelectedRsoName
  );

  private createOpenTepTransactionResponse$ = this.store.select(
    TepSelectors.selectCreateOpenTepTransactionResponse
  );

  private updateOpenTepTransactionResponse$ = this.store.select(
    TepSelectors.selectUpdateOpenTepTransactionResponse
  );

  private tepItemConfiguratonResponse$ = this.store.select(
    TepSelectors.selectTepItemConfiguratonResponse
  );

  private cmListItemTepConfigurationResponse$ = this.store.select(
    TepSelectors.selectCmListItemTepConfigurationResponse
  );

  private tepCashMemoResponseItemList$ = this.store.select(
    TepSelectors.selectTepCashMemoResponseItemList
  );

  private tepPriceDetailsResponse$ = this.store.select(
    TepSelectors.selectTepPriceDetailsResponse
  );

  private upddatePriceDetailsResponse$ = this.store.select(
    TepSelectors.updateTepPriceDetailsResponse
  );

  private addTepItemResponse$ = this.store.select(
    TepSelectors.selectAddTepItemResponse
  );

  private updateTepItemResponse$ = this.store.select(
    TepSelectors.selectUpdateTepItemResponse
  );

  private confirmTepItemResponse$ = this.store.select(
    TepSelectors.selectConfirmTepItemResponse
  );

  private deleteTepItemResponse$ = this.store.select(
    TepSelectors.selectDeleteTepItemResponse
  );

  private scannedTepItemCode$ = this.store.select(
    TepSelectors.selectScannedTepItemCode
  );

  private isRefundFormValid$ = this.store.select(
    TepSelectors.selectIsRefundFormValid
  );

  private rsoList$ = this.store.select(TepSelectors.selectRsoList);

  private remarks$ = this.store.select(TepSelectors.selectRemarks);

  private totalQty$ = this.store.select(TepSelectors.selectTotalQty);

  private totalGrossWt$ = this.store.select(TepSelectors.selectTotalGrossWt);

  private totalExchangeAmt$ = this.store.select(
    TepSelectors.selectTotalExchangeWt
  );

  private selectedPaymentMethod$ = this.store.select(
    TepSelectors.selectSelectedPaymentMethod
  );

  private selectedTepType$ = this.store.select(
    TepSelectors.selectSelectedTepType
  );

  private viewTepTransactionResponse$ = this.store.select(
    TepSelectors.selectViewTepTransactionResponse
  );

  private viewTepItemResponse$ = this.store.select(
    TepSelectors.selectViewTepItemResponse
  );

  private deleteTepTransactionResponse$ = this.store.select(
    TepSelectors.selectDeleteTransactionResponse
  );

  private cutPieceTotalQty$ = this.store.select(
    TepSelectors.selectCutPieceTotalQty
  );
  private workflowDeatils$ = this.store.select(
    TepSelectors.selectWorkflowDetails
  );

  private cutPieceTotalValue$ = this.store.select(
    TepSelectors.selectCutPieceTotalValue
  );

  private tepItemCutPieceDetailsResponse$ = this.store.select(
    TepSelectors.selectTepItemCutPieceDetailsResponse
  );

  private isRequestRaisingScenario$ = this.store.select(
    TepSelectors.selectIsRequestRaisingScenario
  );

  private goldPlusLocations$ = this.store.select(
    TepSelectors.selectGoldPlusLocations
  );

  private refundCashLimit$ = this.store.select(TepSelectors.refundCashLimit);

  private fileUpload$ = this.store.select(TepSelectors.selectFileUploadRes);

  private fileIdProofDownload$ = this.store.select(
    TepSelectors.selectFileIdProofDownloadUrl
  );

  private fileCancelledChequeDownload$ = this.store.select(
    TepSelectors.selectFileCancelledChequeDownloadUrl
  );

  private fileApprovalMailDownload$ = this.store.select(
    TepSelectors.selectFileApprovalMailDownloadUrl
  );

  private fvtReasons$ = this.store.select(TepSelectors.selectFtepReasons);

  private updateTepTransactionPriceDetailsResponse$ = this.store.select(
    TepSelectors.selectUpdateTepTransactionPriceDetailsResponse
  );

  private createOpenCutPieceTepTransactionResponse$ = this.store.select(
    TepSelectors.selectCreateOpenCutPieceTepTransactionResponse
  );

  private patchCutPieceTepTransactionResponse$ = this.store.select(
    TepSelectors.selectPatchCutPieceTepTransactionResponse
  );

  private addCutPieceTepItemResponse$ = this.store.select(
    TepSelectors.selectAddCutPieceTepItemResponse
  );

  private patchCutPieceTepItemResponse$ = this.store.select(
    TepSelectors.selectPatchCutPieceTepItemResponse
  );

  private confirmCutPieceTepItemResponse$ = this.store.select(
    TepSelectors.selectConfirmCutPieceTepItemResponse
  );

  private availableDiscountsList$ = this.store.select(
    TepSelectors.selectAvailableDiscountsList
  );

  private studdedProductGroupCodes$ = this.store.select(
    TepSelectors.selectStuddedProductGroupCodes
  );

  private isExceptionScenario$ = this.store.select(
    TepSelectors.selectIsExceptionScenario
  );

  private holdTransactionMetalRates$ = this.store.select(
    TepSelectors.selectHoldTransactionMetalRates
  );

  loadFvtReasons() {
    this.store.dispatch(new TepActions.LoadFtepReasons());
  }

  loadStuddedProductDetails(productType: string, transacionType: string) {
    this.store.dispatch(
      new TepActions.LoadStuddedProductDetails(productType, transacionType)
    );
  }

  createOpenTepTransaction(subTransactionType: string, requestPayload: any) {
    this.store.dispatch(
      new TepActions.CreateOpenTepTransaction(
        subTransactionType,
        requestPayload
      )
    );
  }

  updateOpenTepTransaction(
    id: string,
    subTransactionType: string,
    requestPayload: PatchTepRequestPayload
  ) {
    this.store.dispatch(
      new TepActions.UpdateOpenTepTransaction(
        id,
        subTransactionType,
        requestPayload
      )
    );
  }

  loadTepItemConfiguration(
    itemCode: string,
    tepType: string,
    isDummy?: boolean,
    customerMobileNo?: string
  ) {
    this.store.dispatch(
      new TepActions.GetTepItemConfiguration(
        itemCode,
        tepType,
        isDummy,
        customerMobileNo
      )
    );
  }

  loadRefundCashLimit(
    customerId?: number,
    refundAmt?: number,
    txnType?: string
  ) {
    this.store.dispatch(
      new TepActions.LoadRefundCashLimit(customerId, refundAmt, txnType)
    );
  }

  loadTepItemExceptionConfiguration(
    itemCode: string,
    tepType: string,
    isDummy?: boolean,
    customerMobileNo?: string
  ) {
    this.store.dispatch(
      new TepActions.GetTepItemExceptionConfiguration(
        itemCode,
        tepType,
        isDummy,
        customerMobileNo
      )
    );
  }

  loadTepCashMemoItemList(
    locationCode: string,
    refDocNo: string,
    refFiscalYear: string,
    subTransactionType: string,
    mobileNumber: string
  ) {
    this.store.dispatch(
      new TepActions.GetTepCashMemoItemList(
        locationCode,
        refDocNo,
        refFiscalYear,
        subTransactionType,
        mobileNumber
      )
    );
  }

  loadTepItemPriceDetails(
    requestPayload: GetTepPriceDetailsRequestPayload,
    locationCode?: string,
    customerId?: number,
    customerType?: string,
    tepType?: string,
    isFullValueTep?: boolean
  ) {
    this.store.dispatch(
      new TepActions.LoadTepItemPriceDetails(
        requestPayload,
        locationCode,
        customerId,
        customerType,
        tepType,
        isFullValueTep
      )
    );
  }

  updateItemPriceDetails(requestPayload: GetTepPriceDetailsRequestPayload) {
    this.store.dispatch(
      new TepActions.UpdateTepItemPriceDetails(requestPayload)
    );
  }

  addTepItem(
    id: string,
    subTransactionType: string,
    requestPayload: AddTepItemRequestPayload
  ) {
    this.store.dispatch(
      new TepActions.AddTepItem(id, subTransactionType, requestPayload)
    );
  }

  updateTepItem(
    id: string,
    itemId: string,
    subTransactionType: string,
    requestPayload: UpdateTepItemRequestPayload
  ) {
    this.store.dispatch(
      new TepActions.UpdateTepItem(
        id,
        itemId,
        subTransactionType,
        requestPayload
      )
    );
  }

  confirmTep(
    id: string,
    status: string,
    subTransactionType: string,
    requestPayload: ConfirmOrHoldTepRequestPayload
  ) {
    this.store.dispatch(
      new TepActions.ConfirmTep(id, status, subTransactionType, requestPayload)
    );
  }

  DeleteTepItem(id: string, itemId: string, subTransactionType: string) {
    this.store.dispatch(
      new TepActions.DeleteTepItem(id, itemId, subTransactionType)
    );
  }

  LoadRsoList(roleCode: string) {
    this.store.dispatch(new TepActions.LoadRsoList(roleCode));
  }

  LoadTepItemProductCodeDetail(itemCode: string) {
    this.store.dispatch(new TepActions.LoadTepItemCodeDetails(itemCode));
  }

  SetRemarks(remarks: string) {
    this.store.dispatch(new TepActions.SetRemarks(remarks));
  }

  SetTotalQty(totalQty: number) {
    this.store.dispatch(new TepActions.SetTotalQty(totalQty));
  }

  SetTotalGrossWt(totalGrossWt: number) {
    this.store.dispatch(new TepActions.SetTotalGrossWt(totalGrossWt));
  }

  SetTotalExchangeAmt(totalExchangeAmt: number) {
    this.store.dispatch(new TepActions.SetTotalExchangeAmt(totalExchangeAmt));
  }

  SetPaymentMethod(selectedPaymentMethod: string) {
    this.store.dispatch(
      new TepActions.SelectedPaymentMethod(selectedPaymentMethod)
    );
  }

  SetTepType(tepType: string) {
    this.store.dispatch(new TepActions.SelectedTepType(tepType));
  }

  SetSelectedRsoName(rsoName: SelectDropDownOption) {
    this.store.dispatch(new TepActions.SetSelectedRsoName(rsoName));
  }

  SetTepItemProductCode(payload: string) {
    this.store.dispatch(new TepActions.SetTepItemProductCode(payload));
  }

  resetTepItemValuationDetails(payload: GetTepPriceDetailsResponse) {
    this.store.dispatch(new TepActions.LoadTepItemPriceDetailsSuccess(payload));
  }

  resetTepCmItemList(payload: GetTepCashMemoResponse) {
    this.store.dispatch(new TepActions.GetTepCashMemoItemListSuccess(payload));
  }

  loadTepTransactionDetails(
    id: string,
    subTransactionType: string,
    reCalculate?: boolean,
    isTepException?: boolean
  ) {
    this.store.dispatch(
      new TepActions.LoadTepTransactionDetails(
        id,
        subTransactionType,
        reCalculate,
        isTepException
      )
    );
  }

  deleteTepTransactionDetails(id: string, subTransactionType: string) {
    this.store.dispatch(
      new TepActions.DeleteTepTransactionDetails(id, subTransactionType)
    );
  }

  loadTepItemDetails(
    id: string,
    itemId: string,
    subTransactionType: string,
    tepType: string,
    mobileNumber?: string
  ) {
    this.store.dispatch(
      new TepActions.LoadTepItemDetails(
        id,
        itemId,
        subTransactionType,
        tepType,
        mobileNumber
      )
    );
  }

  loadGoldPlusLocations(isLocationFromTep?: boolean) {
    this.store.dispatch(
      new TepActions.LoadGoldPlusLocations(isLocationFromTep)
    );
  }

  loadFileUpload(payload: FileUploadDownloadPayload) {
    this.store.dispatch(new TepActions.FileUpload(payload));
  }

  loadFileIdProofDownloadUrl(payload: FileUploadDownloadPayload) {
    this.store.dispatch(new TepActions.FileIdProofDownloadUrl(payload));
  }

  loadFileCancelledChequeDownloadUrl(payload: FileUploadDownloadPayload) {
    this.store.dispatch(new TepActions.FileCancelledChequeDownloadUrl(payload));
  }

  loadFileApprovalMailDownloadUrl(payload: FileUploadDownloadPayload) {
    this.store.dispatch(new TepActions.FileApprovalMailDownloadUrl(payload));
  }

  getGoldPlusLocations(): Observable<GoldPlusLocation[]> {
    return this.goldPlusLocations$;
  }

  resetTep() {
    this.store.dispatch(new TepActions.ResetTep());
  }

  SetCutPieceTotalQty(cutPieceTotalQty: number) {
    this.store.dispatch(new TepActions.SetCutPieceTotalQty(cutPieceTotalQty));
  }
  cancel(processID: string, workflow: string) {
    this.store.dispatch(new TepActions.CancelRequest(processID, workflow));
  }

  cancelTEP(payload: BillCancelPayload) {
    this.store.dispatch(new TepActions.CancelTEPRequest(payload));
  }
  SetCutPieceTotalValue(cutPieceTotalValue: number) {
    this.store.dispatch(
      new TepActions.SetCutPieceTotalValue(cutPieceTotalValue)
    );
  }

  private cancelRequest$ = this.store.select(TepSelectors.cancelResponse);
  private cancelTEP$ = this.store.select(TepSelectors.cancelTEPResponse);

  loadCmListItemTepConfiguration(
    itemCode: string,
    tepType: string,
    isDummy?: boolean,
    customerMobileNo?: string
  ) {
    this.store.dispatch(
      new TepActions.LoadCmListItemTepConfiguration(
        itemCode,
        tepType,
        isDummy,
        customerMobileNo
      )
    );
  }

  confirmRequestTep(
    id: string,
    status: string,
    subTransactionType: string,
    workflowType: string,
    requestPayload: ConfirmRequestTepRequestPayload
  ) {
    this.store.dispatch(
      new TepActions.ConfirmTepRequest(
        id,
        status,
        subTransactionType,
        workflowType,
        requestPayload
      )
    );
  }

  updateTepTransactionPriceDetails(id: string, subTxnType: string) {
    this.store.dispatch(
      new TepActions.UpdateTepTransactionPriceDetails(id, subTxnType)
    );
  }

  getWorkflowDetails() {
    return this.workflowDeatils$;
  }

  setIsRefundFormValid(isValid: boolean) {
    this.store.dispatch(new TepActions.SetIsRefundFormValid(isValid));
  }

  setHoldTransactionMetalRates(payload: any) {
    this.store.dispatch(new TepActions.SetHoldTransactionMetalRates(payload));
  }

  loadworkflowProcessDetails(data: workflowPayload) {
    this.store.dispatch(new TepActions.LoadWorkflowDeatils(data));
  }
  setIsRequestRaisingScenario(isRequestRaising: boolean) {
    this.store.dispatch(
      new TepActions.SetIsRequestRaisingScenario(isRequestRaising)
    );
  }

  loadAvailableDiscountsList(requestPayload: DiscountListPayload) {
    this.store.dispatch(
      new TepActions.LoadAvailableDiscountsList(requestPayload)
    );
  }

  resetAvailableDiscountsList() {
    this.store.dispatch(new TepActions.LoadAvailableDiscountsListSuccess(null));
  }

  getError(): Observable<CustomErrors> {
    return this.error$;
  }

  getIsLoading(): Observable<boolean> {
    return this.isLoading$;
  }
  getIsPriceUpdateLoading(): Observable<boolean> {
    return this.IsLoadingPriceUpdate$;
  }
  getIsOpenTaskLoading(): Observable<boolean> {
    return this.isOpenTaskLoading$;
  }

  getSelectedRsoName(): Observable<SelectDropDownOption> {
    return this.selectedRsoName$;
  }

  getCreateOpenTepTransactionResponse(): Observable<
    CreateOpenTepTransactionResponse
  > {
    return this.createOpenTepTransactionResponse$;
  }

  getUpdateOpenTepTransactionResponse(): Observable<
    CreateOpenTepTransactionResponse
  > {
    return this.updateOpenTepTransactionResponse$;
  }

  getUpdatedPriceDetails(): Observable<GetTepPriceDetailsResponse> {
    return this.upddatePriceDetailsResponse$;
  }

  getTepItemConfiguratonResponse(): Observable<GetTepItemConfiguratonResponse> {
    return this.tepItemConfiguratonResponse$;
  }

  getRefundCashLimit() {
    return this.refundCashLimit$;
  }

  getTepCashMemoResponseItemList(): Observable<GetTepCashMemoResponse> {
    return this.tepCashMemoResponseItemList$;
  }

  getTepPriceDetailsResponse(): Observable<GetTepPriceDetailsResponse> {
    return this.tepPriceDetailsResponse$;
  }

  getAddTepItemResponse(): Observable<AddOrUpdateTepItemResponse> {
    return this.addTepItemResponse$;
  }

  getUpdateTepItemResponse(): Observable<AddOrUpdateTepItemResponse> {
    return this.updateTepItemResponse$;
  }

  getConfirmTepItemResponse(): Observable<ConfirmTepItemResponse> {
    return this.confirmTepItemResponse$;
  }

  getDeleteTepItemResponse(): Observable<DeleteTepItemResponse> {
    return this.deleteTepItemResponse$;
  }

  getRsoList(): Observable<RsoNameObject[]> {
    return this.rsoList$;
  }

  getRemarks(): Observable<string> {
    return this.remarks$;
  }

  getTotalQty(): Observable<number> {
    return this.totalQty$;
  }

  getTotalGrossWt(): Observable<number> {
    return this.totalGrossWt$;
  }

  getTotalExchangeAmt(): Observable<number> {
    return this.totalExchangeAmt$;
  }

  getSelectedPaymentMethod(): Observable<string> {
    return this.selectedPaymentMethod$;
  }

  getSelectedTepType(): Observable<string> {
    return this.selectedTepType$;
  }

  getTepItemProductCodeDetail(): Observable<string> {
    return this.scannedTepItemCode$;
  }

  getTepItemDetails(): Observable<TepItemResponse> {
    return this.viewTepItemResponse$;
  }

  getTepTransactionDetails(): Observable<TepTransactionResponse> {
    return this.viewTepTransactionResponse$;
  }

  getDeleteTepTransactionResponse(): Observable<any> {
    return this.deleteTepTransactionResponse$;
  }

  getTepItemCutPieceDetailsResponse(): Observable<any> {
    return this.tepItemCutPieceDetailsResponse$;
  }

  getCutPieceTotalQty(): Observable<number> {
    return this.cutPieceTotalQty$;
  }

  getCmListItemTepConfiguration(): Observable<GetTepItemConfiguratonResponse> {
    return this.cmListItemTepConfigurationResponse$;
  }

  getCutPieceTotalValue(): Observable<number> {
    return this.cutPieceTotalValue$;
  }

  getIsRefundFormValid(): Observable<boolean> {
    return this.isRefundFormValid$;
  }

  getIsRequestRaising(): Observable<boolean> {
    return this.isRequestRaisingScenario$;
  }

  getFileUploadRes() {
    return this.fileUpload$;
  }

  getFileIdProofDownloadUrl() {
    return this.fileIdProofDownload$;
  }

  getFileCancelledChequeDownloadUrl() {
    return this.fileCancelledChequeDownload$;
  }

  getFileApprovalMailDownloadUrl() {
    return this.fileApprovalMailDownload$;
  }

  clearDeleteTepItemResponse() {
    this.store.dispatch(new TepActions.DeleteTepItemSuccess(null));
  }
  getCancelRequest() {
    return this.cancelRequest$;
  }
  getCancelTEPResponse() {
    return this.cancelTEP$;
  }

  getFvtReasons(): Observable<string[]> {
    return this.fvtReasons$;
  }

  clearCmListItemTepConfiguration() {
    this.store.dispatch(
      new TepActions.LoadCmListItemTepConfigurationSuccess(null)
    );
  }

  clearTepItemConfiguration() {
    this.store.dispatch(new TepActions.GetTepItemConfigurationSuccess(null));
  }

  clearTepItemDetails() {
    this.store.dispatch(new TepActions.LoadTepItemDetailsSuccess(null));
  }

  getUpdateTepTransactionPriceDetailsResponse(): Observable<
    TepTransactionResponse
  > {
    return this.updateTepTransactionPriceDetailsResponse$;
  }

  clearUpdateTepTransactionPriceDetailsResponse() {
    this.store.dispatch(
      new TepActions.UpdateTepTransactionPriceDetailsSuccess(null)
    );
  }

  createOpenCutPieceTepTransaction() {
    this.store.dispatch(new TepActions.CreateOpenCutPieceTepTransaction());
  }

  getOpenCutPieceTepTransactionResponse(): Observable<
    createOpenOrPatchCutPieceTepStockManagementResponse
  > {
    return this.createOpenCutPieceTepTransactionResponse$;
  }

  patchCutPieceTepTransaction(
    id: string,
    requestPayload: patchCutPieceTepStockManagementPayload
  ) {
    this.store.dispatch(
      new TepActions.PatchCutPieceTepTransaction(id, requestPayload)
    );
  }

  getPatchCutPieceTepTransactionResponse(): Observable<
    createOpenOrPatchCutPieceTepStockManagementResponse
  > {
    return this.patchCutPieceTepTransactionResponse$;
  }

  addCutPieceTepItem(
    id: string,
    requestPayload: addCutPieceTepItemInStockManagementPayload
  ) {
    this.store.dispatch(new TepActions.AddCutPieceTepItem(id, requestPayload));
  }

  getAddCutPieceTepItemResponse(): Observable<
    addOrPatchCutPieceTepItemInStockManagementResponse
  > {
    return this.addCutPieceTepItemResponse$;
  }

  patchCutPieceTepItem(
    id: string,
    itemId: string,
    requestPayload: patchCutPieceTepItemInStockManagementPayload
  ) {
    this.store.dispatch(
      new TepActions.PatchCutPieceTepItem(id, itemId, requestPayload)
    );
  }

  getPatchCutPieceTepItemResponse(): Observable<
    addOrPatchCutPieceTepItemInStockManagementResponse
  > {
    return this.patchCutPieceTepItemResponse$;
  }

  confirmCutPieceTepItem(
    id: string,
    requestPayload: confirmCutPieceTepItemInStockManagementPayload
  ) {
    this.store.dispatch(
      new TepActions.ConfirmCutPieceTepTransaction(id, requestPayload)
    );
  }

  getConfirmCutPieceTepItemResponse(): Observable<
    addOrPatchCutPieceTepItemInStockManagementResponse
  > {
    return this.confirmCutPieceTepItemResponse$;
  }

  getAvailableDiscountsList(): Observable<DiscountsList[]> {
    return this.availableDiscountsList$;
  }

  getStuddedProductGroupCodes(): Observable<string[]> {
    return this.studdedProductGroupCodes$;
  }

  getIsExceptionScenario(): Observable<boolean> {
    return this.isExceptionScenario$;
  }

  getholdTransactionMetalRates(): Observable<boolean> {
    return this.holdTransactionMetalRates$;
  }
}
