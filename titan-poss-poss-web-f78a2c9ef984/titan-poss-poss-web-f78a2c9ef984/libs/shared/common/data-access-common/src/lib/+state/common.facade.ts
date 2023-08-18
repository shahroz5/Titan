import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  AdvanceBookingDetailsResponse,
  CashMemoDetailsResponse,
  CommomStateAttributeNameEnum,
  CommomStateAttributeTypeEnum,
  CreditNote,
  PrintPayload,
  SetCOTotalProductValuesPayload,
  SetOrderValuesPayload,
  SetTotalProductValuesPayload,
  StatusTypesEnum,
  TolerancePayload,
  TransactionConfig
} from '@poss-web/shared/models';
import { Observable } from 'rxjs';
import * as CommonActions from './common.actions';
import {
  selectAcceptAdvanceAttributes,
  selectAdvanceBookingAttributes,
  selectBillCancellationAttributes,
  selectCashMemoAttributes,
  selectCOAttributes,
  selectDiscountAttributes,
  selectFocAttributes,
  selectGepAttributes,
  selectGiftCardAttributes,
  selectGlobalAttributes,
  selectGrfAttributes,
  selectGrnAttributes,
  selectInventoryAttributes,
  selectInvoiceAttributes,
  selectManualFocAttributes,
  selectMergeGrfAttributes,
  selectTepAttributes,
  selectWalkinsAttributes
} from './common.selectors';
import { CommonState } from './common.state';

@Injectable()
export class CommonFacade {
  constructor(private store: Store<CommonState>) {}

  getCommonFacadeAttributes(
    attributeType: CommomStateAttributeTypeEnum,
    attributeName: CommomStateAttributeNameEnum
  ): Observable<any> {
    switch (attributeType) {
      case CommomStateAttributeTypeEnum.GLOBAL:
        return this.store.select(selectGlobalAttributes(attributeName));
      case CommomStateAttributeTypeEnum.CASHMEMO:
        return this.store.select(selectCashMemoAttributes(attributeName));
      case CommomStateAttributeTypeEnum.ADVANCE_BOOKING:
        return this.store.select(selectAdvanceBookingAttributes(attributeName));
      case CommomStateAttributeTypeEnum.MERGE_GRF:
        return this.store.select(selectMergeGrfAttributes(attributeName));
      case CommomStateAttributeTypeEnum.GIFT_CARD:
        return this.store.select(selectGiftCardAttributes(attributeName));
      case CommomStateAttributeTypeEnum.ACCEPT_ADVANCE:
        return this.store.select(selectAcceptAdvanceAttributes(attributeName));
      case CommomStateAttributeTypeEnum.GRF:
        return this.store.select(selectGrfAttributes(attributeName));
      case CommomStateAttributeTypeEnum.TEP:
        return this.store.select(selectTepAttributes(attributeName));
      case CommomStateAttributeTypeEnum.WALKINS:
        return this.store.select(selectWalkinsAttributes(attributeName));
      case CommomStateAttributeTypeEnum.GEP:
        return this.store.select(selectGepAttributes(attributeName));
      case CommomStateAttributeTypeEnum.GRN:
        return this.store.select(selectGrnAttributes(attributeName));
      case CommomStateAttributeTypeEnum.FOC:
        return this.store.select(selectFocAttributes(attributeName));
      case CommomStateAttributeTypeEnum.MANUAL_FOC:
        return this.store.select(selectManualFocAttributes(attributeName));
      case CommomStateAttributeTypeEnum.UPDATE_INVOICE:
        return this.store.select(selectInvoiceAttributes(attributeName));
      case CommomStateAttributeTypeEnum.BILL_CANCELLATION:
        return this.store.select(
          selectBillCancellationAttributes(attributeName)
        );
      case CommomStateAttributeTypeEnum.DISCOUNT:
        return this.store.select(selectDiscountAttributes(attributeName));
      case CommomStateAttributeTypeEnum.INVENTORY:
        return this.store.select(selectInventoryAttributes(attributeName));
      case CommomStateAttributeTypeEnum.CUSTOMER_ORDER:
        return this.store.select(selectCOAttributes(attributeName));

      default:
        break;
    }
  }
  loadABStandardMetalPriceDetails() {
    this.store.dispatch(new CommonActions.LoadABStandardMetalPriceDetails());
  }
  loadCOStandardMetalPriceDetails() {
    this.store.dispatch(new CommonActions.LoadCOStandardMetalPriceDetails());
  }
  loadCMStandardMetalPriceDetails() {
    this.store.dispatch(new CommonActions.LoadCMStandardMetalPriceDetails());
  }
  loadTEPStandardMetalPriceDetails() {
    this.store.dispatch(new CommonActions.LoadTEPStandardMetalPriceDetails());
  }
  loadGRFStandardMetalPriceDetails() {
    this.store.dispatch(new CommonActions.LoadGRFStandardMetalPriceDetails());
  }

