import { PaymentModeEnum } from '@poss-web/shared/models';
import { createSelector } from '@ngrx/store';
import { selectPaymentState } from './payment.reducer';
import {
  gvStatusUpdateSelector,
  integratedPaymentRequestSelector,
  paymentDetailsSelector
} from './payment.entity';

const selectError = createSelector(selectPaymentState, state => state.error);

const selectUnipayEnabled = createSelector(
  selectPaymentState,
  state => state.enableUnipay
);

const selectConfirmedPayment = createSelector(
  selectPaymentState,
  state => state.currentConfirmedPayment
);

const selectIsLoading = createSelector(
  selectPaymentState,
  state => state.isLoading
);

const selectIsUnipayLoading = createSelector(
  selectPaymentState,
  state => state.isUnipayLoading
);

const selectEncirclePoints = createSelector(
  selectPaymentState,
  state => state.encirclePoints
);

const selectIsChequeDDPaymentSuccess = createSelector(
  selectPaymentState,
  state => state.isChequeDDPaymentSuccess
);

const selectAllowedPayments = createSelector(
  selectPaymentState,
  state => state.allowedPayments
);
const selectMaxCashLimit = createSelector(
  selectPaymentState,
  state => state.maxCashLimit
);

const selectMaxCashLimitDetails = createSelector(
  selectPaymentState,
  state => state.maxCashLimitDetails
);

const selectCashAmountMaxCap = createSelector(
  selectPaymentState,
  state => state.cashAmountMaxCap
);

const selectDDPayerBanks = createSelector(
  selectPaymentState,
  state => state.ddPayerBanks
);
const selectChequePayerBanks = createSelector(
  selectPaymentState,
  state => state.chequePayerBanks
);
const selectCardConfig = createSelector(
  selectPaymentState,
  state => state.cardConfig
);
const selectWallets = createSelector(
  selectPaymentState,
  state => state.wallets
);
const selectSubBankLoans = createSelector(
  selectPaymentState,
  state => state.subBankLoans
);
const selectPaymentFieldNames = createSelector(
  selectPaymentState,
  state => state.paymentFieldNames
);
const selectCNDetails = createSelector(
  selectPaymentState,
  state => state.cnDetails
);
const selectPayeeBanks = createSelector(
  selectPaymentState,
  state => state.payeeBanks
);

const paymentDetails = createSelector(
  selectPaymentState,
  state => state.paymentDetails
);

const selectPaymentDetails = createSelector(
  paymentDetails,
  paymentDetailsSelector.selectAll
);

const selectAllGhsPaymentDetails = createSelector(
  selectPaymentDetails,
  paymentDetails =>
    paymentDetails.filter(
      payment =>
        payment.paymentCode === PaymentModeEnum.GHS_ACCOUNT ||
        payment.paymentCode === PaymentModeEnum.RIVAAH_ACCOUNT
    )
);

const selectLoadMaxCashLimit = createSelector(
  selectPaymentState,
  state => state.loadMaxCashLimit
);

const selectTotalPaidAmount = createSelector(selectPaymentDetails, data => {
  return data
    .map(payment => payment.amount)
    .reduce((amount1, amount2) => amount1 + amount2, 0);
});

const selectCustomerSpecificPayments = createSelector(
  selectPaymentState,
  state => state.customerSpecificPayments
);

const selectCustomerSpecificWalletPayments = createSelector(
  selectPaymentState,
  state => state.customerSpecificWalletPayments
);
const selectcustomerSpecificBankLoanPayments = createSelector(
  selectPaymentState,
  state => state.customerSpecificBankLoanPayments
);
const selectPaymentStatus = createSelector(
  selectPaymentState,
  state => state.roPaymentStatus
);

const selectRsoList = createSelector(
  selectPaymentState,
  state => state.rsoList
);

const selectCnList = createSelector(
  selectPaymentState,
  state => state.creditNoteList
);

const selectThirdPartyCnList = createSelector(
  selectPaymentState,
  state => state.thirdPartyCnList
);

