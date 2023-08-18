import {
  paymentDetailsAdapter,
  gvAdapter,
  integratedPaymentRequestDetailsAdapter
} from './payment.entity';
import { createFeatureSelector } from '@ngrx/store';
import { PaymentState } from './payment.state';
import { PaymentActionTypes, PaymentActions } from './payment.actions';
import { PaymentModeEnum, PaymentGroupEnum } from '@poss-web/shared/models';

export const PaymentFeatureKey = 'payments';

export const selectPaymentState = createFeatureSelector<PaymentState>(
  PaymentFeatureKey
);

export const initialState: PaymentState = {
  isLoading: false,
  isUnipayLoading: false,
  isChequeDDPaymentSuccess: false,
  error: null,
  allowedPayments: new Map<PaymentModeEnum, PaymentGroupEnum>(),
  maxCashLimit: 0,
  maxCashLimitDetails: null,
  cashAmountMaxCap: null,
  payeeBanks: [],
  cnDetails: [],
  QCGCDetails: null,
  isEncirclePaymentAdded: false,
  digiDetails: null,
  digiPrice: null,
  GHSeVoucherDetails: null,
  wallets: [],
  subBankLoans: [],
  paymentFieldNames: [],
  paymentDetails: paymentDetailsAdapter.getInitialState(),
  customerSpecificPayments: [],
  customerSpecificWalletPayments: [],
  customerSpecificBankLoanPayments: [],
  loadMaxCashLimit: null,
  chequePayerBanks: [],
  paymentRequests: integratedPaymentRequestDetailsAdapter.getInitialState(),
  ddPayerBanks: [],
  failedGV: [],
  cardConfig: {
    payerBanks: [],
    cardType: [],
    isBankMandatory: true,
    isCardTypeMandatory: true
  },
  rsoList: [],
  GVDetails: gvAdapter.getInitialState(),
  isPaymentDeleted: false,
  recentDeletedPayment: null, // Unipay
  unipayTransactionDetails: null,
  enableUnipay: [],
  unipayPaymentDetails: null,
  unipayVoidPaymentDetails: null,
  roPaymentStatus: null,
  roPaymentRequest: null,
  encirclePoints: 0,

  //airpay int
  airpaySendLinkResponse: paymentDetailsAdapter.getInitialState(),
  airpayOpenPaymentsDetails: paymentDetailsAdapter.getInitialState(),
  //razorpay
  razorpaySendLinkResponse: paymentDetailsAdapter.getInitialState(),
  newDigiGoldPayment: null,
  currentConfirmedPayment: null,
  creditNoteList: null,
  invokedCN: null,
  thirdPartyCnList: null,
  isCnOtpGenerated: null,
  isEmpLoanOtpGenerated: null,
  isDigiOtpGenerated: false,
  GHSAccountDetails: null,
  ghsAttachments: null,
  isAddGhsSuccess: false,
  isResendLinkRazorPay: false,
  isValidateRazorPay: false,
  ghsResponse: null,
  creditNoteDetails: null,
  discountIdsInCreditNote: [],
  selectedCreditNotePaymentToBeDeleted: null,
  selectedCreditNotePaymentToBeAdded: null,
  creditNotePaymentAdded: false,
  creditNotePaymentAddedRes: null,
  isGRFCNAdded: false,
  empLoanDetails: null,
  cashBackBankDetails: [],
  cashBackConfigDetails: null,
  isCashBackCardValidated: null,
  uploadFileResponse: false,
  uploadFileListResponse: [],
  downloadFileUrl: null,
  updatePaymentStatusForVoidUnipayRes: {
    res: false,
    callCancelBillWithReturn: false
  },
  errorWhileUpdatingPaymentStatusForVoidUnipay: false,
  updateCNStatusForVoidUnipayRes: false,
  errorWhileUpdatingCNStatusForVoidUnipay: false
};

