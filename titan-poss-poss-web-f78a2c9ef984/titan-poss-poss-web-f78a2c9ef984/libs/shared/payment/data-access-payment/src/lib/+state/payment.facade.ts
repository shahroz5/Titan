import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as PaymentActions from './payment.actions';
import { PaymentSelectors } from './payment.selectors';
import { PaymentState } from './payment.state';
import {
  TransactionTypeEnum,
  UpdateUnipayPaylaod,
  PaymentPayload,
  UniPayRequest,
  QCGCGetBalancePayload,
  EditCashPaymentPayload,
  LoadMaxCashLimitPayload,
  LoadPaymentDetailsPayload,
  DeletePaymentPayload,
  ValidatePaymentPayload,
  ResendPaymentLinkPayload,
  PaymentDetails,
  IntegratedPaymentRequestPayload,
  CmRequestDetailsPayload,
  CNListRequestPayload,
  InvokeCNRequestPayload,
  GVStatusListingPayload,
  ThirdPartyCNRequestPayload,
  GHSAttachmentsPayload,
  GenerateOtpPayload,
  CreditNotePayment,
  DigiGetBalancePayload,
  GenerateOtpDigiGoldPayload,
  LoadEmployeeDetailsPayload,
  PaymentModeEnum,
  ValidateCashBackPayload,
  FileUploadDownloadPayload,
  UpdatePaymentDetailsForVoidUnipayPayload
} from '@poss-web/shared/models';

@Injectable()
export class PaymentFacade {
  constructor(private store: Store<PaymentState>) {}

  private error$ = this.store.select(PaymentSelectors.selectError);

  private rsoList$ = this.store.select(PaymentSelectors.selectRsoList);

  private isLoading$ = this.store.select(PaymentSelectors.selectIsLoading);

  private isUnipayLoading$ = this.store.select(
    PaymentSelectors.selectIsUnipayLoading
  );
  private isChequeDDPaymentSuccess$ = this.store.select(
    PaymentSelectors.selectIsChequeDDPaymentSuccess
  );
  private allowedPayments$ = this.store.select(
    PaymentSelectors.selectAllowedPayments
  );

  private payeeBanks$ = this.store.select(PaymentSelectors.selectPayeeBanks);

  private ddPayerBanks$ = this.store.select(
    PaymentSelectors.selectDDPayerBanks
  );
  private chequePayerBanks$ = this.store.select(
    PaymentSelectors.selectChequePayerBanks
  );
  private cardConfig$ = this.store.select(PaymentSelectors.selectCardConfig);

  private wallets$ = this.store.select(PaymentSelectors.selectWallets);
  private subBankLoans$ = this.store.select(
    PaymentSelectors.selectSubBankLoans
  );
  private paymentFieldNames$ = this.store.select(
    PaymentSelectors.selectPaymentFieldNames
  );

  private paymentDetails$ = this.store.select(
    PaymentSelectors.selectPaymentDetails
  );

  private unipaytransactionId$ = this.store.select(
    PaymentSelectors.getUnipayTransactionId
  );
  private getUnipayResponseDetials$ = this.store.select(
    PaymentSelectors.getUnipayResponse
  );
  private getUnipayVoidResponseDetials$ = this.store.select(
    PaymentSelectors.getUnipayVoidResponse
  );

  private totalPaidAmount$ = this.store.select(
    PaymentSelectors.selectTotalPaidAmount
  );

  private customerSpecificPayments$ = this.store.select(
    PaymentSelectors.selectCustomerSpecificPayments
  );

  private failedGV$ = this.store.select(PaymentSelectors.getFailedGV);

  private customerSpecificWalletPayments$ = this.store.select(
    PaymentSelectors.selectCustomerSpecificWalletPayments
  );
  private customerSpecificBankLoanPayments$ = this.store.select(
    PaymentSelectors.selectcustomerSpecificBankLoanPayments
  );
  private hasCustomerSpecificPayments$ = this.store.select(
    PaymentSelectors.selectHasCustomerSpecificPayments
  );

  private isEncirclePaymentAdded$ = this.store.select(
    PaymentSelectors.selectIsEncirclePaymentAdded
  );

  private selectMaxCashLimit$ = this.store.select(
    PaymentSelectors.selectMaxCashLimit
  );