  setTransactionConfig(transactionConfig: TransactionConfig) {
    this.store.dispatch(
      new CommonActions.SetTransactionConfig(transactionConfig)
    );
  }

  setTransactionTD(transactionTD: string) {
    this.store.dispatch(new CommonActions.SetTransactionID(transactionTD));
  }

  setTcsCollectedAmount(tcsAmount: number) {
    this.store.dispatch(new CommonActions.SetTcsCollectedAmount(tcsAmount));
  }

  setTcsTcsAmountNeedToReset(payload: boolean) {
    this.store.dispatch(new CommonActions.SetTcsAmountNeedToReset(payload));
  }

  setABMinABVAlue(value: number) {
    this.store.dispatch(new CommonActions.SetABMinABVAlue(value));
  }
  setFrozenABVAlue(value: boolean) {
    this.store.dispatch(new CommonActions.SetFrozenMinABVAlue(value));
  }

  setFrozenCOVAlue(value: boolean) {
    this.store.dispatch(new CommonActions.SetFrozenMinCOVAlue(value));
  }
  setAbStatus(value: StatusTypesEnum) {
    this.store.dispatch(new CommonActions.SetAbStatus(value));
  }

  setminFrozenABVAlue(value: number) {
    this.store.dispatch(new CommonActions.SetMinFrozenVAlue(value));
  }

  setminFrozenCOVAlue(value: number) {
    this.store.dispatch(new CommonActions.SetMinFrozenCOVAlue(value));
  }
  updateABWeight(value: any) {
    this.store.dispatch(new CommonActions.UpdateABWeight(value));
  }
  updateCOWeight(value: any) {
    this.store.dispatch(new CommonActions.UpdateCOWeight(value));
  }
  setCMMinABVAlue(value: number) {
    this.store.dispatch(new CommonActions.SetCMMinABVAlue(value));
  }
  setTransactionTotalAmount(totalAmount: number) {
    this.store.dispatch(
      new CommonActions.SetTransactionTotalAmount(totalAmount)
    );
  }

  disableFullPaymentCheck(disable: boolean) {
    this.store.dispatch(new CommonActions.DisableFullPaymentCheck(disable));
  }

  clearTransactionTD() {
    this.store.dispatch(new CommonActions.ClearTransactionID());
  }

  clearTransactionConfig() {
    this.store.dispatch(new CommonActions.ClearTransactionConfig());
  }

  clearTolerance() {
    this.store.dispatch(new CommonActions.ClearTolerance());
  }

  clearCMGrfTolerance() {
    this.store.dispatch(new CommonActions.ClearCMGrfTolerance());
  }

  clearABGrfTolerance() {
    this.store.dispatch(new CommonActions.ClearABGrfTolerance());
  }

  clearCMGrnTolerance() {
    this.store.dispatch(new CommonActions.ClearCMGrnTolerance());
  }