export function paymentsReducer(
  state: PaymentState = initialState,
  action: PaymentActions
): PaymentState {
  switch (action.type) {
    case PaymentActionTypes.RESET_PAYMENT:
      return {
        ...state,
        error: null,
        paymentDetails: paymentDetailsAdapter.removeAll(state.paymentDetails),
        cnDetails: [],
        isChequeDDPaymentSuccess: false,
        isAddGhsSuccess: false,
        maxCashLimit: 0,
        maxCashLimitDetails: null,
        cashAmountMaxCap: null,
        allowedPayments: new Map<PaymentModeEnum, PaymentGroupEnum>(),
        payeeBanks: [],
        chequePayerBanks: [],
        ddPayerBanks: [],
        currentConfirmedPayment: null,
        unipayPaymentDetails: null,
        unipayTransactionDetails: null,
        unipayVoidPaymentDetails: null,

        cardConfig: {
          payerBanks: [],
          cardType: [],
          isBankMandatory: true,
          isCardTypeMandatory: true
        },
        wallets: [],
        subBankLoans: [],
        paymentFieldNames: [],
        failedGV: [],
        QCGCDetails: null,
        digiDetails: null,
        isDigiOtpGenerated: false,
        roPaymentStatus: null,
        creditNoteDetails: null,
        discountIdsInCreditNote: [],
        selectedCreditNotePaymentToBeDeleted: null,
        selectedCreditNotePaymentToBeAdded: null,
        isPaymentDeleted: false,
        newDigiGoldPayment: null,
        recentDeletedPayment: null,
        cashBackBankDetails: [],
        cashBackConfigDetails: null,
        isCashBackCardValidated: null,
        uploadFileResponse: false,
        uploadFileListResponse: [],
        downloadFileUrl: null,
        updatePaymentStatusForVoidUnipayRes: {
          res: false,
          callCancelBillWithReturn: false
        },
        errorWhileUpdatingPaymentStatusForVoidUnipay: false,
        updateCNStatusForVoidUnipayRes: false,
        errorWhileUpdatingCNStatusForVoidUnipay: false,
        isValidateRazorPay: false,
        isResendLinkRazorPay: false
      };

    case PaymentActionTypes.SEND_PAYMENT_REQUEST:
      return {
        ...state,
        isLoading: true,
        roPaymentStatus: null
      };

    case PaymentActionTypes.SEND_PAYMENT_REQUEST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        roPaymentStatus: {
          isSuccess: true,
          transactionId: action.payload.referenceId
        }
      };

    case PaymentActionTypes.SEND_PAYMENT_REQUEST_FAILURE:
      return {
        ...state,
        isLoading: false,
        roPaymentStatus: {
          isSuccess: false,
          transactionId: null
        }
      };

    case PaymentActionTypes.LOAD_ENCIRECLE_POINTS:
      return {
        ...state,
        isLoading: true,
        encirclePoints: 0
      };

    case PaymentActionTypes.LOAD_ENCIRECLE_POINTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        encirclePoints: action.payload
      };

    case PaymentActionTypes.LOAD_RO_PAYMENT_REQUEST_STATUS:
      return {
        ...state,
        isLoading: true,
        roPaymentRequest: null
      };

    case PaymentActionTypes.LOAD_PAYMENT_REQUEST_STATUS:
      return {
        ...state,
        isLoading: true,
        paymentRequests: integratedPaymentRequestDetailsAdapter.getInitialState()
      };
    case PaymentActionTypes.GET_CREDIT_NOTE_DETAIL:
      return {
        ...state,
        isLoading: true,
        creditNoteDetails: null
      };

    case PaymentActionTypes.GET_CREDIT_NOTE_DETAIL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        creditNoteDetails: action.payload
      };

    case PaymentActionTypes.GET_CREDIT_NOTE_DETAIL_FAILURE:
      return {
        ...state,
        isLoading: false,
        creditNoteDetails: null,
        error: action.payload
      };

    case PaymentActionTypes.GET_DISCOUNT_IDS_IN_CREDIT_NOTE:
      return {
        ...state,
        isLoading: true,
        discountIdsInCreditNote: []
      };

    case PaymentActionTypes.GET_DISCOUNT_IDS_IN_CREDIT_NOTE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        discountIdsInCreditNote: action.payload
      };

    case PaymentActionTypes.GET_DISCOUNT_IDS_IN_CREDIT_NOTE_FAILURE:
      return {
        ...state,
        isLoading: false,
        discountIdsInCreditNote: [],
        error: action.payload
      };

    case PaymentActionTypes.SET_SELECTED_CREDIT_NOTE_TO_BE_DELETED:
      return {
        ...state,
        selectedCreditNotePaymentToBeDeleted: action.payload
      };

    case PaymentActionTypes.SET_SELECTED_CREDIT_NOTE_TO_BE_ADDED:
      return {
        ...state,
        selectedCreditNotePaymentToBeAdded: action.payload
      };

    case PaymentActionTypes.LOAD_RO_PAYMENT_REQUEST_STATUS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        roPaymentRequest: action.payload
      };

    case PaymentActionTypes.LOAD_PAYMENT_REQUEST_STATUS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        paymentRequests: integratedPaymentRequestDetailsAdapter.setAll(
          action.payload,
          state.paymentRequests
        )
      };
    // TODO : add all payment action for loader

    case PaymentActionTypes.ADD_CASH_PAYMENT:
    case PaymentActionTypes.ADD_CARD_PAYMENT:
    case PaymentActionTypes.ADD_ENCIRCLE_POINTS_PAYMENT:
    case PaymentActionTypes.ADD_QCGC_PAYMENT:
    case PaymentActionTypes.ADD_DIGI_GOLD_PAYMENT:
    case PaymentActionTypes.ADD_GV_PAYMENT:
    case PaymentActionTypes.UPDATE_UNIPAY_PAYMENT:
    case PaymentActionTypes.LOAD_PAYMENT_DETAILS:
    case PaymentActionTypes.LOAD_CREDIT_NOTE_DETAILS:
    case PaymentActionTypes.DELETE_PAYMENT:
    case PaymentActionTypes.LOAD_UNIPAY_HOST_CONFIGURATION:
    case PaymentActionTypes.GENERATE_OTP_FOR_DIGI:
    case PaymentActionTypes.LOAD_CARD_PAYER_BANKS:
    case PaymentActionTypes.LOAD_DD_PAYER_BANKS:
    case PaymentActionTypes.LOAD_CHEQUE_PAYER_BANKS:
    case PaymentActionTypes.LOAD_PAYEE_BANKS:
    case PaymentActionTypes.EDIT_CASH_PAYMENT:
    case PaymentActionTypes.VALIDATE_PAYMENT:
    case PaymentActionTypes.ADD_WALLET_PAYMENT:
    case PaymentActionTypes.ADD_AIRPAY_PAYMENT:
    case PaymentActionTypes.ADD_RO_PAYMENT:
    case PaymentActionTypes.ADD_MANUAL_PAYMENT:
    case PaymentActionTypes.ADD_BANK_LOAN_PAYMENT:
    case PaymentActionTypes.ADD_RTGS_PAYMENT:
    case PaymentActionTypes.ADD_UPI_PAYMENT:
    case PaymentActionTypes.LOAD_CM_REQUEST_PAYMENT_DETAILS:
    case PaymentActionTypes.ADD_GHS_eVOUCHER_PAYMENT:
    case PaymentActionTypes.GET_CREDIT_NOTE_LIST:
    case PaymentActionTypes.GET_THIRD_PARTY_CN_LIST:
    case PaymentActionTypes.ADD_CREDIT_NOTE_PAYMENT:
    case PaymentActionTypes.ADD_EMPLOYEE_LOAN_PAYMENT:
    case PaymentActionTypes.GET_INVOKED_CREDIT_NOTE:
    case PaymentActionTypes.GENERATE_OTP_FOR_CN:
      return {
        ...state,
        isLoading: true,
        creditNotePaymentAdded: false,
        creditNotePaymentAddedRes: null,
        recentDeletedPayment: null,
        newDigiGoldPayment: null,
        isPaymentDeleted: false
      };
    case PaymentActionTypes.ADD_GHS_ACCOUNT_PAYMENT:
      return {
        ...state,
        isLoading: true,
        ghsResponse: null,
        isAddGhsSuccess: false,
        isPaymentDeleted: false
      };
    case PaymentActionTypes.ADD_CHEQUE_DD_PAYMENT:
      return {
        ...state,
        isChequeDDPaymentSuccess: false,
        isLoading: true
      };

    case PaymentActionTypes.GENERATE_OTP_FOR_DIGI_SUCCESS:
      return {
        ...state,
        isDigiOtpGenerated: true,
        isLoading: false
      };

    case PaymentActionTypes.GENERATE_OTP_FOR_CN_SUCCESS:
      return {
        ...state,
        isCnOtpGenerated: true,
        isLoading: false
      };
    case PaymentActionTypes.GENERATE_OTP_FOR_EMP_LOAN:
    case PaymentActionTypes.GET_CASH_BACK_OFFER_BANK_DETAILS:
      return {
        ...state,
        isLoading: true
      };
    case PaymentActionTypes.GET_CASH_BACK_OFFER_CONFIG_DETAILS:
      return {
        ...state,
        isLoading: true,
        cashBackConfigDetails: null
      };
    case PaymentActionTypes.VALIDATE_CASH_BACK_OFFER_CARD:
      return {
        ...state,
        isCashBackCardValidated: null,
        isLoading: true
      };

    case PaymentActionTypes.VALIDATE_CASH_BACK_OFFER_CARD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isCashBackCardValidated: action.payload
      };
    case PaymentActionTypes.GET_CASH_BACK_OFFER_BANK_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        cashBackBankDetails: action.payload
      };

    case PaymentActionTypes.GET_CASH_BACK_OFFER_CONFIG_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        cashBackConfigDetails: action.payload
      };
    case PaymentActionTypes.GENERATE_OTP_FOR_EMP_LOAN_SUCCESS:
      return {
        ...state,
        isEmpLoanOtpGenerated: true,
        isLoading: false
      };

    case PaymentActionTypes.GET_CREDIT_NOTE_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        creditNoteList: action.payload
      };

    case PaymentActionTypes.GET_THIRD_PARTY_CN_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        thirdPartyCnList: action.payload
      };

    case PaymentActionTypes.GET_INVOKED_CREDIT_NOTE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        invokedCN: action.payload
      };
    case PaymentActionTypes.GET_GV_BALANCE:
      return {
        ...state,
        isLoading: true,
        GVDetails: gvAdapter.getInitialState()
      };

    case PaymentActionTypes.CONFIRM_PAYMENT:
      return {
        ...state,
        isLoading: true,
        currentConfirmedPayment: null
      };

    case PaymentActionTypes.START_UNIPAY_PAYMENT:
      return {
        ...state,
        unipayPaymentDetails: null,
        isUnipayLoading: true
      };
    case PaymentActionTypes.VOID_UNIPAY_PAYMENT:
      return {
        ...state,
        unipayVoidPaymentDetails: null,
        isLoading: true
      };

    case PaymentActionTypes.VOID_UNIPAY_PAYMENT_FAILURE:
      return {
        ...state,
        unipayVoidPaymentDetails: action.payload,
        isLoading: false
        // error: action.payload
      };

    case PaymentActionTypes.ADD_UNIPAY_PAYMENT:
      return {
        ...state,
        isLoading: true,
        unipayTransactionDetails: null,
        unipayPaymentDetails: null
      };

    case PaymentActionTypes.START_UNIPAY_PAYMENT_SUCCESS:
      return {
        ...state,
        isUnipayLoading: false,
        unipayPaymentDetails: action.payload
      };

    case PaymentActionTypes.LOAD_MAX_CASH_LIMIT:
      return {
        ...state,
        isLoading: true,
        maxCashLimit: 0,
        maxCashLimitDetails: null,
        cashAmountMaxCap: null
      };

    case PaymentActionTypes.LOAD_MAX_CASH_LIMIT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        maxCashLimitDetails: action.payload,
        maxCashLimit: action.payload?.eligibleAmount
      };

    case PaymentActionTypes.LOAD_MAX_CASH_LIMIT_FAILURE:
      return {
        ...state,
        isLoading: false,
        maxCashLimit: 0,
        maxCashLimitDetails: null,
        error: action.payload
      };

    case PaymentActionTypes.LOAD_CASH_LIMIT_CAP:
      return {
        ...state,
        isLoading: true,
        cashAmountMaxCap: null
      };

    case PaymentActionTypes.LOAD_CASH_LIMIT_CAP_SUCCESS:
      return {
        ...state,
        isLoading: false,
        cashAmountMaxCap: action.payload
      };

    case PaymentActionTypes.LOAD_CASH_LIMIT_CAP_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case PaymentActionTypes.VOID_UNIPAY_PAYMENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        unipayVoidPaymentDetails: action.payload
      };

    case PaymentActionTypes.LOAD_ALLOWED_PAYMENTS:
      return {
        ...state,
        isLoading: true,
        wallets: [],
        subBankLoans: [],
        paymentFieldNames: [],
        allowedPayments: new Map<PaymentModeEnum, PaymentGroupEnum>(),
        customerSpecificPayments: [],
        customerSpecificWalletPayments: [],
        customerSpecificBankLoanPayments: []
      };

    case PaymentActionTypes.GET_GV_BALANCE_SUCCESS:
      return {
        ...state,
        GVDetails: gvAdapter.setAll(
          action.payload.gvStatusList,
          state.GVDetails
        ),
        isLoading: false,
        error: null
      };

    case PaymentActionTypes.GET_GV_BALANCE_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case PaymentActionTypes.VALIDATE_CASH_BACK_OFFER_CARD_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        isCashBackCardValidated: null
      };
    case PaymentActionTypes.LOAD_ALLOWED_PAYMENTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        allowedPayments: action.payload.allowedPayments,
        wallets: action.payload.wallets,
        subBankLoans: action.payload.subBankLoans,
        customerSpecificPayments: action.payload.customerSpecificPayments,
        customerSpecificWalletPayments:
          action.payload.customerSpecificWalletPayments,
        customerSpecificBankLoanPayments:
          action.payload.customerSpecificBankLoanPayments,
        paymentFieldNames: action.payload.paymentFieldNames
      };

    case PaymentActionTypes.LOAD_CARD_PAYER_BANKS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        cardConfig: action.payload
      };
    case PaymentActionTypes.LOAD_DD_PAYER_BANKS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        ddPayerBanks: action.payload.payerBanks
      };
    case PaymentActionTypes.LOAD_CHEQUE_PAYER_BANKS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        chequePayerBanks: action.payload.payerBanks
      };

    case PaymentActionTypes.LOAD_PAYEE_BANKS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        payeeBanks: action.payload
      };

    case PaymentActionTypes.LOAD_PAYMENT_DETAILS_SUCCESS:
    case PaymentActionTypes.LOAD_CM_REQUEST_PAYMENT_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        paymentDetails: paymentDetailsAdapter.setAll(
          action.payload,
          state.paymentDetails
        )
      };

    case PaymentActionTypes.LOAD_CREDIT_NOTE_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        cnDetails: action.payload
      };

    // TODO : Clear Unipay details
    case PaymentActionTypes.CLEAR_PAYMENT_DETAILS:
      return {
        ...state,
        unipayTransactionDetails: null,
        paymentDetails: paymentDetailsAdapter.removeAll(state.paymentDetails),
        airpaySendLinkResponse: paymentDetailsAdapter.removeAll(
          state.airpaySendLinkResponse
        ),
        airpayOpenPaymentsDetails: paymentDetailsAdapter.removeAll(
          state.airpayOpenPaymentsDetails
        ),
        razorpaySendLinkResponse: paymentDetailsAdapter.removeAll(
          state.razorpaySendLinkResponse
        )
      };

    case PaymentActionTypes.ADD_UNIPAY_PAYMENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        unipayTransactionDetails: action.payload
      };

    case PaymentActionTypes.ADD_CASH_PAYMENT_SUCCESS:
    case PaymentActionTypes.ADD_CARD_PAYMENT_SUCCESS:
    case PaymentActionTypes.ADD_QCGC_PAYMENT_SUCCESS:

    case PaymentActionTypes.ADD_GV_PAYMENT_SUCCESS:
    case PaymentActionTypes.ADD_WALLET_PAYMENT_SUCCESS:
    case PaymentActionTypes.UPDATE_UNIPAY_PAYMENT_SUCCESS:
    case PaymentActionTypes.ADD_BANK_LOAN_PAYMENT_SUCCESS:
    case PaymentActionTypes.ADD_AIRPAY_PAYMENT_SUCCESS:
    case PaymentActionTypes.ADD_RO_PAYMENT_SUCCESS:
    case PaymentActionTypes.ADD_MANUAL_PAYMENT_SUCCESS:
    case PaymentActionTypes.ADD_GHS_eVOUCHER_PAYMENT_SUCCESS:
    case PaymentActionTypes.ADD_RTGS_PAYMENT_SUCCESS:
    case PaymentActionTypes.ADD_UPI_PAYMENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        paymentDetails: paymentDetailsAdapter.addOne(
          action.payload,
          state.paymentDetails
        ),
        loadMaxCashLimit: {
          load: true
        }
      };

    case PaymentActionTypes.ADD_ENCIRCLE_POINTS_PAYMENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        paymentDetails: paymentDetailsAdapter.addOne(
          action.payload,
          state.paymentDetails
        ),
        loadMaxCashLimit: {
          load: true
        },
        isEncirclePaymentAdded: true
      };

    case PaymentActionTypes.ADD_DIGI_GOLD_PAYMENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        paymentDetails: paymentDetailsAdapter.addOne(
          action.payload,
          state.paymentDetails
        ),
        loadMaxCashLimit: {
          load: true
        },
        isDigiOtpGenerated: false,
        newDigiGoldPayment: action.payload
      };
    case PaymentActionTypes.ADD_CREDIT_NOTE_PAYMENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        paymentDetails: paymentDetailsAdapter.addOne(
          action.payload,
          state.paymentDetails
        ),
        loadMaxCashLimit: {
          load: true
        },
        creditNotePaymentAdded: true,
        creditNotePaymentAddedRes: action.payload,
        isGRFCNAdded:
          action.payload.paymentCode === PaymentModeEnum.CREDIT_NOTE &&
          action.payload?.otherDetails?.data?.isRateProtectedCN === true
      };
    case PaymentActionTypes.ADD_EMPLOYEE_LOAN_PAYMENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        paymentDetails: paymentDetailsAdapter.addOne(
          action.payload,
          state.paymentDetails
        ),
        loadMaxCashLimit: {
          load: true
        }
      };
    case PaymentActionTypes.RESET_CREDIT_NOTE_PAYMENT_FIELD:
      return {
        ...state,
        creditNotePaymentAdded: false,
        creditNotePaymentAddedRes: null
      };
  }

  switch (action.type) {
    case PaymentActionTypes.ADD_CHEQUE_DD_PAYMENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isChequeDDPaymentSuccess: true,
        paymentDetails: paymentDetailsAdapter.addOne(
          action.payload,
          state.paymentDetails
        ),
        loadMaxCashLimit: {
          load: true
        }
      };
    case PaymentActionTypes.ADD_GHS_ACCOUNT_PAYMENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAddGhsSuccess: true,
        ghsResponse: action.payload,
        paymentDetails: paymentDetailsAdapter.addOne(
          action.payload,
          state.paymentDetails
        ),
        loadMaxCashLimit: {
          load: true
        }
      };
    case PaymentActionTypes.START_AIRPAY_INT_PAYMENT:
    case PaymentActionTypes.UPDATE_INT_PAYMENT:
    case PaymentActionTypes.VALIDATE_INT_PAYMENT:
      return {
        ...state,
        isLoading: true,
        isValidateRazorPay: false,
        isResendLinkRazorPay: false
      };
    case PaymentActionTypes.START_AIRPAY_INT_PAYMENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        airpaySendLinkResponse: paymentDetailsAdapter.addOne(
          action.payload,
          state.airpaySendLinkResponse
        ),
        paymentDetails: paymentDetailsAdapter.addOne(
          action.payload,
          state.paymentDetails
        )
      };

    case PaymentActionTypes.VALIDATE_INT_PAYMENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isValidateRazorPay: true,
        paymentRequests: integratedPaymentRequestDetailsAdapter.updateOne(
          {
            id: action.payload.id,
            changes: action.payload
          },
          state.paymentRequests
        )
      };

    case PaymentActionTypes.UPDATE_INT_PAYMENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isResendLinkRazorPay: true
        // paymentRequests: integratedPaymentRequestDetailsAdapter.updateOne(
        //   {
        //     id: action.payload.id,
        //     changes: action.payload
        //   },
        //   state.paymentRequests
        // )
      };

    case PaymentActionTypes.UPDATE_AIRPAY_INT_PAYMENT_STATUS:
      return {
        ...state,
        isLoading: false,
        paymentDetails: paymentDetailsAdapter.updateOne(
          {
            id: action.payload.id,
            changes: action.payload
          },
          state.paymentDetails
        ),
        airpaySendLinkResponse: paymentDetailsAdapter.updateOne(
          {
            id: action.payload.id,
            changes: action.payload
          },
          state.airpaySendLinkResponse
        )
      };

    case PaymentActionTypes.START_RAZORPAY_PAYMENT:
    case PaymentActionTypes.UPDATE_RAZORPAY_PAYMENT:
    case PaymentActionTypes.VALIDATE_RAZORPAY_PAYMENT:
      return {
        ...state,
        isLoading: true,
        razorpaySendLinkResponse: paymentDetailsAdapter.removeAll(
          state.razorpaySendLinkResponse
        )
      };
    case PaymentActionTypes.START_RAZORPAY_PAYMENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        // razorpaySendLinkResponse: paymentDetailsAdapter.addOne(
        //   action.payload,
        //   state.razorpaySendLinkResponse
        // ),
        paymentDetails: paymentDetailsAdapter.addOne(
          action.payload,
          state.paymentDetails
        )
      };
    case PaymentActionTypes.UPDATE_RAZORPAY_PAYMENT_SUCCESS:
    case PaymentActionTypes.VALIDATE_RAZORPAY_PAYMENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        razorpaySendLinkResponse: paymentDetailsAdapter.addOne(
          action.payload,
          state.razorpaySendLinkResponse
        )
      };
    case PaymentActionTypes.UPDATE_RAZORPAY_PAYMENT_STATUS:
      return {
        ...state,
        isLoading: false,
        paymentDetails: paymentDetailsAdapter.updateOne(
          {
            id: action.payload.id,
            changes: action.payload
          },
          state.paymentDetails
        ),
        razorpaySendLinkResponse: paymentDetailsAdapter.updateOne(
          {
            id: action.payload.id,
            changes: action.payload
          },
          state.razorpaySendLinkResponse
        )
      };
    case PaymentActionTypes.DELETE_PAYMENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isPaymentDeleted: true,
        recentDeletedPayment: action.deletedPayment,
        paymentDetails: paymentDetailsAdapter.removeOne(
          action.payload,
          state.paymentDetails
        ),
        loadMaxCashLimit: {
          load: true
        }
      };

    case PaymentActionTypes.REMOVE_GV:
      return {
        ...state,
        isLoading: false,
        GVDetails: gvAdapter.removeOne(action.payload, state.GVDetails)
      };

    case PaymentActionTypes.VALIDATE_PAYMENT_SUCCESS:
    case PaymentActionTypes.CONFIRM_PAYMENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        currentConfirmedPayment: action.payload,
        paymentDetails:
          action.payload.paymentCode === PaymentModeEnum.LINKED_CN
            ? state.paymentDetails
            : paymentDetailsAdapter.updateOne(
                {
                  id: action.payload.id,
                  changes: action.payload
                },
                state.paymentDetails
              )
      };

    case PaymentActionTypes.EDIT_CASH_PAYMENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        currentConfirmedPayment: action.payload,
        paymentDetails: paymentDetailsAdapter.updateOne(
          {
            id: action.payload.id,
            changes: action.payload
          },
          state.paymentDetails
        ),
        loadMaxCashLimit: {
          load: true
        }
      };
    case PaymentActionTypes.EDIT_CASH_PAYMENT_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
        paymentDetails: paymentDetailsAdapter.updateOne(
          {
            id: action.payload.paymentId,
            changes: {
              amount:
                state.paymentDetails.entities[action.payload.paymentId].amount
            }
          },
          state.paymentDetails
        )
      };
    case PaymentActionTypes.RESET_CASH_PAYMENT_AMOUNT:
      return {
        ...state,
        paymentDetails: paymentDetailsAdapter.updateOne(
          {
            id: action.payload.paymentId,
            changes: {
              amount:
                state.paymentDetails.entities[action.payload.paymentId].amount
            }
          },
          state.paymentDetails
        )
      };

    case PaymentActionTypes.GET_QCGC_BALANCE:
      return {
        ...state,
        isLoading: true,
        QCGCDetails: null
      };

    case PaymentActionTypes.GET_DIGI_BALANCE:
      return {
        ...state,
        isLoading: true,
        digiDetails: null
      };

    case PaymentActionTypes.GET_DIGI_PRICE:
      return {
        ...state,
        isLoading: true,
        digiPrice: null
      };
    case PaymentActionTypes.GET_GHS_ACCOUNT_DETAILS:
      return {
        ...state,
        isLoading: true,
        GHSAccountDetails: null
      };
    case PaymentActionTypes.GET_GHS_ATTACHMENTS:
      return {
        ...state,
        isLoading: true,
        ghsAttachments: null
      };
    case PaymentActionTypes.RESET_QCGC:
      return {
        ...state,
        isLoading: false,
        QCGCDetails: null,
        digiDetails: null,
        isDigiOtpGenerated: false,
        GVDetails: gvAdapter.getInitialState(),
        failedGV: []
      };

    case PaymentActionTypes.RESET_CASH_BACK_OFFER_PAYMENT:
      return {
        ...state,
        cashBackConfigDetails: null,
        isCashBackCardValidated: null,
        isLoading: false
      };

    case PaymentActionTypes.RESET_FAILED_GV:
      return {
        ...state,
        isLoading: false,

        failedGV: []
      };

    case PaymentActionTypes.RESET_CREDIT_NOTE_LIST:
      return {
        ...state,
        isLoading: false,
        creditNoteList: null,
        thirdPartyCnList: null,
        isCnOtpGenerated: null,
        creditNoteDetails: null
      };

    case PaymentActionTypes.RESET_INVOKED_CREDIT_NOTE:
      return {
        ...state,
        // isLoading: false,
        invokedCN: null,
        isCnOtpGenerated: null,
        creditNoteDetails: null
      };
    case PaymentActionTypes.GET_QCGC_BALANCE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        QCGCDetails: action.payload
      };

    case PaymentActionTypes.GET_DIGI_BALANCE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        digiDetails: action.payload,
        isDigiOtpGenerated: false
      };

    case PaymentActionTypes.GET_DIGI_PRICE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        digiPrice: action.payload
      };

    case PaymentActionTypes.GET_GHS_eVOUCHER_BALANCE:
      return {
        ...state,
        isLoading: true,
        GHSeVoucherDetails: null
      };
    case PaymentActionTypes.GET_GHS_ACCOUNT_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        GHSAccountDetails: action.payload
      };
    case PaymentActionTypes.GET_GHS_ATTACHMENTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        ghsAttachments: action.payload
      };

    case PaymentActionTypes.RESET_GHS_eVOUCHER:
      return {
        ...state,
        isLoading: false,
        GHSeVoucherDetails: null,
        isCnOtpGenerated: null
      };
    case PaymentActionTypes.GET_GHS_eVOUCHER_BALANCE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        GHSeVoucherDetails: action.payload
      };
    case PaymentActionTypes.LOAD_UNIPAY_HOST_CONFIGURATION_SUCCESS:
      return {
        ...state,
        isLoading: false,
        enableUnipay: action.payload
      };

    case PaymentActionTypes.ADD_CASH_PAYMENT_FAILURE:
    case PaymentActionTypes.GET_DIGI_BALANCE_FAILURE:
    case PaymentActionTypes.GET_DIGI_PRICE_FAILURE:
    case PaymentActionTypes.GENERATE_OTP_FOR_DIGI_FAILURE:

    case PaymentActionTypes.LOAD_PAYMENT_DETAILS_FAILURE:
    case PaymentActionTypes.LOAD_CREDIT_NOTE_DETAILS_FAILURE:
    case PaymentActionTypes.UPDATE_UNIPAY_PAYMENT_FAILURE:
    case PaymentActionTypes.ADD_CARD_PAYMENT_FAILURE:
    case PaymentActionTypes.ADD_CHEQUE_DD_PAYMENT_FAILURE:
    case PaymentActionTypes.ADD_ENCIRCLE_POINTS_PAYMENT_FAILURE:
    case PaymentActionTypes.ADD_QCGC_PAYMENT_FAILURE:
    case PaymentActionTypes.ADD_DIGI_GOLD_PAYMENT_FAILURE:
    case PaymentActionTypes.ADD_UNIPAY_PAYMENT_FAILURE:

    case PaymentActionTypes.DELETE_PAYMENT_FAILURE:
    case PaymentActionTypes.LOAD_UNIPAY_HOST_CONFIGURATION_FAILURE:
    case PaymentActionTypes.LOAD_CARD_PAYER_BANKS_FAILURE:
    case PaymentActionTypes.LOAD_DD_PAYER_BANKS_FAILURE:
    case PaymentActionTypes.LOAD_CHEQUE_PAYER_BANKS_FAILURE:
    case PaymentActionTypes.LOAD_PAYEE_BANKS_FAILURE:
    case PaymentActionTypes.GET_QCGC_BALANCE_FAILURE:
    case PaymentActionTypes.GET_GHS_eVOUCHER_BALANCE_FAILURE:
    case PaymentActionTypes.LOAD_ALLOWED_PAYMENTS_FAILURE:
    case PaymentActionTypes.ADD_WALLET_PAYMENT_FAILURE:
    case PaymentActionTypes.ADD_BANK_LOAN_PAYMENT_FAILURE:
    case PaymentActionTypes.VALIDATE_PAYMENT_FAILURE:
    case PaymentActionTypes.ADD_AIRPAY_PAYMENT_FAILURE:
    case PaymentActionTypes.ADD_RO_PAYMENT_FAILURE:
    case PaymentActionTypes.ADD_MANUAL_PAYMENT_FAILURE:
    case PaymentActionTypes.ADD_GHS_eVOUCHER_PAYMENT_FAILURE:
    case PaymentActionTypes.ADD_RTGS_PAYMENT_FAILURE:
    case PaymentActionTypes.ADD_UPI_PAYMENT_FAILURE:
    case PaymentActionTypes.START_AIRPAY_INT_PAYMENT_FAILURE:
    case PaymentActionTypes.UPDATE_INT_PAYMENT_FAILURE:
    case PaymentActionTypes.VALIDATE_INT_PAYMENT_FAILURE:
    case PaymentActionTypes.START_RAZORPAY_PAYMENT_FAILURE:
    case PaymentActionTypes.UPDATE_RAZORPAY_PAYMENT_FAILURE:
    case PaymentActionTypes.VALIDATE_RAZORPAY_PAYMENT_FAILURE:
    case PaymentActionTypes.LOAD_CM_REQUEST_PAYMENT_DETAILS_FAILURE:
    case PaymentActionTypes.LOAD_ENCIRECLE_POINTS_FAILURE:
    case PaymentActionTypes.LOAD_RO_PAYMENT_REQUEST_STATUS_FAILURE:

    case PaymentActionTypes.LOAD_RSO_LIST_FAILURE:
    case PaymentActionTypes.GET_CREDIT_NOTE_LIST_FAILURE:
    case PaymentActionTypes.GET_THIRD_PARTY_CN_LIST_FAILURE:
    case PaymentActionTypes.ADD_CREDIT_NOTE_PAYMENT_FAILURE:
    case PaymentActionTypes.GET_INVOKED_CREDIT_NOTE_FAILURE:
    case PaymentActionTypes.GENERATE_OTP_FOR_CN_FAILURE:
    case PaymentActionTypes.GENERATE_OTP_FOR_EMP_LOAN_FAILURE:
    case PaymentActionTypes.GET_GHS_ACCOUNT_DETAILS_FAILURE:
    case PaymentActionTypes.GET_GHS_ATTACHMENTS_FAILURE:
    case PaymentActionTypes.ADD_GHS_ACCOUNT_PAYMENT_FAILURE:
    case PaymentActionTypes.ADD_EMPLOYEE_LOAN_PAYMENT_FAILURE:
    case PaymentActionTypes.GET_CASH_BACK_OFFER_BANK_DETAILS_FAILURE:
    case PaymentActionTypes.FILE_UPLOAD_FAILURE:
    case PaymentActionTypes.FILE_UPLOAD_LIST_FAILURE:
    case PaymentActionTypes.FILE_DOWNLOAD_URL_FAILURE:
      return {
        ...state,
        isLoading: false,
        isValidateRazorPay: false,
        isResendLinkRazorPay: false,
        error: action.payload
      };

    case PaymentActionTypes.GET_CASH_BACK_OFFER_CONFIG_DETAILS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        cashBackConfigDetails: null
      };
    case PaymentActionTypes.START_UNIPAY_PAYMENT_FAILURE:
      return {
        ...state,
        isUnipayLoading: false,
        error: action.payload,
        unipayPaymentDetails: 'error'
      };

    case PaymentActionTypes.ADD_GV_PAYMENT_FAILURE:
      return {
        ...state,
        isLoading: false,
        failedGV: [...state.failedGV, action.payload]
      };

    case PaymentActionTypes.CONFIRM_PAYMENT_FAILURE:
      return {
        ...state,
        isLoading: false,
        currentConfirmedPayment: null,
        error: action.payload.error
      };
    case PaymentActionTypes.LOAD_OPEN_AIRPAY_PAYMENT_DETAILS:
      return {
        ...state,
        isLoading: true,
        airpayOpenPaymentsDetails: paymentDetailsAdapter.removeAll(
          state.airpayOpenPaymentsDetails
        )
      };
    case PaymentActionTypes.LOAD_OPEN_AIRPAY_PAYMENT_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        airpayOpenPaymentsDetails: paymentDetailsAdapter.setAll(
          action.payload,
          state.airpayOpenPaymentsDetails
        )
      };

    case PaymentActionTypes.LOAD_RSO_LIST:
      return {
        ...state,
        isLoading: true,
        rsoList: []
      };

    case PaymentActionTypes.LOAD_RSO_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        rsoList: action.payload
      };

    case PaymentActionTypes.GET_EMP_LOAN_DETAILS:
      return {
        ...state,
        isLoading: true,
        isEmpLoanOtpGenerated: null,
        empLoanDetails: null
      };

    case PaymentActionTypes.GET_EMP_LOAN_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isEmpLoanOtpGenerated: null,
        empLoanDetails: action.payload
      };

    case PaymentActionTypes.GET_EMP_LOAN_DETAILS_FAILURE:
      return {
        ...state,
        isLoading: false,
        empLoanDetails: null,
        isEmpLoanOtpGenerated: null,
        error: action.payload
      };

    case PaymentActionTypes.RESET_IS_GRF_CN_ADDED:
      return {
        ...state,
        isGRFCNAdded: false
      };

    case PaymentActionTypes.RESET_DELETED_PAYMENT:
      return {
        ...state,
        recentDeletedPayment: null,
        selectedCreditNotePaymentToBeDeleted: null,
        error: null
      };
    case PaymentActionTypes.FILE_UPLOAD:
      return {
        ...state,
        isLoading: true,
        error: null,
        uploadFileResponse: false
      };

    case PaymentActionTypes.FILE_UPLOAD_LIST:
      return {
        ...state,
        isLoading: true,
        error: null,
        uploadFileListResponse: []
      };

    case PaymentActionTypes.FILE_DOWNLOAD_URL:
      return {
        ...state,
        isLoading: true,
        error: null,
        downloadFileUrl: null
      };

    case PaymentActionTypes.FILE_UPLOAD_SUCCESS:
      return {
        ...state,
        uploadFileResponse: action.payload,
        error: null,
        isLoading: false
      };

    case PaymentActionTypes.RESET_ENCIRCLE_PAYMENT_ADDED:
      return {
        ...state,
        isEncirclePaymentAdded: false
      };

    case PaymentActionTypes.FILE_UPLOAD_LIST_SUCCESS:
      return {
        ...state,
        uploadFileListResponse: action.payload,
        error: null,
        isLoading: false
      };

    case PaymentActionTypes.FILE_DOWNLOAD_URL_SUCCESS:
      return {
        ...state,
        downloadFileUrl: action.payload,
        error: null,
        isLoading: false
      };

    case PaymentActionTypes.RESET_UPLOADED_FILE_DATA:
      return {
        ...state,
        uploadFileResponse: false,
        uploadFileListResponse: [],
        downloadFileUrl: null,
        error: null,
        isLoading: false
      };

    case PaymentActionTypes.UPDATE_PAYMENT_STATUS_FOR_VOID_UNIPAY:
      return {
        ...state,
        isLoading: true,
        updatePaymentStatusForVoidUnipayRes: {
          res: false,
          callCancelBillWithReturn: false
        },
        errorWhileUpdatingPaymentStatusForVoidUnipay: false
      };

    case PaymentActionTypes.UPDATE_PAYMENT_STATUS_FOR_VOID_UNIPAY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        updatePaymentStatusForVoidUnipayRes: action.payload
      };

    case PaymentActionTypes.UPDATE_PAYMENT_STATUS_FOR_VOID_UNIPAY_FAILURE:
      return {
        ...state,
        isLoading: false,
        errorWhileUpdatingPaymentStatusForVoidUnipay: true
      };

    case PaymentActionTypes.RESET_PAYMENT_STATUS:
      return {
        ...state,
        updatePaymentStatusForVoidUnipayRes: {
          res: false,
          callCancelBillWithReturn: false
        },
        errorWhileUpdatingPaymentStatusForVoidUnipay: false,
        unipayVoidPaymentDetails: null,
        isLoading: false
      };

    case PaymentActionTypes.RESET_CN_STATUS:
      return {
        ...state,
        updateCNStatusForVoidUnipayRes: false,
        errorWhileUpdatingCNStatusForVoidUnipay: false,
        unipayVoidPaymentDetails: null,
        isLoading: false
      };

    case PaymentActionTypes.UPDATE_CN_STATUS_FOR_VOID_UNIPAY:
      return {
        ...state,
        isLoading: true,
        updateCNStatusForVoidUnipayRes: false,
        errorWhileUpdatingCNStatusForVoidUnipay: false
      };

    case PaymentActionTypes.UPDATE_CN_STATUS_FOR_VOID_UNIPAY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        updateCNStatusForVoidUnipayRes: true
      };

    case PaymentActionTypes.UPDATE_CN_STATUS_FOR_VOID_UNIPAY_FAILURE:
      return {
        ...state,
        isLoading: false,
        errorWhileUpdatingCNStatusForVoidUnipay: true
      };

    default:
      return state;
  }
}