  private selectMaxCashLimitDetails$ = this.store.select(
    PaymentSelectors.selectMaxCashLimitDetails
  );

  private cashAmountMaxCap$ = this.store.select(
    PaymentSelectors.selectCashAmountMaxCap
  );

  private selectCurrrentConfirmedPayment$ = this.store.select(
    PaymentSelectors.selectConfirmedPayment
  );

  private loadMaxCashLimit$ = this.store.select(
    PaymentSelectors.selectLoadMaxCashLimit
  );

  private isUnipayEnabled$ = this.store.select(
    PaymentSelectors.selectUnipayEnabled
  );

  private getQCGCDetails$ = this.store.select(PaymentSelectors.getQCGCBalance);
  private getDigiDetails$ = this.store.select(
    PaymentSelectors.selectDigiBalance
  );
  private getDigiSellingPrice$ = this.store.select(
    PaymentSelectors.selectDigiSellingPrice
  );
  private getGVDetails$ = this.store.select(PaymentSelectors.getGVBalance);
  private getGHSeVoucherDetails$ = this.store.select(
    PaymentSelectors.getGHSeVoucherBalance
  );
  private paymentRequestStatus$ = this.store.select(
    PaymentSelectors.selectPaymentStatus
  );

  private isChequeAdded$ = this.store.select(
    PaymentSelectors.selectIsChequeAdded
  );

  private isDDAdded$ = this.store.select(PaymentSelectors.selectIsDDAdded);

  private isGHSAccounts$ = this.store.select(
    PaymentSelectors.selectIsGHSAccounts
  );

  private isCreditNoteAdded$ = this.store.select(
    PaymentSelectors.selectIsCreditNoteAdded
  );

  private encirclePoints$ = this.store.select(
    PaymentSelectors.selectEncirclePoints
  );

  //AIRPAT INT
  private getAirpaySendLinkResponse$ = this.store.select(
    PaymentSelectors.selectAirpaySendLinkResponse
  );

  private getAirpayOpenPayments$ = this.store.select(
    PaymentSelectors.selectOpenAirpayPaymentDetails
  );

  //Razorpay
  private getRazorSendLinkResponse$ = this.store.select(
    PaymentSelectors.selectRazorpaySendLinkResponse
  );

  private roPaymentRequest$ = this.store.select(
    PaymentSelectors.selectRoPaymentRequest
  );
  private paymentRequest$ = this.store.select(
    PaymentSelectors.selectIntegratedPaymentRequest
  );

  private creditNoteList$ = this.store.select(PaymentSelectors.selectCnList);

  private thirdPartyCNList$ = this.store.select(
    PaymentSelectors.selectThirdPartyCnList
  );

  private creditNoteDetails$ = this.store.select(
    PaymentSelectors.selectCNDetails
  );
  private invokedCreditNote$ = this.store.select(
    PaymentSelectors.selectInvokedCreditNote
  );
  private getGHSAccountDetails$ = this.store.select(
    PaymentSelectors.getGHSAccountDetails
  );
  private getGHSAttachments$ = this.store.select(
    PaymentSelectors.selectGHSAttachments
  );
  private isOtpGeneratedForCn$ = this.store.select(
    PaymentSelectors.selectIsOtpGenerated
  );
  private isOtpGeneratedForEmpLoan$ = this.store.select(
    PaymentSelectors.selectIsEmpLoanOtpGenerated
  );
  private isDigiOtpGenerated$ = this.store.select(
    PaymentSelectors.selectIsDigiOtpGenerated
  );
  private isAddGHSPaymentSuccess$ = this.store.select(
    PaymentSelectors.selectIsAddGHSSuccess
  );

  private isResendLinkRazorPaySuccess$ = this.store.select(
    PaymentSelectors.selectIsResendLinkRazorPay
  );

  private isValidateRazorPay$ = this.store.select(
    PaymentSelectors.selectIsValidateRazorPay
  );
  private ghsCustomerId$ = this.store.select(
    PaymentSelectors.selectGHSCustomerId
  );
  private ghsPrimaryCustomerId$ = this.store.select(
    PaymentSelectors.selectGHSPrimaryCustomerId
  );
  private ghsResponse$ = this.store.select(PaymentSelectors.selectGHSResponse);