  clearABGrnTolerance() {
    this.store.dispatch(new CommonActions.ClearABGrnTolerance());
  }

  clearTcsAmount() {
    this.store.dispatch(new CommonActions.ClearTcsAmount());
  }

  clearTcsCollectedAmount() {
    this.store.dispatch(new CommonActions.ClearTcsCollectedAmount());
  }

  loadCMPgDesc() {
    this.store.dispatch(new CommonActions.LoadCMPgDesc());
  }
  loadABPgDesc() {
    this.store.dispatch(new CommonActions.LoadABPgDesc());
  }
  loadBillCancellationPgDesc() {
    this.store.dispatch(new CommonActions.LoadBillCancellationPgDesc());
  }
  loadGRNPgDesc() {
    this.store.dispatch(new CommonActions.LoadGRNPgDesc());
  }

  loadABImageUrl(itemCode: string) {
    this.store.dispatch(new CommonActions.LoadABImageUrl(itemCode));
  }
  loadCMImageUrl(itemCode: string) {
    this.store.dispatch(new CommonActions.LoadCMImageUrl(itemCode));
  }
  loadBillCancellationImageUrl(itemCode: string) {
    this.store.dispatch(
      new CommonActions.LoadBillCancellationImageUrl(itemCode)
    );
  }
  loadGRNImageUrl(itemCode: string) {
    this.store.dispatch(new CommonActions.LoadGRNImageUrl(itemCode));
  }

  setConfigHoldTime(minutes: number) {
    this.store.dispatch(new CommonActions.SetHoldTime(minutes));
  }

  loadABPrintData(printdata: PrintPayload) {
    this.store.dispatch(new CommonActions.LoadABPrintDeatils(printdata));
  }

  loadFailedInvoices() {
    this.store.dispatch(new CommonActions.LoadFaileInvoicesDeatils());
  }

  loadCopiedInvoicesDocument() {
    this.store.dispatch(new CommonActions.LoadCopiedInvoicesDocument());
  }
  triggerFailedInvoices() {
    this.store.dispatch(new CommonActions.TriggerFailedInvoicesDetails());
  }
  loadCMPrintData(printdata: PrintPayload) {
    this.store.dispatch(new CommonActions.LoadCMPrintDeatils(printdata));
  }
  setGrnStatus(status: string) {
    this.store.dispatch(new CommonActions.SetGrnStatus(status));
  }
  setGrnTotalProducts(totalProducts: number) {
    this.store.dispatch(
      new CommonActions.SetGrnTotalReturnProducts(totalProducts)
    );
  }
  setGrnTotalValue(totalValue: number) {
    this.store.dispatch(new CommonActions.SetGrnTotalReturnValue(totalValue));
  }
  setGrnCreditNoteType(creditNoteType: string) {
    this.store.dispatch(new CommonActions.setGrnCreditNoteType(creditNoteType));
  }

  setABSelectedRsoName(rsoName: any) {
    this.store.dispatch(new CommonActions.SetABSelectedRsoName(rsoName));
  }
  setCMSelectedRsoName(rsoName: any) {
    this.store.dispatch(new CommonActions.SetCMSelectedRsoName(rsoName));
  }
  setGCSelectedRsoName(rsoName: any) {
    this.store.dispatch(new CommonActions.SetGCSelectedRsoName(rsoName));
  }

  setGcTotalCardsQty(qty: number) {
    this.store.dispatch(new CommonActions.SetGcTotalCardsQty(qty));
  }

  setGrfGoldWeight(goldWeight: number) {
    this.store.dispatch(new CommonActions.SetGrfGoldWeight(goldWeight));
  }

  setWalkInsCount(walkInsCount: number) {
    this.store.dispatch(new CommonActions.SetWalkInsCount(walkInsCount));
  }

  setWalkInsConversionCount(walkInsConversionCount: number) {
    this.store.dispatch(
      new CommonActions.SetWalkInsConversionCount(walkInsConversionCount)
    );
  }