const selectInvokedCreditNote = createSelector(
  selectPaymentState,
  state => state.invokedCN
);

const selectHasCustomerSpecificPayments = createSelector(
  selectPaymentDetails,
  selectCustomerSpecificPayments,
  selectCustomerSpecificWalletPayments,
  selectcustomerSpecificBankLoanPayments,
  (
    payments,
    customerSpecificPayments,
    customerSpecificWalletPayments,
    customerSpecificBankLoanPayments
  ) =>
    payments.filter(payment => {
      if (payment.paymentCode === PaymentModeEnum.WALLET) {
        return customerSpecificWalletPayments.includes(payment.instrumentNo);
      } else if (payment.paymentCode === PaymentModeEnum.BANK_LOAN) {
        return customerSpecificBankLoanPayments.includes(payment.instrumentNo);
      } else {
        return customerSpecificPayments.includes(payment.paymentCode);
      }
    }).length > 0
);

const selectIsEncirclePaymentAdded = createSelector(
  selectPaymentDetails,
  payments =>
    payments.filter(payment => payment.paymentCode === PaymentModeEnum.ENCIRCLE)
      .length > 0
);

const IsEncirclePaymentAddedRes = createSelector(
  selectPaymentState,
  state => state.isEncirclePaymentAdded
);

const selectIsChequeAdded = createSelector(
  selectPaymentDetails,
  payments =>
    payments.filter(payment => payment.paymentCode === PaymentModeEnum.CHEQUE)
      .length > 0
);

const selectIsDDAdded = createSelector(
  selectPaymentDetails,
  payments =>
    payments.filter(payment => payment.paymentCode === PaymentModeEnum.DD)
      .length > 0
);

const selectIsCreditNoteAdded = createSelector(
  selectPaymentDetails,
  payments =>
    payments.filter(
      payment => payment.paymentCode === PaymentModeEnum.CREDIT_NOTE
    ).length > 0
);

const selectIsGHSAccounts = createSelector(
  selectPaymentDetails,
  payments =>
    payments.filter(
      payment => payment.paymentCode === PaymentModeEnum.GHS_ACCOUNT
    ).length
);
const getUnipayTransactionId = createSelector(
  selectPaymentState,
  state => state.unipayTransactionDetails
);

const getUnipayResponse = createSelector(
  selectPaymentState,
  state => state.unipayPaymentDetails
);

const getFailedGV = createSelector(selectPaymentState, state => state.failedGV);
const getUnipayVoidResponse = createSelector(
  selectPaymentState,
  state => state.unipayVoidPaymentDetails
);

const getQCGCBalance = createSelector(
  selectPaymentState,
  state => state.QCGCDetails
);

const selectDigiBalance = createSelector(
  selectPaymentState,
  state => state.digiDetails
);
const selectDigiSellingPrice = createSelector(
  selectPaymentState,
  state => state.digiPrice
);
const getGVBalanceList = createSelector(
  selectPaymentState,
  state => state.GVDetails
);

const getGVBalance = createSelector(
  getGVBalanceList,
  gvStatusUpdateSelector.selectAll
);
const getGHSeVoucherBalance = createSelector(
  selectPaymentState,
  state => state.GHSeVoucherDetails
);

const airpaySendLinkResponse = createSelector(
  selectPaymentState,
  state => state.airpaySendLinkResponse
);

const selectAirpaySendLinkResponse = createSelector(
  airpaySendLinkResponse,
  paymentDetailsSelector.selectAll
);
const openAirpayPaymentDetails = createSelector(
  selectPaymentState,
  state => state.airpayOpenPaymentsDetails
);

const selectOpenAirpayPaymentDetails = createSelector(
  openAirpayPaymentDetails,
  paymentDetailsSelector.selectAll
);

const razorpaySendLinkResponse = createSelector(
  selectPaymentState,
  state => state.razorpaySendLinkResponse
);

const selectRazorpaySendLinkResponse = createSelector(
  razorpaySendLinkResponse,
  paymentDetailsSelector.selectAll
);