  private creditNoteDetail$ = this.store.select(
    PaymentSelectors.selectCreditNoteDetail
  );

  private lastdeletedPayment$ = this.store.select(
    PaymentSelectors.lastDeletedPayment
  );

  private discountIdsInCreditNote$ = this.store.select(
    PaymentSelectors.selectDiscountIdsInCreditNote
  );

  private isEncirclePaymentAddedRes$ = this.store.select(
    PaymentSelectors.IsEncirclePaymentAddedRes
  );

  private creditNoteToBeDeleted$ = this.store.select(
    PaymentSelectors.selectSelectedCreditNoteForDeletion
  );

  private newDigiGoldPayment$ = this.store.select(
    PaymentSelectors.selectDigiGoldPayment
  );

  private creditNotePaymentToBeAdded$ = this.store.select(
    PaymentSelectors.selectSelectedCreditNoteForAddition
  );

  private creditNotePaymentAddedField$ = this.store.select(
    PaymentSelectors.selectCreditNotePaymentAddedField
  );

  private creditNotePaymentAddedRes$ = this.store.select(
    PaymentSelectors.selectCreditNotePaymentAddedRes
  );

  private getGhsPaymentDetails$ = this.store.select(
    PaymentSelectors.selectAllGhsPaymentDetails
  );
  private isPaymentDeleted$ = this.store.select(
    PaymentSelectors.selectIsPaymentDeleted
  );

  private isGRFCNAdded$ = this.store.select(
    PaymentSelectors.selectIsGRFCNAdded
  );

  private empLoanDetails$ = this.store.select(
    PaymentSelectors.selectEmpLoanDetails
  );

  private cashBackOfferBankDetails$ = this.store.select(
    PaymentSelectors.selectCashBackOfferBankDetails
  );

  private cashBackOfferConfigDetails$ = this.store.select(
    PaymentSelectors.selectCashBackOfferConfigDetails
  );

  private isCashBackOfferCardValidated$ = this.store.select(
    PaymentSelectors.selectIsVaidateCashbackOfferCard
  );

  private fileUpload$ = this.store.select(PaymentSelectors.selectFileUploadRes);

  private fileUploadList$ = this.store.select(
    PaymentSelectors.selectFileUploadListRes
  );

  private fileDownload$ = this.store.select(
    PaymentSelectors.selectFileDownloadUrl
  );

  private updatePaymentStatusForVoidUnipayRes$ = this.store.select(
    PaymentSelectors.selectUpdatePaymentStatusForVoidUnipayRes
  );

  private errorWhileUpdatingPaymentStatusForVoidUnipay$ = this.store.select(
    PaymentSelectors.selectErrorWhileUpdatingPaymentStatusForVoidUnipay
  );

  private updateCNStatusForVoidUnipayRes$ = this.store.select(
    PaymentSelectors.selectUpdateCNStatusForVoidUnipayRes
  );

  private errorWhileUpdatingCNStatusForVoidUnipay$ = this.store.select(
    PaymentSelectors.selectErrorWhileUpdatingCNStatusForVoidUnipay
  );

  getGeneratedOtpForCn() {
    return this.isOtpGeneratedForCn$;
  }

  getGeneratedOtpForEmpLoan() {
    return this.isOtpGeneratedForEmpLoan$;
  }

  getGeneratedOtpForDigi() {
    return this.isDigiOtpGenerated$;
  }

  getEncirclePoints() {
    return this.encirclePoints$;
  }

  failedGV() {
    return this.failedGV$;
  }

  getCNDetails() {
    return this.creditNoteDetails$;
  }

  getIsChequeAdded() {
    return this.isChequeAdded$;
  }

  getDeletedPayment() {
    return this.lastdeletedPayment$;
  }

  getDigiGoldPayment() {
    return this.newDigiGoldPayment$;
  }

  getIsDDAdded() {
    return this.isDDAdded$;
  }
  getGHSAccountsAdded() {
    return this.isGHSAccounts$;
  }

  getIsCreditNoteAdded() {
    return this.isCreditNoteAdded$;
  }

  getRoPaymentRequest() {
    return this.roPaymentRequest$;
  }
  getPaymentRequest() {
    return this.paymentRequest$;
  }
  getIntegratedPaymentRequestStatus() {
    return this.paymentRequestStatus$;
  }
  getRsoList() {
    return this.rsoList$;
  }