  setIsWalkInsFormInvalid(isWalkInsFormInvalid: boolean) {
    this.store.dispatch(
      new CommonActions.SetIsWalkInsFormInvalid(isWalkInsFormInvalid)
    );
  }

  setTepTotalQty(tepTotalQty: number) {
    this.store.dispatch(new CommonActions.SetTepTotalQty(tepTotalQty));
  }

  setABFinalAmount(value: number) {
    this.store.dispatch(new CommonActions.SetABFinalAmount(value));
  }

  setCMFinalAmount(value: number, taxValue: number, otherCharges: any) {
    this.store.dispatch(
      new CommonActions.SetCMFinalAmount(value, taxValue, otherCharges)
    );
  }

  setCMOtherCharges(value: number) {
    this.store.dispatch(new CommonActions.SetCMOtherCharges(value));
  }

  setTepTotalExchangeAmt(tepTotalExchangeAmt: number) {
    this.store.dispatch(
      new CommonActions.SetTepTotalExchangeAmount(tepTotalExchangeAmt)
    );
  }

  setTepTotalRefundAmt(tepTotalRefundAmt: number) {
    this.store.dispatch(
      new CommonActions.SetTepTotalRefundAmount(tepTotalRefundAmt)
    );
  }

  setTcsAmount(tcsAmount: number) {
    this.store.dispatch(new CommonActions.SetTcsAmount(tcsAmount));
  }

  SetABGhsCustomerId(ghsCustomerId: number) {
    this.store.dispatch(new CommonActions.SetABGhsCustomerId(ghsCustomerId));
  }

  SetCMGhsCustomerId(ghsCustomerId: number) {
    this.store.dispatch(new CommonActions.SetCMGhsCustomerId(ghsCustomerId));
  }

  SetCMisLegacy(isLegacy: boolean) {
    this.store.dispatch(new CommonActions.SetCMisLegacy(isLegacy));
  }

  setTepTotalGrossWt(tepTotalGrossWt: number) {
    this.store.dispatch(new CommonActions.SetTepTotalGrossWt(tepTotalGrossWt));
  }

  setIsTepRefundFormValid(isValid: boolean) {
    this.store.dispatch(new CommonActions.SetIsTepRefundFormValid(isValid));
  }

  setIsTEPApprovalValid(isValid: boolean) {
    this.store.dispatch(new CommonActions.SetIsTepApprovalValid(isValid));
  }

  setIsTepRequestRaising(isRequestRaising: boolean) {
    this.store.dispatch(
      new CommonActions.SetIsTepRequestRaising(isRequestRaising)
    );
  }

  setTepSelectedPaymentMethod(selectedMethod: string) {
    this.store.dispatch(
      new CommonActions.SetTepSelectedPaymentMethod(selectedMethod)
    );
  }

  setSelectedTepType(selectedTepType?: string) {
    this.store.dispatch(new CommonActions.SetSelectedTepType(selectedTepType));
  }

  setCutPieceTepTotalQty(totalQty: number) {
    this.store.dispatch(new CommonActions.SetCutPieceTepTotalQty(totalQty));
  }

  setCutPieceTepTotalValue(totalValue: number) {
    this.store.dispatch(new CommonActions.SetCutPieceTepTotalValue(totalValue));
  }
  setMergingCns(mergingCns: CreditNote[]) {
    this.store.dispatch(new CommonActions.SetMergingCNs(mergingCns));
  }
  setConfigurationAmountForAdvance(payload: {
    amount: number;
    isPanCardMan: boolean;
  }) {
    this.store.dispatch(
      new CommonActions.SetConfigurationAmountAdvance(payload)
    );
  }
  loadMaxCashLimit(payload: { ruleType: string; requestBody: any }) {
    this.store.dispatch(new CommonActions.LoadMaxCashLimit(payload));
  }
  setFocItems(payload: any[]) {
    this.store.dispatch(new CommonActions.SetFocItems(payload));
  }