const selectRoPaymentRequest = createSelector(
  selectPaymentState,
  state => state.roPaymentRequest
);
const selectPaymentRequest = createSelector(
  selectPaymentState,
  state => state.paymentRequests
);

const selectIntegratedPaymentRequest = createSelector(
  selectPaymentRequest,
  integratedPaymentRequestSelector.selectAll
);

const selectIsOtpGenerated = createSelector(
  selectPaymentState,
  state => state.isCnOtpGenerated
);

const selectIsEmpLoanOtpGenerated = createSelector(
  selectPaymentState,
  state => state.isEmpLoanOtpGenerated
);

const selectIsDigiOtpGenerated = createSelector(
  selectPaymentState,
  state => state.isDigiOtpGenerated
);

const getGHSAccountDetails = createSelector(
  selectPaymentState,
  state => state.GHSAccountDetails
);
const selectGHSAttachments = createSelector(
  selectPaymentState,
  state => state.ghsAttachments
);
const selectIsAddGHSSuccess = createSelector(
  selectPaymentState,
  state => state.isAddGhsSuccess
);

const selectIsResendLinkRazorPay = createSelector(
  selectPaymentState,
  state => state.isResendLinkRazorPay
);

const selectIsValidateRazorPay= createSelector(
  selectPaymentState,
  state => state.isValidateRazorPay
);
const selectGHSCustomerId = createSelector(
  selectPaymentState,
  state => state.ghsResponse?.otherDetails?.data?.customerId
);
const selectGHSPrimaryCustomerId = createSelector(
  selectAllGhsPaymentDetails,
  ghsPayment => {
    return ghsPayment[0]?.otherDetails?.data?.customerId
      ? ghsPayment[0]?.otherDetails?.data?.customerId
      : null;
  }
);
const selectGHSResponse = createSelector(
  selectPaymentState,
  state => state.ghsResponse
);
const selectCreditNoteDetail = createSelector(
  selectPaymentState,
  state => state.creditNoteDetails
);
const selectDiscountIdsInCreditNote = createSelector(
  selectPaymentState,
  state => state.discountIdsInCreditNote
);
const selectSelectedCreditNoteForDeletion = createSelector(
  selectPaymentState,
  state => state.selectedCreditNotePaymentToBeDeleted
);
const selectSelectedCreditNoteForAddition = createSelector(
  selectPaymentState,
  state => state.selectedCreditNotePaymentToBeAdded
);
const selectCreditNotePaymentAddedField = createSelector(
  selectPaymentState,
  state => state.creditNotePaymentAdded
);
const selectCreditNotePaymentAddedRes = createSelector(
  selectPaymentState,
  state => state.creditNotePaymentAddedRes
);
const selectIsPaymentDeleted = createSelector(
  selectPaymentState,
  state => state.isPaymentDeleted
);

const lastDeletedPayment = createSelector(
  selectPaymentState,
  state => state.recentDeletedPayment
);

const selectDigiGoldPayment = createSelector(
  selectPaymentState,
  state => state.newDigiGoldPayment
);

const selectIsGRFCNAdded = createSelector(
  selectPaymentState,
  state => state.isGRFCNAdded
);

const selectEmpLoanDetails = createSelector(
  selectPaymentState,
  state => state.empLoanDetails
);

const selectCashBackOfferBankDetails = createSelector(
  selectPaymentState,
  state => state.cashBackBankDetails
);

const selectCashBackOfferConfigDetails = createSelector(
  selectPaymentState,
  state => state.cashBackConfigDetails
);

const selectIsVaidateCashbackOfferCard = createSelector(
  selectPaymentState,
  state => state.isCashBackCardValidated
);

const selectFileUploadRes = createSelector(
  selectPaymentState,
  state => state.uploadFileResponse
);

const selectFileUploadListRes = createSelector(
  selectPaymentState,
  state => state.uploadFileListResponse
);

const selectFileDownloadUrl = createSelector(
  selectPaymentState,
  state => state.downloadFileUrl
);

const selectUpdatePaymentStatusForVoidUnipayRes = createSelector(
  selectPaymentState,
  state => state.updatePaymentStatusForVoidUnipayRes
);