  getError() {
    return this.error$;
  }

  getIsLoading() {
    return this.isLoading$;
  }

  getIsUnipayLoading() {
    return this.isUnipayLoading$;
  }

  getIsChequeDDPaymentSuccess() {
    return this.isChequeDDPaymentSuccess$;
  }

  getAllowedPayments() {
    return this.allowedPayments$;
  }

  getDigiDetails() {
    return this.getDigiDetails$;
  }

  getDigiSellingPrice() {
    return this.getDigiSellingPrice$;
  }

  getDDPayerBanks() {
    return this.ddPayerBanks$;
  }

  getCurrentConfirmedPayment() {
    return this.selectCurrrentConfirmedPayment$;
  }
  getChequePayerBanks() {
    return this.chequePayerBanks$;
  }

  getCardConfig() {
    return this.cardConfig$;
  }

  getWallets() {
    return this.wallets$;
  }
  getSubBankLoans() {
    return this.subBankLoans$;
  }
  getPaymentFieldNames() {
    return this.paymentFieldNames$;
  }

  getMaxCashLimit() {
    return this.selectMaxCashLimit$;
  }

  getMaxCashLimitDetails() {
    return this.selectMaxCashLimitDetails$;
  }
  getCashAmountMaxCap() {
    return this.cashAmountMaxCap$;
  }

  getCustomerSpecificPayments() {
    return this.customerSpecificPayments$;
  }

  getIsEncirclePaymentAddedRes() {
    return this.isEncirclePaymentAddedRes$;
  }
  getCustomerSpecificWalletPayments() {
    return this.customerSpecificWalletPayments$;
  }
  getCustomerSpecificBankLoanPayments() {
    return this.customerSpecificBankLoanPayments$;
  }

  getUnipayTransactionID() {
    return this.unipaytransactionId$;
  }
  getUnipayResponse() {
    return this.getUnipayResponseDetials$;
  }
  getUnipayVoidResponse() {
    return this.getUnipayVoidResponseDetials$;
  }

  getPayeeBanks() {
    return this.payeeBanks$;
  }
  getQCGCBalanceDetails() {
    return this.getQCGCDetails$;
  }
  getGVBalanceDetails() {
    return this.getGVDetails$;
  }
  getGHSeVoucherBalanceDetails() {
    return this.getGHSeVoucherDetails$;
  }
  getPaymentDetails() {
    return this.paymentDetails$;
  }
  getLoadMaxCashLimit() {
    return this.loadMaxCashLimit$;
  }

  getTotalPaidAmount() {
    return this.totalPaidAmount$;
  }
  getIsHostConfigEnabled() {
    return this.isUnipayEnabled$;
  }

  getHasCustomerSpecificPayments() {
    return this.hasCustomerSpecificPayments$;
  }

  getIsEncirclePaymentAdded() {
    return this.isEncirclePaymentAdded$;
  }
  //AIRPAY INT
  getAirpaySendLinkResponse() {
    return this.getAirpaySendLinkResponse$;
  }
  getAirpayOpenPayementDetails() {
    return this.getAirpayOpenPayments$;
  }
  //Razorpay
  getRazorpaySendLinkResponse() {
    return this.getRazorSendLinkResponse$;
  }

  getCreditNoteList() {
    return this.creditNoteList$;
  }

  getThirdPartyCnList() {
    return this.thirdPartyCNList$;
  }

  getInvokedCreditNote() {
    return this.invokedCreditNote$;
  }

  getGHSAccountDetails() {
    return this.getGHSAccountDetails$;
  }
  getGHSAttachments() {
    return this.getGHSAttachments$;
  }
  getIsAddGhsPaymentSuccess() {
    return this.isAddGHSPaymentSuccess$;
  }
  getIsResendLinkRazorPaySuccess() {
    return this.isResendLinkRazorPaySuccess$;
  }
  getIsValidateRazorPay() {
    return this.isValidateRazorPay$;
  }
  getGhsCustomerId() {
    return this.ghsCustomerId$;
  }
  getGhsPrimaryCustomerId() {
    return this.ghsPrimaryCustomerId$;
  }

  getGhsResponse() {
    return this.ghsResponse$;
  }