  setManualFocItems(payload: any[]) {
    this.store.dispatch(new CommonActions.SetManualFocItems(payload));
  }
  setFocEligibleWtAndQty(payload: { qty: number; wt: number }) {
    this.store.dispatch(new CommonActions.SetFocEligibleWtAndQty(payload));
  }
  loadABOccasions(lovType: string) {
    this.store.dispatch(new CommonActions.LoadABOccasions(lovType));
  }
  loadCMOccasions(lovType: string) {
    this.store.dispatch(new CommonActions.LoadCMOccasions(lovType));
  }

  clearCashMemo() {
    this.store.dispatch(new CommonActions.ClearCashMemo());
  }
  clearAdvanceBooking() {
    this.store.dispatch(new CommonActions.ClearAdvanceBooking());
  }

  confrimCashMemo() {
    this.store.dispatch(new CommonActions.ConfrimCashMemo());
  }
  holdCashMemo() {
    this.store.dispatch(new CommonActions.HoldCashMemo());
  }
  convertToAdvance() {
    this.store.dispatch(new CommonActions.ConvertToAdvance());
  }

  setABTotalProductValues(totalValues: SetTotalProductValuesPayload) {
    this.store.dispatch(new CommonActions.SetABTotalProductValues(totalValues));
  }
  setCMTotalProductValues(totalValues: SetTotalProductValuesPayload) {
    this.store.dispatch(new CommonActions.SetCMTotalProductValues(totalValues));
  }
  setCMOrderValues(totalValues: SetOrderValuesPayload) {
    this.store.dispatch(new CommonActions.SetCMOrderValues(totalValues));
  }

  setFinalAmount(finalAmt: number) {
    this.store.dispatch(new CommonActions.SetFinalAmount(finalAmt));
  }

  setBillCancellationTotalProductValues(
    totalValues: SetTotalProductValuesPayload
  ) {
    this.store.dispatch(
      new CommonActions.SetBillCancellationTotalProductValues(totalValues)
    );
  }
  setGEPTotalProductValues(totalValues: SetTotalProductValuesPayload) {
    this.store.dispatch(
      new CommonActions.SetGEPTotalProductValues(totalValues)
    );
  }

  setABOrderNumber(orderNumber: {
    orderNo: number;
    status: StatusTypesEnum | string;
  }) {
    this.store.dispatch(new CommonActions.SetABOrderNumber(orderNumber));
  }
  setCMOrderNumber(orderNumber: {
    orderNo: number;
    status: StatusTypesEnum | string;
  }) {
    this.store.dispatch(new CommonActions.SetCMOrderNumber(orderNumber));
  }
  setGEPOrderNumber(orderNumber: {
    orderNo: number;
    status: StatusTypesEnum | string;
  }) {
    this.store.dispatch(new CommonActions.SetGEPOrderNumber(orderNumber));
  }
  setGrfOrderNumber(orderNumber: {
    orderNo: number;
    status: StatusTypesEnum | string;
  }) {
    this.store.dispatch(new CommonActions.SetGrfOrderNumber(orderNumber));
  }
  setAcceptAdvanceOrderNumber(orderNumber: {
    orderNo: number;
    status: StatusTypesEnum | string;
  }) {
    this.store.dispatch(
      new CommonActions.SetAcceptAdvanceOrderNumber(orderNumber)
    );
  }
  setGcOrderNumber(orderNumber: {
    orderNo: number;
    status: StatusTypesEnum | string;
  }) {
    this.store.dispatch(new CommonActions.SetGcOrderNumber(orderNumber));
  }
  setTepOrderNumber(orderNumber: {
    orderNo: number;
    status: StatusTypesEnum | string;
  }) {
    this.store.dispatch(new CommonActions.SetTepOrderNumber(orderNumber));
  }
  setComponentInstance(data) {
    this.store.dispatch(new CommonActions.SetComponentInstance(data));
  }