const selectErrorWhileUpdatingPaymentStatusForVoidUnipay = createSelector(
  selectPaymentState,
  state => state.errorWhileUpdatingPaymentStatusForVoidUnipay
);

const selectUpdateCNStatusForVoidUnipayRes = createSelector(
  selectPaymentState,
  state => state.updateCNStatusForVoidUnipayRes
);

const selectErrorWhileUpdatingCNStatusForVoidUnipay = createSelector(
  selectPaymentState,
  state => state.errorWhileUpdatingCNStatusForVoidUnipay
);

export const PaymentSelectors = {
  paymentDetails,
  airpaySendLinkResponse,
  openAirpayPaymentDetails,
  razorpaySendLinkResponse,
  // openRazorpayPaymentDetails,
  lastDeletedPayment,
  getGVBalanceList,
  selectError,
  selectIsLoading,
  selectIsChequeDDPaymentSuccess,
  selectAllowedPayments,
  selectPaymentDetails,
  getUnipayTransactionId,
  getUnipayResponse,
  selectDDPayerBanks,
  selectChequePayerBanks,
  selectCardConfig,
  selectPayeeBanks,
  selectTotalPaidAmount,
  getQCGCBalance,

  getUnipayVoidResponse,
  selectWallets,
  selectSubBankLoans,
  selectPaymentFieldNames,
  selectCustomerSpecificPayments,
  selectHasCustomerSpecificPayments,
  selectIsEncirclePaymentAdded,
  selectMaxCashLimit,
  selectLoadMaxCashLimit,
  selectUnipayEnabled,
  selectCustomerSpecificWalletPayments,
  selectcustomerSpecificBankLoanPayments,
  selectPaymentStatus,
  selectAirpaySendLinkResponse,
  selectOpenAirpayPaymentDetails,
  selectRazorpaySendLinkResponse,
  selectConfirmedPayment,
  selectIsChequeAdded,
  selectIsDDAdded,
  selectIsCreditNoteAdded,
  selectRsoList,
  selectIsDigiOtpGenerated,
  selectRoPaymentRequest,
  selectEncirclePoints,
  getGHSeVoucherBalance,
  selectCnList,
  getGVBalance,
  selectCNDetails,
  selectInvokedCreditNote,
  getFailedGV,
  selectThirdPartyCnList,
  selectIsOtpGenerated,
  selectCashAmountMaxCap,
  getGHSAccountDetails,
  selectGHSAttachments,
  selectIsAddGHSSuccess,
  selectIsResendLinkRazorPay,
  selectIsValidateRazorPay,
  selectIsGHSAccounts,
  selectGHSCustomerId,
  selectGHSPrimaryCustomerId,
  selectGHSResponse,
  selectCreditNoteDetail,
  selectDiscountIdsInCreditNote,
  selectSelectedCreditNoteForDeletion,
  selectSelectedCreditNoteForAddition,
  selectCreditNotePaymentAddedField,
  selectCreditNotePaymentAddedRes,
  selectAllGhsPaymentDetails,
  selectIsPaymentDeleted,
  selectDigiBalance,
  selectDigiGoldPayment,
  selectMaxCashLimitDetails,
  selectIntegratedPaymentRequest,
  selectDigiSellingPrice,
  selectIsGRFCNAdded,
  selectEmpLoanDetails,
  selectIsEmpLoanOtpGenerated,
  selectIsUnipayLoading,
  selectCashBackOfferBankDetails,
  selectCashBackOfferConfigDetails,
  selectIsVaidateCashbackOfferCard,
  IsEncirclePaymentAddedRes,
  selectFileUploadRes,
  selectFileUploadListRes,
  selectFileDownloadUrl,
  selectUpdatePaymentStatusForVoidUnipayRes,
  selectErrorWhileUpdatingPaymentStatusForVoidUnipay,
  selectUpdateCNStatusForVoidUnipayRes,
  selectErrorWhileUpdatingCNStatusForVoidUnipay
};