  getCreditNoteDetail() {
    return this.creditNoteDetail$;
  }

  getDiscountIdsInCreditNote() {
    return this.discountIdsInCreditNote$;
  }

  getCreditNotePaymentToBeDeleted() {
    return this.creditNoteToBeDeleted$;
  }

  getCreditNotePaymentToBeAdded() {
    return this.creditNotePaymentToBeAdded$;
  }

  getCreditNotePaymentAddedField() {
    return this.creditNotePaymentAddedField$;
  }

  getCreditNotePaymentAddedRes() {
    return this.creditNotePaymentAddedRes$;
  }

  getGhsPaymentDetails() {
    return this.getGhsPaymentDetails$;
  }
  getIsPaymentDeleted() {
    return this.isPaymentDeleted$;
  }

  getIsGRFCNAdded() {
    return this.isGRFCNAdded$;
  }

  getEmpLoanDetails() {
    return this.empLoanDetails$;
  }

  getCashBackOfferBankDetails() {
    return this.cashBackOfferBankDetails$;
  }

  getCashBackOfferConfigDetails() {
    return this.cashBackOfferConfigDetails$;
  }

  getIsValidateCashBackOfferCard() {
    return this.isCashBackOfferCardValidated$;
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

  getUpdatePaymentStatusForVoidUnipayRes() {
    return this.updatePaymentStatusForVoidUnipayRes$;
  }

  getErrorWhileUpdatingPaymentStatusForVoidUnipay() {
    return this.errorWhileUpdatingPaymentStatusForVoidUnipay$;
  }

  getUpdateCNStatusForVoidUnipayRes() {
    return this.updateCNStatusForVoidUnipayRes$;
  }

  getErrorWhileUpdatingCNStatusForVoidUnipay() {
    return this.errorWhileUpdatingCNStatusForVoidUnipay$;
  }

  loadAllowedPayments(transactionType: TransactionTypeEnum) {
    this.store.dispatch(
      new PaymentActions.LoadAllowedPayments(transactionType)
    );
  }

  loadPaymentDetails(payload: LoadPaymentDetailsPayload) {
    this.store.dispatch(new PaymentActions.LoadPaymentDetails(payload));
  }

  loadCreditNoteDetails(payload: LoadPaymentDetailsPayload) {
    this.store.dispatch(new PaymentActions.LoadCreditNoteDetails(payload));
  }

  clearPaymentDetails() {
    this.store.dispatch(new PaymentActions.ClearPaymentDetails());
  }

  deletePayment(
    payload: DeletePaymentPayload,
    deletedPayemnt?: PaymentDetails
  ) {
    this.store.dispatch(
      new PaymentActions.DeletePayment(payload, deletedPayemnt)
    );
  }
  voidUnipayPayment(request: UniPayRequest) {
    this.store.dispatch(new PaymentActions.VoidUnipayPayment(request));
  }
  getQCGCBalance(request: QCGCGetBalancePayload) {
    this.store.dispatch(new PaymentActions.GetQCGCBalance(request));
  }
  getDigiBalance(request: DigiGetBalancePayload) {
    this.store.dispatch(new PaymentActions.GetDigiBalance(request));
  }

  sendDigiOTP(request: GenerateOtpDigiGoldPayload) {
    this.store.dispatch(new PaymentActions.GenerateOtpForDigiGold(request));
  }

  getDigiPrice(request: DigiGetBalancePayload) {
    this.store.dispatch(new PaymentActions.GetDigiPrice(request));
  }
  getGHSeVoucherBalance(request: QCGCGetBalancePayload) {
    this.store.dispatch(new PaymentActions.GetGHSeVoucherBalance(request));
  }
  loadGHSAccountDetails(accountNumber: string) {
    this.store.dispatch(new PaymentActions.GetGHSAccountDetails(accountNumber));
  }
  loadGHSAttachments(payload: GHSAttachmentsPayload) {
    this.store.dispatch(new PaymentActions.GetGHSAttachments(payload));
  }
  startUnipayPayment(request: UniPayRequest) {
    this.store.dispatch(new PaymentActions.StartUnipayPayment(request));
  }

  updateUniPayPayment(paymentPayload: UpdateUnipayPaylaod) {
    this.store.dispatch(new PaymentActions.UpdateUnipayPayment(paymentPayload));
  }

  resetData() {
    this.store.dispatch(new PaymentActions.ResetTrasactionID());
  }

  resetFailedGV() {
    this.store.dispatch(new PaymentActions.ResetFailedGV());
  }

  resetIsEncircleAdded() {
    this.store.dispatch(new PaymentActions.ResetEncirclePaymentAdded());
  }
  addChequeDDPayment(payload: PaymentPayload) {
    this.store.dispatch(new PaymentActions.AddChequeDDPayment(payload));
  }

  addCashPayment(paymentPayload: PaymentPayload) {
    this.store.dispatch(new PaymentActions.AddCashPayment(paymentPayload));
  }
  addCardPayment(paymentPayload: PaymentPayload) {
    this.store.dispatch(new PaymentActions.AddCardPayment(paymentPayload));
  }

  addROPayment(paymentPayload: PaymentPayload) {
    this.store.dispatch(new PaymentActions.AddROPayment(paymentPayload));
  }

  addManualPayment(paymentPayload: PaymentPayload) {
    this.store.dispatch(new PaymentActions.AddManualPayment(paymentPayload));
  }

  sendIntegratedPaymentRequest(payload: IntegratedPaymentRequestPayload) {
    this.store.dispatch(new PaymentActions.SendPaymentRequest(payload));
  }

  addEncirclePointsPayment(paymentPayload: PaymentPayload) {
    this.store.dispatch(
      new PaymentActions.AddEncirclePointsPayment(paymentPayload)
    );
  }
  loadGVBalance(payload: GVStatusListingPayload) {
    this.store.dispatch(new PaymentActions.GetGVBalance(payload));
  }

  removeGV(payload: string) {
    this.store.dispatch(new PaymentActions.RemoveGV(payload));
  }

  addQCGCPayment(paymentPayload: PaymentPayload) {
    this.store.dispatch(new PaymentActions.AddQCGCPayment(paymentPayload));
  }

  addDigiPayment(paymentPayload: PaymentPayload) {
    this.store.dispatch(new PaymentActions.AddDigiPayment(paymentPayload));
  }

  addGVPayment(paymentPayload: PaymentPayload) {
    this.store.dispatch(new PaymentActions.AddGVPayment(paymentPayload));
  }
  addGHSeVoucherPayment(paymentPayload: PaymentPayload) {
    this.store.dispatch(
      new PaymentActions.AddGHSeVoucherPayment(paymentPayload)
    );
  }

  addUnipayPayment(paymentPayload: PaymentPayload) {
    this.store.dispatch(new PaymentActions.AddUnipayPayment(paymentPayload));
  }

  editCashPayment(editPayload: EditCashPaymentPayload) {
    this.store.dispatch(new PaymentActions.EditCashPayment(editPayload));
  }

  resetQCGC() {
    this.store.dispatch(new PaymentActions.ResetQCGC());
  }

  resetCreditNoteList() {
    this.store.dispatch(new PaymentActions.ResetCreditNoteList());
  }
  resetInvokedCreditNote() {
    this.store.dispatch(new PaymentActions.ResetInvokedCreditNote());
  }
  resetGHSeVoucher() {
    this.store.dispatch(new PaymentActions.ResetGHSeVoucher());
  }
  addWalletPayment(paymentPayload: PaymentPayload) {
    this.store.dispatch(new PaymentActions.AddWalletPayment(paymentPayload));
  }

  addCreditNotePayment(paymentPayload: PaymentPayload) {
    this.store.dispatch(
      new PaymentActions.AddCreditNotePayment(paymentPayload)
    );
  }

  addEmployeeLoanPayment(paymentPayload: PaymentPayload) {
    this.store.dispatch(
      new PaymentActions.AddEmployeeLoanPayment(paymentPayload)
    );
  }

  addBankLoanPayment(paymentPayload: PaymentPayload) {
    this.store.dispatch(new PaymentActions.AddBankLoanPayment(paymentPayload));
  }
  addAirpayPayment(paymentPayload: PaymentPayload) {
    this.store.dispatch(new PaymentActions.AddAirpayPayment(paymentPayload));
  }
  addRtgsPayment(paymentPayload: PaymentPayload) {
    this.store.dispatch(new PaymentActions.AddRtgsPayment(paymentPayload));
  }
  addGHSAccountPayment(paymentPayload: PaymentPayload) {
    this.store.dispatch(
      new PaymentActions.AddGHSAccountPayment(paymentPayload)
    );
  }
  addUPIPayment(paymentPayload: PaymentPayload) {
    this.store.dispatch(new PaymentActions.AddUPIPayment(paymentPayload));
  }
  loadMaxCashLimit(payload: LoadMaxCashLimitPayload) {
    this.store.dispatch(new PaymentActions.LoadMaxCashLimit(payload));
  }
  resetCashPaymentAmount(payload: { paymentId: string }) {
    this.store.dispatch(new PaymentActions.ResetCashPaymentAmount(payload));
  }
  loadUnipayHostConfiguration() {
    this.store.dispatch(new PaymentActions.UnipayHostConfiguration());
  }
  resetPayment() {
    this.store.dispatch(new PaymentActions.ResetPayment());
  }
  //AIRIPAY
  startAirpayIntPayment(payload: PaymentPayload) {
    this.store.dispatch(new PaymentActions.StartAirpayIntPayment(payload));
  }
  updateintegratedPaymentRequest(payload: string) {
    this.store.dispatch(new PaymentActions.UpdateIntPayment(payload));
  }
  validateIntegratedPaymentRequest(payload: string) { 
    this.store.dispatch(new PaymentActions.ValidateIntPayment(payload));
  }
  loadAirpayOpenPayments(payload: LoadPaymentDetailsPayload) {
    this.store.dispatch(
      new PaymentActions.LoadOpenAirpayPaymentDetails(payload)
    );
  }
  updateAirpayPaymentStatus(payload: PaymentDetails) {
    this.store.dispatch(
      new PaymentActions.UpdateAirpayIntPaymentStatus(payload)
    );
  }
  //Razorpay
  startRazorpayPayment(payload: PaymentPayload) {
    this.store.dispatch(new PaymentActions.StartRazorpayPayment(payload));
  }
  updateRazorpayPayment(payload: ResendPaymentLinkPayload) {
    this.store.dispatch(new PaymentActions.UpdateRazorpayPayment(payload));
  }
  updateRazorpayPaymentStatus(payload: PaymentDetails) {
    this.store.dispatch(
      new PaymentActions.UpdateRazorpayPaymentStatus(payload)
    );
  }
  validateRazorpayPayment(payload: ValidatePaymentPayload) {
    this.store.dispatch(new PaymentActions.ValidateRazorpayPayment(payload));
  }
  validateEncirclePayment(payload: ValidatePaymentPayload) {
    this.store.dispatch(new PaymentActions.ValidatePayment(payload));
  }

  confirmPayment(editPayload: EditCashPaymentPayload) {
    this.store.dispatch(new PaymentActions.ConfirmPayment(editPayload));
  }

  loadRSOList() {
    this.store.dispatch(new PaymentActions.LoadRSOList());
  }

  loadROPaymentRequestStatus(payload: string) {
    this.store.dispatch(new PaymentActions.LoadROPaymentRequestStatus(payload));
  }

  loadPaymentRequestStatus(payload: string, paymentMode: PaymentModeEnum) {
    this.store.dispatch(
      new PaymentActions.LoadPaymentRequestStatus(payload, paymentMode)
    );
  }

  loadEncireclePoints(payload: string) {
    this.store.dispatch(new PaymentActions.LoadEncireclePoints(payload));
  }

  loadCMPaymentDetails(payload: CmRequestDetailsPayload) {
    this.store.dispatch(
      new PaymentActions.LoadCMRequestPaymentDetails(payload)
    );
  }

  loadCreditNoteList(payload: CNListRequestPayload) {
    this.store.dispatch(new PaymentActions.GetCreditNoteList(payload));
  }

  loadThirdPartyCnList(payload: ThirdPartyCNRequestPayload) {
    this.store.dispatch(new PaymentActions.GetThirdPartyCNList(payload));
  }

  loadInvokedCreditNote(payload: InvokeCNRequestPayload) {
    this.store.dispatch(new PaymentActions.GetInvokedCreditNote(payload));
  }

  loadIsOtpGenerated(payload: GenerateOtpPayload) {
    this.store.dispatch(new PaymentActions.GenerateOtpForCn(payload));
  }

  loadEmpLoanOtpGenerate(payload: GenerateOtpPayload) {
    this.store.dispatch(new PaymentActions.GenerateOtpForEmpLoan(payload));
  }

  loadCreditNoteDetail(payload: string) {
    this.store.dispatch(new PaymentActions.GetCreditNoteDetail(payload));
  }

  resetCreditNoteDetail() {
    this.store.dispatch(new PaymentActions.GetCreditNoteDetailSuccess(null));
  }

  loadDiscountIdsInCreditNote(payload: string) {
    this.store.dispatch(new PaymentActions.GetDiscountIdsInCreditNote(payload));
  }

  resetDiscountIdsInCreditNote() {
    this.store.dispatch(
      new PaymentActions.GetDiscountIdsInCreditNoteSuccess([])
    );
  }

  loadSelectedCreditNotePaymentToBeDeleted(payload: PaymentDetails) {
    this.store.dispatch(new PaymentActions.SetCreditNoteTobeDeleted(payload));
  }

  resetSelectedCreditNotePaymentToBeDeleted() {
    this.store.dispatch(new PaymentActions.SetCreditNoteTobeDeleted(null));
  }

  loadSelectedCreditNotePaymentToBeAdded(payload: CreditNotePayment) {
    this.store.dispatch(
      new PaymentActions.SetSelectedCreditNotePaymentToBeAdded(payload)
    );
  }

  resetSelectedCreditNotePaymentToBeAdded() {
    this.store.dispatch(
      new PaymentActions.SetSelectedCreditNotePaymentToBeAdded(null)
    );
  }

  resetCreditNotePaymentAddedField() {
    this.store.dispatch(new PaymentActions.ResetCreditNotePaymentField(false));
  }

  loadEmpLoanDetails(payload: LoadEmployeeDetailsPayload) {
    this.store.dispatch(new PaymentActions.GetEmpLoanDetails(payload));
  }

  loadCashBackOfferBankDetails() {
    this.store.dispatch(new PaymentActions.GetCashBackOfferBankDetails());
  }

  loadCashBackOfferConfigDetails(offerId) {
    this.store.dispatch(
      new PaymentActions.GetCashBackOfferConfigDetails(offerId)
    );
  }

  validateCashBackOfferCard(requestPayload: ValidateCashBackPayload) {
    this.store.dispatch(
      new PaymentActions.ValidateCashBackOfferCard(requestPayload)
    );
  }

  resetIsGRFCNAdded() {
    this.store.dispatch(new PaymentActions.ResetIsGRFCNAdded());
  }

  resetDeletedPayment() {
    this.store.dispatch(new PaymentActions.ResetDeletedPayment());
  }

  resetCashBackPayment() {
    this.store.dispatch(new PaymentActions.ResetCashBackPayment());
  }

  loadFileUpload(payload: FileUploadDownloadPayload) {
    this.store.dispatch(new PaymentActions.FileUpload(payload));
  }

  loadFileUploadList(payload: FileUploadDownloadPayload) {
    this.store.dispatch(new PaymentActions.FileUploadList(payload));
  }

  loadFileDownloadUrl(payload: { id: string; locationCode: string }) {
    this.store.dispatch(new PaymentActions.FileDownloadUrl(payload));
  }

  resetUploadedFileData() {
    this.store.dispatch(new PaymentActions.ResetUploadedFileData());
  }

  updatePaymentStatusForVoidUnipay(
    payload: UpdatePaymentDetailsForVoidUnipayPayload
  ) {
    this.store.dispatch(
      new PaymentActions.UpdatePaymentStatusForVoidUnipay(payload)
    );
  }

  updateCNStatusForVoidUnipay(payload: string) {
    this.store.dispatch(
      new PaymentActions.UpdateCNStatusForVoidUnipay(payload)
    );
  }

  resetPaymentStatus() {
    this.store.dispatch(new PaymentActions.ResetPaymentStatus());
  }

  resetCNStatus() {
    this.store.dispatch(new PaymentActions.ResetCNStatus());
  }

  loadChequePayerBanks() {
    this.store.dispatch(new PaymentActions.LoadChequePayerBanks());
  }
}