  setABErrorInUpdatePrice(isError: boolean) {
    this.store.dispatch(new CommonActions.SetABErrorInUpdatePrice(isError));
  }
  setCMErrorInUpdatePrice(isError: boolean) {
    this.store.dispatch(new CommonActions.SetCMErrorInUpdatePrice(isError));
  }
  setAbDetails(abDetails: AdvanceBookingDetailsResponse) {
    this.store.dispatch(new CommonActions.SetAbDetails(abDetails));
  }
  setPartialCmDetails(partialCmDetails: CashMemoDetailsResponse) {
    this.store.dispatch(
      new CommonActions.SetPartialCashMemoDetails(partialCmDetails)
    );
  }

  loadMetalTypes() {
    this.store.dispatch(new CommonActions.LoadMetalTypes());
  }

  loadTolerance(inputData: TolerancePayload) {
    this.store.dispatch(new CommonActions.LoadTolerance(inputData));
  }

  loadABTolerance(inputData: TolerancePayload) {
    this.store.dispatch(new CommonActions.LoadABTolerance(inputData));
  }

  loadCMGrfTolerance(inputData: TolerancePayload) {
    this.store.dispatch(new CommonActions.LoadCMGrfTolerance(inputData));
  }

  loadABGrfTolerance(inputData: TolerancePayload) {
    this.store.dispatch(new CommonActions.LoadABGrfTolerance(inputData));
  }

  loadCMGrnTolerance(inputData: TolerancePayload) {
    this.store.dispatch(new CommonActions.LoadCMGrnTolerance(inputData));
  }

  loadABGrnTolerance(inputData: TolerancePayload) {
    this.store.dispatch(new CommonActions.LoadABGrnTolerance(inputData));
  }

  setSameMergeGrfCustomer(isSameCustomer: boolean) {
    this.store.dispatch(
      new CommonActions.SetSameMergeGrfCustomer(isSameCustomer)
    );
  }
  setFileUploadVisible(isVisible: boolean) {
    this.store.dispatch(new CommonActions.SetFileUploadVisible(isVisible));
  }
  setDiscountDetails(data: any) {
    this.store.dispatch(new CommonActions.SetDiscountDetails(data));
  }
  clearCmImageUrl() {
    this.store.dispatch(new CommonActions.LoadCMImageUrlSuccess(null));
  }
  setGrnWorkflowFlag(isWorkflowRequired: boolean) {
    this.store.dispatch(
      new CommonActions.setGrnWorkflowFlag(isWorkflowRequired)
    );
  }
  closeTolerance(isClose: boolean) {
    this.store.dispatch(new CommonActions.CloseTolerance(isClose));
  }

  // Inventory Image Loading
  loadImageCatalogueDetails() {
    this.store.dispatch(new CommonActions.LoadImageCatalogueDetails());
  }

  // CO
  setCOTotalProductValues(totalValues: SetCOTotalProductValuesPayload) {
    this.store.dispatch(new CommonActions.SetCOTotalProductValues(totalValues));
  }

  setMinCOValue(minValue: number) {
    this.store.dispatch(new CommonActions.SetMinCOVAlue(minValue));
  }

  setCOOrderNumber(orderNumber: {
    orderNo: number;
    status: StatusTypesEnum | string;
  }) {
    this.store.dispatch(new CommonActions.SetCOOrderNumber(orderNumber));
  }

  clearCustomerOrder() {
    this.store.dispatch(new CommonActions.ClearCustomerOrder());
  }

  //IGST in Cashmemo
  setIsIGSTFlag(isIGSTFlag: boolean) {
    this.store.dispatch(new CommonActions.SetIsIGSTFlag(isIGSTFlag));
  }

  resetInvoices() {
    this.store.dispatch(new CommonActions.ResetInvoices());
  }
}
