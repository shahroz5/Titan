import { Action } from '@ngrx/store';
import {
  CustomErrors,
  TransactionTypeEnum,
  PaymentDetails,
  UniPayResponse,
  UpdateUnipayPaylaod,
  PaymentPayload,
  UniPayRequest,
  QCGCCardDetails,
  QCGCGetBalancePayload,
  AllowedPaymentsResponse,
  EditCashPaymentPayload,
  LoadMaxCashLimitPayload,
  PaymentConfig,
  LoadPaymentDetailsPayload,
  DeletePaymentPayload,
  OtherDetailsForUnipay,
  ValidatePaymentPayload,
  ResendPaymentLinkPayload,
  StoreUser,
  IntegratedPaymentRequestPayload,
  PaymentRequest,
  CmRequestDetailsPayload,
  UnipayTransactionDetails,
  GHSeVoucherDetails,
  CNListRequestPayload,
  CNListResponse,
  CNListResponsePayload,
  InvokeCNRequestPayload,
  GVStatusListingPayload,
  GVStatusUpdateList,
  ThirdPartyCNRequestPayload,
  GHSAccountDetails,
  GHSAttachments,
  GHSAttachmentsPayload,
  GenerateOtpPayload,
  CreditNoteDetail,
  CreditNotePayment,
  GenerateOtpDigiGoldPayload,
  DigiGoldDetails,
  DigiGetBalancePayload,
  DigiPriceDetails,
  CashLimitDetails,
  MaxCashAmountDetails,
  EmployeeLoanConfigList,
  LoadEmployeeDetailsPayload,
  PaymentModeEnum,
  CashBackBankDetail,
  CashBackConfigDetail,
  ValidateCashBackPayload,
  AdvanceBookingDetailsResponse,
  AdvanceBookingDetailsRequestPayload,
  FileUploadDownloadPayload,
  FileUploadLists,
  UnipayErrorDetails,
  UpdatePaymentDetailsForVoidUnipayPayload,
  UnipaySuccessDetails
} from '@poss-web/shared/models';

export enum PaymentActionTypes {
  LOAD_ALLOWED_PAYMENTS = '[Payment] Load Allowed Payments',
  LOAD_ALLOWED_PAYMENTS_SUCCESS = '[Payment] Load Allowed Payments Success',
  LOAD_ALLOWED_PAYMENTS_FAILURE = '[Payment] Load Allowed Payments Failure',

  LOAD_MAX_CASH_LIMIT = '[Payment] Load Max Cash Limit',
  LOAD_MAX_CASH_LIMIT_SUCCESS = '[Payment] Load Max Cash Limit Success',
  LOAD_MAX_CASH_LIMIT_FAILURE = '[Payment]  Load Max Cash Limit Failure',

  LOAD_CASH_LIMIT_CAP = '[Payment] Load Cash Limit Cap',
  LOAD_CASH_LIMIT_CAP_SUCCESS = '[Payment] Load  Cash Limit Cap Success',
  LOAD_CASH_LIMIT_CAP_FAILURE = '[Payment]  Load Cash Limit Cap Failure',

  LOAD_ENCIRECLE_POINTS = '[Payment] Load Encirecle Points',
  LOAD_ENCIRECLE_POINTS_SUCCESS = '[Payment] Load Encirecle Points  Success',
  LOAD_ENCIRECLE_POINTS_FAILURE = '[Payment]  Load Encirecle Points Failure',

  ADD_CHEQUE_DD_PAYMENT = '[Payment] Add Cheque-DD Payment',
  ADD_CHEQUE_DD_PAYMENT_SUCCESS = '[Payment] Add Cheque-DD Payment Success',
  ADD_CHEQUE_DD_PAYMENT_FAILURE = '[Payment] Add Cheque-DD Payment Failure',

  ADD_CASH_PAYMENT = '[Payment] Add Cash Payment',
  ADD_CASH_PAYMENT_SUCCESS = '[Payment] Add Cash Payment Success',
  ADD_CASH_PAYMENT_FAILURE = '[Payment] Add Cash Payment Failure',

  ADD_CARD_PAYMENT = '[Payment] Add Card Payment',
  ADD_CARD_PAYMENT_SUCCESS = '[Payment] Add Card Payment Success',
  ADD_CARD_PAYMENT_FAILURE = '[Payment] Add Card Payment Failure',

  ADD_ENCIRCLE_POINTS_PAYMENT = '[Payment] Add Encircle Points Payment',
  ADD_ENCIRCLE_POINTS_PAYMENT_SUCCESS = '[Payment] Add Encircle Points Payment Success',
  ADD_ENCIRCLE_POINTS_PAYMENT_FAILURE = '[Payment] Add Encircle Points Payment Failure',

  ADD_WALLET_PAYMENT = '[Payment] Add Wallet Payment',
  ADD_WALLET_PAYMENT_SUCCESS = '[Payment] Add Wallet Payment Success',
  ADD_WALLET_PAYMENT_FAILURE = '[Payment] Add Wallet Payment Failure',

  ADD_CREDIT_NOTE_PAYMENT = '[Payment] Add Credit Note Payment',
  ADD_CREDIT_NOTE_PAYMENT_SUCCESS = '[Payment] Add Credit Note Payment Success',
  ADD_CREDIT_NOTE_PAYMENT_FAILURE = '[Payment] Add Credit Note Payment Failure',

  ADD_EMPLOYEE_LOAN_PAYMENT = '[Payment] Add Employee Loan Payment',
  ADD_EMPLOYEE_LOAN_PAYMENT_SUCCESS = '[Payment] Add Employee Loan Payment Success',
  ADD_EMPLOYEE_LOAN_PAYMENT_FAILURE = '[Payment] Employee Loan Payment Failure',

  ADD_AIRPAY_PAYMENT = '[Payment] Add Airpay Payment',
  ADD_AIRPAY_PAYMENT_SUCCESS = '[Payment] Add Airpay Payment Success',
  ADD_AIRPAY_PAYMENT_FAILURE = '[Payment] Add Airpay Payment Failure',

  ADD_RTGS_PAYMENT = '[Payment] Add RTGS Payment',
  ADD_RTGS_PAYMENT_SUCCESS = '[Payment] Add RTGS Payment Success',
  ADD_RTGS_PAYMENT_FAILURE = '[Payment] Add RTGS Payment Failure',

  ADD_UPI_PAYMENT = '[Payment] Add UPI Payment',
  ADD_UPI_PAYMENT_SUCCESS = '[Payment] Add UPI Payment Success',
  ADD_UPI_PAYMENT_FAILURE = '[Payment] Add UPI Payment Failure',

  START_AIRPAY_INT_PAYMENT = '[Payment] Start Airpay Integrated Payment',
  START_AIRPAY_INT_PAYMENT_SUCCESS = '[Payment] Start Airpay Integrated Payment Success',
  START_AIRPAY_INT_PAYMENT_FAILURE = '[Payment] Start Airpay Integrated Payment Failure',

  UPDATE_INT_PAYMENT = '[Payment] Update Integrated Payment',
  UPDATE_INT_PAYMENT_SUCCESS = '[Payment] Update Integrated Payment Success',
  UPDATE_INT_PAYMENT_FAILURE = '[Payment] Update Integrated Payment Failure',

  UPDATE_AIRPAY_INT_PAYMENT_STATUS = '[Payment]  Update Airpay Integrated Payment Status',

  VALIDATE_INT_PAYMENT = '[Payment] Validate Integrated Payment',
  VALIDATE_INT_PAYMENT_SUCCESS = '[Payment] Validate Integrated Payment Success',
  VALIDATE_INT_PAYMENT_FAILURE = '[Payment] Validate Integrated Payment Failure',

  LOAD_OPEN_AIRPAY_PAYMENT_DETAILS = '[Payment] Load Open Airpay Payment Details',
  LOAD_OPEN_AIRPAY_PAYMENT_DETAILS_SUCCESS = '[Payment] Load Open Airpay Payment Details Success',
  LOAD_OPEN_AIRPAY_PAYMENT_DETAILS_FAILURE = '[Payment] Load Open Airpay Payment Details Failure',

  START_RAZORPAY_PAYMENT = '[Payment] Start Razorpay Payment',
  START_RAZORPAY_PAYMENT_SUCCESS = '[Payment] Start Razorpay Payment Success',
  START_RAZORPAY_PAYMENT_FAILURE = '[Payment] Start Razorpay Payment Failure',

  UPDATE_RAZORPAY_PAYMENT = '[Payment] Update Razorpay Payment',
  UPDATE_RAZORPAY_PAYMENT_SUCCESS = '[Payment] Update Razorpay Payment Success',
  UPDATE_RAZORPAY_PAYMENT_FAILURE = '[Payment] Update Razorpay Payment Failure',

  UPDATE_RAZORPAY_PAYMENT_STATUS = '[Payment]  Update Razorpay Payment Status',

  VALIDATE_RAZORPAY_PAYMENT = '[Payment] Validate Razorpay Payment',
  VALIDATE_RAZORPAY_PAYMENT_SUCCESS = '[Payment] Validate Razorpay Payment Success',
  VALIDATE_RAZORPAY_PAYMENT_FAILURE = '[Payment] Validate Razorpay Payment Failure',

  VALIDATE_PAYMENT = '[Payment] Validate Payment',
  VALIDATE_PAYMENT_SUCCESS = '[Payment] Validate Payment Success',
  VALIDATE_PAYMENT_FAILURE = '[Payment] Validate Payment Failure',

  ADD_UNIPAY_PAYMENT = '[Payment] Add Unipay Payment',
  ADD_UNIPAY_PAYMENT_SUCCESS = '[Payment] Add Unipay Payment Success',
  ADD_UNIPAY_PAYMENT_FAILURE = '[Payment] Add Unipay Payment Failure',

  ADD_RO_PAYMENT = '[Payment] Add RO Payment',
  ADD_RO_PAYMENT_SUCCESS = '[Payment] Add RO Payment Success',
  ADD_RO_PAYMENT_FAILURE = '[Payment] Add RO Payment Failure',

  ADD_MANUAL_PAYMENT = '[Payment] Add RO Manual Payment',
  ADD_MANUAL_PAYMENT_SUCCESS = '[Payment] Add RO Manual Payment Success',
  ADD_MANUAL_PAYMENT_FAILURE = '[Payment] Add RO Manual Payment Failure',

  SEND_PAYMENT_REQUEST = '[Payment] Send Payment Request',
  SEND_PAYMENT_REQUEST_SUCCESS = '[Payment] Send  Payment Request Success',
  SEND_PAYMENT_REQUEST_FAILURE = '[Payment] Send  Payment Request Failure',

  START_UNIPAY_PAYMENT = '[Payment] Start Unipay Payment',
  START_UNIPAY_PAYMENT_SUCCESS = '[Payment] Start Unipay Payment Success',
  START_UNIPAY_PAYMENT_FAILURE = '[Payment] Start Unipay Payment Failure',

  DELETE_PAYMENT = '[Payment] Delete Payment',
  DELETE_PAYMENT_SUCCESS = '[Payment] Delete Payment Success',
  DELETE_PAYMENT_FAILURE = '[Payment] Delete Payment Failure',

  EDIT_CASH_PAYMENT = '[Payment] Edit Cash Payment',
  EDIT_CASH_PAYMENT_SUCCESS = '[Payment] Edit Cash Payment Success',
  EDIT_CASH_PAYMENT_FAILURE = '[Payment] Edit Cash Payment Failure',

  RESET_CASH_PAYMENT_AMOUNT = '[Payment] Reset Cash Payment Amount',

  LOAD_PAYMENT_DETAILS = '[Payment] Load Payment Details',
  LOAD_PAYMENT_DETAILS_SUCCESS = '[Payment] Load Payment Details Success',
  LOAD_PAYMENT_DETAILS_FAILURE = '[Payment] Load Payment Details Failure',

  LOAD_CREDIT_NOTE_DETAILS = '[Payment] Load Credit Note Details',
  LOAD_CREDIT_NOTE_DETAILS_SUCCESS = '[Payment] Load Credit Note Details Success',
  LOAD_CREDIT_NOTE_DETAILS_FAILURE = '[Payment] Load Credit Note Details Failure',

  LOAD_CARD_PAYER_BANKS = '[Payment] Load Card Payer Banks',
  LOAD_CARD_PAYER_BANKS_SUCCESS = '[Payment] Load Card Payer Banks Success',
  LOAD_CARD_PAYER_BANKS_FAILURE = '[Payment] Load Card Payer Banks Failure',

  LOAD_DD_PAYER_BANKS = '[Payment] Load DD Payer Banks',
  LOAD_DD_PAYER_BANKS_SUCCESS = '[Payment] Load DD Payer Banks Success',
  LOAD_DD_PAYER_BANKS_FAILURE = '[Payment] Load DD Payer Banks Failure',

  LOAD_CHEQUE_PAYER_BANKS = '[Payment] Load Cheque Payer Banks',
  LOAD_CHEQUE_PAYER_BANKS_SUCCESS = '[Payment] Load Cheque Payer Banks Success',
  LOAD_CHEQUE_PAYER_BANKS_FAILURE = '[Payment] Load Cheque Payer Banks Failure',

  LOAD_PAYEE_BANKS = '[Payment] Load Payee Banks',
  LOAD_PAYEE_BANKS_SUCCESS = '[Payment] Load Payee Banks Success',
  LOAD_PAYEE_BANKS_FAILURE = '[Payment] Load Payee Banks Failure',

  UPDATE_UNIPAY_PAYMENT = '[Payment] Update Unipay Payment',
  UPDATE_UNIPAY_PAYMENT_SUCCESS = '[Payment] Update Unipay Payment Success',
  UPDATE_UNIPAY_PAYMENT_FAILURE = '[Payment] Update Unipay Payment Failure',

  GET_ENCRYPTED_HOSTNAME = '[Payment] Get Encrypted HostName',
  GET_ENCRYPTED_HOSTNAME_SUCCESS = '[Payment] Get Encrypted HostName Success',
  GET_ENCRYPTED_HOSTNAME_FAILURE = '[Payment] Get Encrypted HostName Failure',

  GET_DECRYPTED_HOSTNAME = '[Payment] Get Decrypted Hostname',
  GET_DECRYPTED_HOSTNAME_SUCCESS = '[Payment] Get Decrypted Hostname Success',
  GET_DECRYPTED_HOSTNAME_FAILURE = '[Payment] Get Decrypted Hostname Failure',

  LOAD_UNIPAY_HOST_CONFIGURATION = '[Payment]Load Unipay Host Configuration',
  LOAD_UNIPAY_HOST_CONFIGURATION_SUCCESS = '[Payment]Load Unipay Host Configuration Success',
  LOAD_UNIPAY_HOST_CONFIGURATION_FAILURE = '[Payment]Load Unipay Host Configuration Failure',

  LOAD_RSO_LIST = '[Payment]Load RSO List',
  LOAD_RSO_LIST_SUCCESS = '[Payment]Load RSO List Success',
  LOAD_RSO_LIST_FAILURE = '[Payment]Load RSO ListFailure',

  LOAD_RO_PAYMENT_REQUEST_STATUS = '[Payment] Load RO Payment Request Status ',
  LOAD_RO_PAYMENT_REQUEST_STATUS_SUCCESS = '[Payment] Load RO Payment Request Status Success',
  LOAD_RO_PAYMENT_REQUEST_STATUS_FAILURE = '[Payment] Load RO Payment Request Status Failure',

  LOAD_PAYMENT_REQUEST_STATUS = '[Payment] Load Payment Request Status ',
  LOAD_PAYMENT_REQUEST_STATUS_SUCCESS = '[Payment] Load Payment Request Status Success',
  LOAD_PAYMENT_REQUEST_STATUS_FAILURE = '[Payment] Load Payment Request Status Failure',

  VOID_UNIPAY_PAYMENT = '[Payments] Void Unipay Payment',
  VOID_UNIPAY_PAYMENT_SUCCESS = '[Payments] Void Unipay Payment Success',
  VOID_UNIPAY_PAYMENT_FAILURE = '[Payments] Void Unipay Payment Failure',

  GET_QCGC_BALANCE = '[payments] Get QCGC Balance',
  GET_QCGC_BALANCE_SUCCESS = '[payments] Get QCGC Balance Success',
  GET_QCGC_BALANCE_FAILURE = '[payments] Get QCGC Balance Failure',

  ADD_QCGC_PAYMENT = '[payments] Add QCGC Payment',
  ADD_QCGC_PAYMENT_SUCCESS = '[payments] Add QCGC Payment Success',
  ADD_QCGC_PAYMENT_FAILURE = '[payments] Add QCGC Payment Failure',

  ADD_DIGI_GOLD_PAYMENT = '[payments] Add DIGI Gold Payment',
  ADD_DIGI_GOLD_PAYMENT_SUCCESS = '[payments] Add DIGI Gold Payment Success',
  ADD_DIGI_GOLD_PAYMENT_FAILURE = '[payments] Add DIGI Gold Payment Failure',

  ADD_GV_PAYMENT = '[payments] Add GV Payment',
  ADD_GV_PAYMENT_SUCCESS = '[payments] Add GV Payment Success',
  ADD_GV_PAYMENT_FAILURE = '[payments] Add GV Payment Failure',

  CONFIRM_PAYMENT = '[payments] Confirm Payment',
  CONFIRM_PAYMENT_SUCCESS = '[payments] Confirm Payment Success',
  CONFIRM_PAYMENT_FAILURE = '[payments] Confirm Payment Failure',

  ADD_BANK_LOAN_PAYMENT = '[Payment] Add Bank Loan Payment',
  ADD_BANK_LOAN_PAYMENT_SUCCESS = '[Payment] Add Bank Loan Payment Success',
  ADD_BANK_LOAN_PAYMENT_FAILURE = '[Payment] Add Bank Loan Payment Failure',

  ADD_GHS_eVOUCHER_PAYMENT = '[payments] Add GHS_eVOUCHER Payment',
  ADD_GHS_eVOUCHER_PAYMENT_SUCCESS = '[payments] Add GHS_eVOUCHER Payment Success',
  ADD_GHS_eVOUCHER_PAYMENT_FAILURE = '[payments] Add GHS_eVOUCHER Payment Failure',

  GET_GHS_eVOUCHER_BALANCE = '[payments] Get GHS eVoucher Balance',
  GET_GHS_eVOUCHER_BALANCE_SUCCESS = '[payments] Get GHS eVoucher Balance Success',
  GET_GHS_eVOUCHER_BALANCE_FAILURE = '[payments] Get GHS eVoucher Balance Failure',

  GET_CREDIT_NOTE_LIST = '[payments] Get Credit Note List',
  GET_CREDIT_NOTE_LIST_SUCCESS = '[payments] Get Credit Note List Success',
  GET_CREDIT_NOTE_LIST_FAILURE = '[payments] Get Credit Note List Failure',

  GET_THIRD_PARTY_CN_LIST = '[payments] Get Third party CN List',
  GET_THIRD_PARTY_CN_LIST_SUCCESS = '[payments] Get Third party CN List Success',
  GET_THIRD_PARTY_CN_LIST_FAILURE = '[payments] Get Third party CN List Failure',

  GET_INVOKED_CREDIT_NOTE = '[payments] Get Invoked Credit Note',
  GET_INVOKED_CREDIT_NOTE_SUCCESS = '[payments] Get Invoked Credit Note Success',
  GET_INVOKED_CREDIT_NOTE_FAILURE = '[payments] Get Invoked Credit Note Failure',

  CLEAR_PAYMENT_DETAILS = '[Payment] Clear Payment Details',

  RESET_TRANSACTION_ID = '[Payment] Reset Transaction Id',

  RESET_QCGC = '[Payment] Reset QCGC',
  RESET_FAILED_GV = '[Payment] Reset Failed GV',
  REMOVE_GV = '[Payment] Remove GV',
  RESET_CREDIT_NOTE_LIST = '[Payment] Reset Credit Note List',
  RESET_INVOKED_CREDIT_NOTE = '[Payment] Reset Invoked Credit Note',

  RESET_GHS_eVOUCHER = '[Payment] Reset GHS eVoucher',
  RESET_PAYMENT = '[Payment] Payment Reset',
  RESET_ENCIRCLE_PAYMENT_ADDED = '[Payment] Reset Encircle Payment Added',

  LOAD_CM_REQUEST_PAYMENT_DETAILS = '[Payment] Load CM Request Payment Details',
  LOAD_CM_REQUEST_PAYMENT_DETAILS_SUCCESS = '[Payment] Load CM Request Payment Details Success',
  LOAD_CM_REQUEST_PAYMENT_DETAILS_FAILURE = '[Payment] Load CM Request Payment Details Failure',

  GET_GV_BALANCE = '[Payment] Get GV Balance',
  GET_GV_BALANCE_SUCCESS = '[Payment] Get GV Balance Suceess',
  GET_GV_BALANCE_FAILURE = '[Payment] Get GV Balance Failure',

  GENERATE_OTP_FOR_CN = '[Payment] Generate OTP for CN',
  GENERATE_OTP_FOR_CN_SUCCESS = '[Payment] Generate OTP for CN Success',
  GENERATE_OTP_FOR_CN_FAILURE = '[Payment] Generate OTP for CN Failure',

  GENERATE_OTP_FOR_EMP_LOAN = '[Payment] Generate OTP for Emp Loan',
  GENERATE_OTP_FOR_EMP_LOAN_SUCCESS = '[Payment] Generate OTP for Emp Loan Success',
  GENERATE_OTP_FOR_EMP_LOAN_FAILURE = '[Payment] Generate OTP for Emp Loan Failure',

  GET_GHS_ACCOUNT_DETAILS = '[payments] Get GHS Account Details',
  GET_GHS_ACCOUNT_DETAILS_SUCCESS = '[payments] Get GHS Account Details Success',
  GET_GHS_ACCOUNT_DETAILS_FAILURE = '[payments] Get GHS Account Details Failure',

  GET_GHS_ATTACHMENTS = '[payments] Get GHS Attachments',
  GET_GHS_ATTACHMENTS_SUCCESS = '[payments] Get GHS Attachments Success',
  GET_GHS_ATTACHMENTS_FAILURE = '[payments] Get GHS Attachments Failure',

  ADD_GHS_ACCOUNT_PAYMENT = '[payments] Add GHS Account Payment',
  ADD_GHS_ACCOUNT_PAYMENT_SUCCESS = '[payments] Add GHS Account Payment Success',
  ADD_GHS_ACCOUNT_PAYMENT_FAILURE = '[payments] Add GHS Account Payment Failure',

  GET_CREDIT_NOTE_DETAIL = '[payments] Get Credit Note Details',
  GET_CREDIT_NOTE_DETAIL_SUCCESS = '[payments] Get Credit Note Details Success',
  GET_CREDIT_NOTE_DETAIL_FAILURE = '[payments] Get Credit Note Details Failure',

  GET_DISCOUNT_IDS_IN_CREDIT_NOTE = '[payments] Get Discount Ids In Credit Note',
  GET_DISCOUNT_IDS_IN_CREDIT_NOTE_SUCCESS = '[payments] Get Discount Ids In Credit Note Success',
  GET_DISCOUNT_IDS_IN_CREDIT_NOTE_FAILURE = '[payments] Get Discount Ids In Credit Note Failure',

  SET_SELECTED_CREDIT_NOTE_TO_BE_DELETED = '[payments] Set Selected Credit Note To Be Deleted',
  SET_SELECTED_CREDIT_NOTE_TO_BE_ADDED = '[payments] Set Selected Credit Note To Be Added',
  RESET_CREDIT_NOTE_PAYMENT_FIELD = '[payments] Reset Credit Note Payment Field',

  GET_DIGI_BALANCE = '[payments] Get DIGI Balance',
  GET_DIGI_BALANCE_SUCCESS = '[payments] Get DIGI Balance Success',
  GET_DIGI_BALANCE_FAILURE = '[payments] Get DIGI Balance Failure',

  GET_DIGI_PRICE = '[payments] Get DIGI Price',
  GET_DIGI_PRICE_SUCCESS = '[payments] Get DIGI Balance Price Success',
  GET_DIGI_PRICE_FAILURE = '[payments] Get DIGI Balance Price Failure',

  GENERATE_OTP_FOR_DIGI = '[Payment] Generate OTP for Digi Gold',
  GENERATE_OTP_FOR_DIGI_SUCCESS = '[Payment] Generate OTP for Digi Gold Success',
  GENERATE_OTP_FOR_DIGI_FAILURE = '[Payment] Generate OTP for Digi Gold Failure',

  GET_EMP_LOAN_DETAILS = '[Payment] Get Employee Loan Details',
  GET_EMP_LOAN_DETAILS_SUCCESS = '[Payment] Get Employee Loan Details Success',
  GET_EMP_LOAN_DETAILS_FAILURE = '[Payment] Get Employee Loan Details Failure',

  GET_CASH_BACK_OFFER_BANK_DETAILS = '[Payment] Get Cash Back Offer Bank Details',
  GET_CASH_BACK_OFFER_BANK_DETAILS_SUCCESS = '[Payment] Get Cash Back Offer Bank Details Success',
  GET_CASH_BACK_OFFER_BANK_DETAILS_FAILURE = '[Payment] Get Cash Back Offer Bank Details Failure',

  GET_CASH_BACK_OFFER_CONFIG_DETAILS = '[Payment] Get Cash Back Offer Config Details',
  GET_CASH_BACK_OFFER_CONFIG_DETAILS_SUCCESS = '[Payment] Get Cash Back Offer Config Details Success',
  GET_CASH_BACK_OFFER_CONFIG_DETAILS_FAILURE = '[Payment] Get Cash Back Offer Config Details Failure',

  VALIDATE_CASH_BACK_OFFER_CARD = '[Payment] Validate Cashback Offer Card',
  VALIDATE_CASH_BACK_OFFER_CARD_SUCCESS = '[Payment] Validate Cashback Offer Card Success',
  VALIDATE_CASH_BACK_OFFER_CARD_FAILURE = '[Payment] Validate Cashback Offer Card Failure',

  RESET_IS_GRF_CN_ADDED = '[Payment] Reset Is GRF CN Added',
  RESET_DELETED_PAYMENT = '[Payment] Reset Deleted Payment',

  RESET_CASH_BACK_OFFER_PAYMENT = '[Payment] Reset Cash Back Offer Payment',

  FILE_UPLOAD = '[Payment] File Upload',
  FILE_UPLOAD_SUCCESS = '[Payment] File Upload Success',
  FILE_UPLOAD_FAILURE = '[Payment] File Upload Failure',

  FILE_UPLOAD_LIST = '[Payment] File Upload List',
  FILE_UPLOAD_LIST_SUCCESS = '[Payment] File Upload List Success',
  FILE_UPLOAD_LIST_FAILURE = '[Payment] File Upload List Failure',

  FILE_DOWNLOAD_URL = '[Payment] File Download Url',
  FILE_DOWNLOAD_URL_SUCCESS = '[Payment] File Download Url Success',
  FILE_DOWNLOAD_URL_FAILURE = '[Payment] File Download Url Failure',

  RESET_UPLOADED_FILE_DATA = '[Payment] Reset Uploaded File Data',

  UPDATE_PAYMENT_STATUS_FOR_VOID_UNIPAY = '[Payment] Update Payment Status For Void Unipay',
  UPDATE_PAYMENT_STATUS_FOR_VOID_UNIPAY_SUCCESS = '[Payment] Update Payment Status For Void Unipay Success',
  UPDATE_PAYMENT_STATUS_FOR_VOID_UNIPAY_FAILURE = '[Payment] Update Payment Status For Void Unipay Failure',

  UPDATE_CN_STATUS_FOR_VOID_UNIPAY = '[Payment] Update CN Status For Void Unipay',
  UPDATE_CN_STATUS_FOR_VOID_UNIPAY_SUCCESS = '[Payment] Update CN Status For Void Unipay Success',
  UPDATE_CN_STATUS_FOR_VOID_UNIPAY_FAILURE = '[Payment] Update CN Status For Void Unipay Failure',

  RESET_PAYMENT_STATUS = '[Payment] Reset Payment Status',
  RESET_CN_STATUS = '[Payment] Reset CN Status'
}

export class LoadEncireclePoints implements Action {
  readonly type = PaymentActionTypes.LOAD_ENCIRECLE_POINTS;
  constructor(public payload: string) {}
}
export class LoadEncireclePointsSuccess implements Action {
  readonly type = PaymentActionTypes.LOAD_ENCIRECLE_POINTS_SUCCESS;
  constructor(public payload: number) {}
}
export class LoadEncireclePointsFailure implements Action {
  readonly type = PaymentActionTypes.LOAD_ENCIRECLE_POINTS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadAllowedPayments implements Action {
  readonly type = PaymentActionTypes.LOAD_ALLOWED_PAYMENTS;
  constructor(public payload: TransactionTypeEnum) {}
}
export class LoadAllowedPaymentsSuccess implements Action {
  readonly type = PaymentActionTypes.LOAD_ALLOWED_PAYMENTS_SUCCESS;
  constructor(public payload: AllowedPaymentsResponse) {}
}
export class LoadAllowedPaymentsFailure implements Action {
  readonly type = PaymentActionTypes.LOAD_ALLOWED_PAYMENTS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class GetGVBalance implements Action {
  readonly type = PaymentActionTypes.GET_GV_BALANCE;
  constructor(public payload: GVStatusListingPayload) {}
}

export class GetGVBalanceSuccess implements Action {
  readonly type = PaymentActionTypes.GET_GV_BALANCE_SUCCESS;
  constructor(public payload: GVStatusUpdateList) {}
}

export class GetGVBalanceFailure implements Action {
  readonly type = PaymentActionTypes.GET_GV_BALANCE_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadMaxCashLimit implements Action {
  readonly type = PaymentActionTypes.LOAD_MAX_CASH_LIMIT;
  constructor(public payload: LoadMaxCashLimitPayload) {}
}
export class LoadMaxCashLimitSuccess implements Action {
  readonly type = PaymentActionTypes.LOAD_MAX_CASH_LIMIT_SUCCESS;
  constructor(public payload: CashLimitDetails) {}
}
export class LoadMaxCashLimitFailure implements Action {
  readonly type = PaymentActionTypes.LOAD_MAX_CASH_LIMIT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCashLimitCap implements Action {
  readonly type = PaymentActionTypes.LOAD_CASH_LIMIT_CAP;
}
export class LoadCashLimitCapSuccess implements Action {
  readonly type = PaymentActionTypes.LOAD_CASH_LIMIT_CAP_SUCCESS;
  constructor(public payload: MaxCashAmountDetails) {}
}
export class LoadCashLimitCapFailure implements Action {
  readonly type = PaymentActionTypes.LOAD_CASH_LIMIT_CAP_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ConfirmPayment implements Action {
  readonly type = PaymentActionTypes.CONFIRM_PAYMENT;
  constructor(public payload: EditCashPaymentPayload) {}
}
export class ConfirmPaymentSuccess implements Action {
  readonly type = PaymentActionTypes.CONFIRM_PAYMENT_SUCCESS;
  constructor(public payload: PaymentDetails) {}
}

export class ConfirmPaymentFailure implements Action {
  readonly type = PaymentActionTypes.CONFIRM_PAYMENT_FAILURE;
  constructor(
    public payload: {
      paymentId: string;
      error: CustomErrors;
    }
  ) {}
}

export class LoadPaymentDetails implements Action {
  readonly type = PaymentActionTypes.LOAD_PAYMENT_DETAILS;
  constructor(public payload: LoadPaymentDetailsPayload) {}
}
export class LoadPaymentDetailsSuccess implements Action {
  readonly type = PaymentActionTypes.LOAD_PAYMENT_DETAILS_SUCCESS;
  constructor(public payload: PaymentDetails[]) {}
}
export class LoadPaymentDetailsFailure implements Action {
  readonly type = PaymentActionTypes.LOAD_PAYMENT_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCreditNoteDetails implements Action {
  readonly type = PaymentActionTypes.LOAD_CREDIT_NOTE_DETAILS;
  constructor(public payload: LoadPaymentDetailsPayload) {}
}
export class LoadCreditNoteDetailsSuccess implements Action {
  readonly type = PaymentActionTypes.LOAD_CREDIT_NOTE_DETAILS_SUCCESS;
  constructor(public payload: CNListResponsePayload[]) {}
}
export class LoadCreditNoteDetailsFailure implements Action {
  readonly type = PaymentActionTypes.LOAD_CREDIT_NOTE_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCardPayerBanks implements Action {
  readonly type = PaymentActionTypes.LOAD_CARD_PAYER_BANKS;
}
export class LoadCardPayerBanksSuccess implements Action {
  readonly type = PaymentActionTypes.LOAD_CARD_PAYER_BANKS_SUCCESS;
  constructor(public payload: PaymentConfig) {}
}
export class LoadCardPayerBanksFailure implements Action {
  readonly type = PaymentActionTypes.LOAD_CARD_PAYER_BANKS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadDDPayerBanks implements Action {
  readonly type = PaymentActionTypes.LOAD_DD_PAYER_BANKS;
}
export class LoadDDPayerBanksSuccess implements Action {
  readonly type = PaymentActionTypes.LOAD_DD_PAYER_BANKS_SUCCESS;
  constructor(public payload: PaymentConfig) {}
}
export class LoadDDPayerBanksFailure implements Action {
  readonly type = PaymentActionTypes.LOAD_DD_PAYER_BANKS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadChequePayerBanks implements Action {
  readonly type = PaymentActionTypes.LOAD_CHEQUE_PAYER_BANKS;
}
export class LoadChequePayerBanksSuccess implements Action {
  readonly type = PaymentActionTypes.LOAD_CHEQUE_PAYER_BANKS_SUCCESS;
  constructor(public payload: PaymentConfig) {}
}
export class LoadChequePayerBanksFailure implements Action {
  readonly type = PaymentActionTypes.LOAD_CHEQUE_PAYER_BANKS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadPayeeBanks implements Action {
  readonly type = PaymentActionTypes.LOAD_PAYEE_BANKS;
}
export class LoadPayeeBanksSuccess implements Action {
  readonly type = PaymentActionTypes.LOAD_PAYEE_BANKS_SUCCESS;
  constructor(public payload: string[]) {}
}
export class LoadPayeeBanksFailure implements Action {
  readonly type = PaymentActionTypes.LOAD_PAYEE_BANKS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class AddChequeDDPayment implements Action {
  readonly type = PaymentActionTypes.ADD_CHEQUE_DD_PAYMENT;
  constructor(public payload: PaymentPayload) {}
}

export class AddChequeDDPaymentSuccess implements Action {
  readonly type = PaymentActionTypes.ADD_CHEQUE_DD_PAYMENT_SUCCESS;
  constructor(public payload: PaymentDetails) {}
}

export class AddChequeDDPaymentFailure implements Action {
  readonly type = PaymentActionTypes.ADD_CHEQUE_DD_PAYMENT_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class AddCashPayment implements Action {
  readonly type = PaymentActionTypes.ADD_CASH_PAYMENT;
  constructor(public payload: PaymentPayload) {}
}
export class AddCashPaymentSuccess implements Action {
  readonly type = PaymentActionTypes.ADD_CASH_PAYMENT_SUCCESS;
  constructor(public payload: PaymentDetails) {}
}

export class AddCashPaymentFailure implements Action {
  readonly type = PaymentActionTypes.ADD_CASH_PAYMENT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class AddCardPayment implements Action {
  readonly type = PaymentActionTypes.ADD_CARD_PAYMENT;
  constructor(public payload: PaymentPayload) {}
}
export class AddCardPaymentSuccess implements Action {
  readonly type = PaymentActionTypes.ADD_CARD_PAYMENT_SUCCESS;
  constructor(public payload: PaymentDetails) {}
}

export class AddCardPaymentFailure implements Action {
  readonly type = PaymentActionTypes.ADD_CARD_PAYMENT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class AddUnipayPayment implements Action {
  readonly type = PaymentActionTypes.ADD_UNIPAY_PAYMENT;
  constructor(public payload: PaymentPayload) {}
}
export class AddUnipayPaymentSuccess implements Action {
  readonly type = PaymentActionTypes.ADD_UNIPAY_PAYMENT_SUCCESS;
  constructor(public payload: UnipayTransactionDetails) {}
}
export class AddUnipayPaymentFailure implements Action {
  readonly type = PaymentActionTypes.ADD_UNIPAY_PAYMENT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class AddEncirclePointsPayment implements Action {
  readonly type = PaymentActionTypes.ADD_ENCIRCLE_POINTS_PAYMENT;
  constructor(public payload: PaymentPayload) {}
}
export class AddEncirclePointsPaymentSuccess implements Action {
  readonly type = PaymentActionTypes.ADD_ENCIRCLE_POINTS_PAYMENT_SUCCESS;
  constructor(public payload: PaymentDetails) {}
}

export class AddEncirclePointsPaymentFailure implements Action {
  readonly type = PaymentActionTypes.ADD_ENCIRCLE_POINTS_PAYMENT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class AddQCGCPayment implements Action {
  readonly type = PaymentActionTypes.ADD_QCGC_PAYMENT;
  constructor(public payload: PaymentPayload) {}
}
export class AddQCGCPaymentSuccess implements Action {
  readonly type = PaymentActionTypes.ADD_QCGC_PAYMENT_SUCCESS;
  constructor(public payload: PaymentDetails) {}
}

export class AddQCGCPaymentFailure implements Action {
  readonly type = PaymentActionTypes.ADD_QCGC_PAYMENT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class AddDigiPayment implements Action {
  readonly type = PaymentActionTypes.ADD_DIGI_GOLD_PAYMENT;
  constructor(public payload: PaymentPayload) {}
}
export class AddDigiPaymentSuccess implements Action {
  readonly type = PaymentActionTypes.ADD_DIGI_GOLD_PAYMENT_SUCCESS;
  constructor(public payload: PaymentDetails) {}
}

export class AddDigiPaymentFailure implements Action {
  readonly type = PaymentActionTypes.ADD_DIGI_GOLD_PAYMENT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class AddGVPayment implements Action {
  readonly type = PaymentActionTypes.ADD_GV_PAYMENT;
  constructor(public payload: PaymentPayload) {}
}
export class AddGVPaymentSuccess implements Action {
  readonly type = PaymentActionTypes.ADD_GV_PAYMENT_SUCCESS;
  constructor(public payload: PaymentDetails) {}
}

export class AddGVPaymentFailure implements Action {
  readonly type = PaymentActionTypes.ADD_GV_PAYMENT_FAILURE;
  constructor(public payload: PaymentPayload) {}
}

export class AddROPayment implements Action {
  readonly type = PaymentActionTypes.ADD_RO_PAYMENT;
  constructor(public payload: PaymentPayload) {}
}
export class AddROPaymentSuccess implements Action {
  readonly type = PaymentActionTypes.ADD_RO_PAYMENT_SUCCESS;
  constructor(public payload: PaymentDetails) {}
}

export class AddROPaymentFailure implements Action {
  readonly type = PaymentActionTypes.ADD_RO_PAYMENT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class AddManualPayment implements Action {
  readonly type = PaymentActionTypes.ADD_MANUAL_PAYMENT;
  constructor(public payload: PaymentPayload) {}
}
export class AddManualPaymentSuccess implements Action {
  readonly type = PaymentActionTypes.ADD_MANUAL_PAYMENT_SUCCESS;
  constructor(public payload: PaymentDetails) {}
}

export class AddManualPaymentFailure implements Action {
  readonly type = PaymentActionTypes.ADD_MANUAL_PAYMENT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SendPaymentRequest implements Action {
  readonly type = PaymentActionTypes.SEND_PAYMENT_REQUEST;
  constructor(public payload: IntegratedPaymentRequestPayload) {}
}
export class SendPaymentRequestSuccess implements Action {
  readonly type = PaymentActionTypes.SEND_PAYMENT_REQUEST_SUCCESS;
  constructor(public payload: PaymentRequest) {}
}

export class SendPaymentRequestFailure implements Action {
  readonly type = PaymentActionTypes.SEND_PAYMENT_REQUEST_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class AddWalletPayment implements Action {
  readonly type = PaymentActionTypes.ADD_WALLET_PAYMENT;
  constructor(public payload: PaymentPayload) {}
}
export class AddWalletPaymentSuccess implements Action {
  readonly type = PaymentActionTypes.ADD_WALLET_PAYMENT_SUCCESS;
  constructor(public payload: PaymentDetails) {}
}
export class AddWalletPaymentFailure implements Action {
  readonly type = PaymentActionTypes.ADD_WALLET_PAYMENT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class AddCreditNotePayment implements Action {
  readonly type = PaymentActionTypes.ADD_CREDIT_NOTE_PAYMENT;
  constructor(public payload: PaymentPayload) {}
}
export class AddCreditNotePaymentSuccess implements Action {
  readonly type = PaymentActionTypes.ADD_CREDIT_NOTE_PAYMENT_SUCCESS;
  constructor(public payload: PaymentDetails) {}
}
export class AddCreditNotePaymentFailure implements Action {
  readonly type = PaymentActionTypes.ADD_CREDIT_NOTE_PAYMENT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class AddEmployeeLoanPayment implements Action {
  readonly type = PaymentActionTypes.ADD_EMPLOYEE_LOAN_PAYMENT;
  constructor(public payload: PaymentPayload) {}
}
export class AddEmployeeLoanPaymentSuccess implements Action {
  readonly type = PaymentActionTypes.ADD_EMPLOYEE_LOAN_PAYMENT_SUCCESS;
  constructor(public payload: PaymentDetails) {}
}
export class AddEmployeeLoanPaymentFailure implements Action {
  readonly type = PaymentActionTypes.ADD_EMPLOYEE_LOAN_PAYMENT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class AddAirpayPayment implements Action {
  readonly type = PaymentActionTypes.ADD_AIRPAY_PAYMENT;
  constructor(public payload: PaymentPayload) {}
}
export class AddAirpayPaymentSuccess implements Action {
  readonly type = PaymentActionTypes.ADD_AIRPAY_PAYMENT_SUCCESS;
  constructor(public payload: PaymentDetails) {}
}
export class AddAirpayPaymentFailure implements Action {
  readonly type = PaymentActionTypes.ADD_AIRPAY_PAYMENT_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class StartAirpayIntPayment implements Action {
  readonly type = PaymentActionTypes.START_AIRPAY_INT_PAYMENT;
  constructor(public payload: PaymentPayload) {}
}
export class StartAirpayIntPaymentSuccess implements Action {
  readonly type = PaymentActionTypes.START_AIRPAY_INT_PAYMENT_SUCCESS;
  constructor(public payload: PaymentDetails) {}
}
export class StartAirpayIntPaymentFailure implements Action {
  readonly type = PaymentActionTypes.START_AIRPAY_INT_PAYMENT_FAILURE;
  constructor(public payload: CustomErrors) {}
}
//TODO changepayload
export class UpdateIntPayment implements Action {
  readonly type = PaymentActionTypes.UPDATE_INT_PAYMENT;
  constructor(public payload: string) {}
}
export class UpdateIntPaymentSuccess implements Action {
  readonly type = PaymentActionTypes.UPDATE_INT_PAYMENT_SUCCESS;
  constructor(public payload: PaymentRequest) {}
}
export class UpdateIntPaymentFailure implements Action {
  readonly type = PaymentActionTypes.UPDATE_INT_PAYMENT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ValidateIntPayment implements Action {
  readonly type = PaymentActionTypes.VALIDATE_INT_PAYMENT;
  constructor(public payload: string) {}
}
export class ValidateIntPaymentSuccess implements Action {
  readonly type = PaymentActionTypes.VALIDATE_INT_PAYMENT_SUCCESS;
  constructor(public payload: PaymentRequest) {}
}
export class ValidateIntPaymentFailure implements Action {
  readonly type = PaymentActionTypes.VALIDATE_INT_PAYMENT_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadOpenAirpayPaymentDetails implements Action {
  readonly type = PaymentActionTypes.LOAD_OPEN_AIRPAY_PAYMENT_DETAILS;
  constructor(public payload: LoadPaymentDetailsPayload) {}
}
export class LoadOpenAirpayPaymentDetailsSuccess implements Action {
  readonly type = PaymentActionTypes.LOAD_OPEN_AIRPAY_PAYMENT_DETAILS_SUCCESS;
  constructor(public payload: PaymentDetails[]) {}
}
export class LoadOpenAirpayPaymentDetailsFailure implements Action {
  readonly type = PaymentActionTypes.LOAD_OPEN_AIRPAY_PAYMENT_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class StartRazorpayPayment implements Action {
  readonly type = PaymentActionTypes.START_RAZORPAY_PAYMENT;
  constructor(public payload: PaymentPayload) {}
}
export class StartRazorpayPaymentSuccess implements Action {
  readonly type = PaymentActionTypes.START_RAZORPAY_PAYMENT_SUCCESS;
  constructor(public payload: PaymentDetails) {}
}
export class StartRazorpayPaymentFailure implements Action {
  readonly type = PaymentActionTypes.START_RAZORPAY_PAYMENT_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class UpdateRazorpayPayment implements Action {
  readonly type = PaymentActionTypes.UPDATE_RAZORPAY_PAYMENT;
  constructor(public payload: ResendPaymentLinkPayload) {}
}
export class UpdateRazorpayPaymentSuccess implements Action {
  readonly type = PaymentActionTypes.UPDATE_RAZORPAY_PAYMENT_SUCCESS;
  constructor(public payload: PaymentDetails) {}
}
export class UpdateRazorpayPaymentFailure implements Action {
  readonly type = PaymentActionTypes.UPDATE_RAZORPAY_PAYMENT_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class UpdateRazorpayPaymentStatus implements Action {
  readonly type = PaymentActionTypes.UPDATE_RAZORPAY_PAYMENT_STATUS;
  constructor(public payload: PaymentDetails) {}
}

export class ValidateRazorpayPayment implements Action {
  readonly type = PaymentActionTypes.VALIDATE_RAZORPAY_PAYMENT;
  constructor(public payload: ValidatePaymentPayload) {}
}
export class ValidateRazorpayPaymentSuccess implements Action {
  readonly type = PaymentActionTypes.VALIDATE_RAZORPAY_PAYMENT_SUCCESS;
  constructor(public payload: PaymentDetails) {}
}
export class ValidateRazorpayPaymentFailure implements Action {
  readonly type = PaymentActionTypes.VALIDATE_RAZORPAY_PAYMENT_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class ValidatePayment implements Action {
  readonly type = PaymentActionTypes.VALIDATE_PAYMENT;
  constructor(public payload: ValidatePaymentPayload) {}
}
export class ValidatePaymentSuccess implements Action {
  readonly type = PaymentActionTypes.VALIDATE_PAYMENT_SUCCESS;
  constructor(public payload: PaymentDetails) {}
}
export class ValidatePaymentFailure implements Action {
  readonly type = PaymentActionTypes.VALIDATE_PAYMENT_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadROPaymentRequestStatus implements Action {
  readonly type = PaymentActionTypes.LOAD_RO_PAYMENT_REQUEST_STATUS;
  constructor(public payload: string) {}
}
export class LoadROPaymentRequestStatusSuccess implements Action {
  readonly type = PaymentActionTypes.LOAD_RO_PAYMENT_REQUEST_STATUS_SUCCESS;
  constructor(public payload: PaymentRequest) {}
}
export class LoadROPaymentRequestStatusFailure implements Action {
  readonly type = PaymentActionTypes.LOAD_RO_PAYMENT_REQUEST_STATUS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadPaymentRequestStatus implements Action {
  readonly type = PaymentActionTypes.LOAD_PAYMENT_REQUEST_STATUS;
  constructor(public payload: string, public paymentCode: PaymentModeEnum) {}
}
export class LoadPaymentRequestStatusSuccess implements Action {
  readonly type = PaymentActionTypes.LOAD_PAYMENT_REQUEST_STATUS_SUCCESS;
  constructor(public payload: PaymentRequest[]) {}
}
export class LoadPaymentRequestStatusFailure implements Action {
  readonly type = PaymentActionTypes.LOAD_PAYMENT_REQUEST_STATUS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateAirpayIntPaymentStatus implements Action {
  readonly type = PaymentActionTypes.UPDATE_AIRPAY_INT_PAYMENT_STATUS;
  constructor(public payload: PaymentDetails) {}
}

export class AddRtgsPayment implements Action {
  readonly type = PaymentActionTypes.ADD_RTGS_PAYMENT;
  constructor(public payload: PaymentPayload) {}
}
export class AddRtgsPaymentSuccess implements Action {
  readonly type = PaymentActionTypes.ADD_RTGS_PAYMENT_SUCCESS;
  constructor(public payload: PaymentDetails) {}
}
export class AddRtgsPaymentFailure implements Action {
  readonly type = PaymentActionTypes.ADD_RTGS_PAYMENT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class AddUPIPayment implements Action {
  readonly type = PaymentActionTypes.ADD_UPI_PAYMENT;
  constructor(public payload: PaymentPayload) {}
}
export class AddUPIPaymentSuccess implements Action {
  readonly type = PaymentActionTypes.ADD_UPI_PAYMENT_SUCCESS;
  constructor(public payload: PaymentDetails) {}
}
export class AddUPIPaymentFailure implements Action {
  readonly type = PaymentActionTypes.ADD_UPI_PAYMENT_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class StartUnipayPayment implements Action {
  readonly type = PaymentActionTypes.START_UNIPAY_PAYMENT;
  constructor(public payload: UniPayRequest) {}
}
export class StartUnipayPaymentSuccess implements Action {
  readonly type = PaymentActionTypes.START_UNIPAY_PAYMENT_SUCCESS;
  constructor(public payload: OtherDetailsForUnipay) {}
}
export class StartUnipayPaymentFailure implements Action {
  readonly type = PaymentActionTypes.START_UNIPAY_PAYMENT_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class ResetTrasactionID implements Action {
  readonly type = PaymentActionTypes.RESET_TRANSACTION_ID;
}

export class DeletePayment implements Action {
  readonly type = PaymentActionTypes.DELETE_PAYMENT;
  constructor(
    public payload: DeletePaymentPayload,
    public deletedPayment?: PaymentDetails
  ) {}
}
export class DeletePaymentSuccess implements Action {
  readonly type = PaymentActionTypes.DELETE_PAYMENT_SUCCESS;
  constructor(public payload: string, public deletedPayment?: PaymentDetails) {}
}

export class DeletePaymentFailure implements Action {
  readonly type = PaymentActionTypes.DELETE_PAYMENT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class EditCashPayment implements Action {
  readonly type = PaymentActionTypes.EDIT_CASH_PAYMENT;
  constructor(public payload: EditCashPaymentPayload) {}
}
export class EditCashPaymentSuccess implements Action {
  readonly type = PaymentActionTypes.EDIT_CASH_PAYMENT_SUCCESS;
  constructor(public payload: PaymentDetails) {}
}

export class EditCashPaymentFailure implements Action {
  readonly type = PaymentActionTypes.EDIT_CASH_PAYMENT_FAILURE;
  constructor(
    public payload: {
      paymentId: string;
      error: CustomErrors;
    }
  ) {}
}
export class ResetCashPaymentAmount implements Action {
  readonly type = PaymentActionTypes.RESET_CASH_PAYMENT_AMOUNT;
  constructor(
    public payload: {
      paymentId: string;
    }
  ) {}
}
export class ClearPaymentDetails implements Action {
  readonly type = PaymentActionTypes.CLEAR_PAYMENT_DETAILS;
}

export class UpdateUnipayPayment implements Action {
  readonly type = PaymentActionTypes.UPDATE_UNIPAY_PAYMENT;
  constructor(public payload: UpdateUnipayPaylaod) {}
}
export class UpdateUnipayPaymentSuccess implements Action {
  readonly type = PaymentActionTypes.UPDATE_UNIPAY_PAYMENT_SUCCESS;
  constructor(public payload: PaymentDetails) {}
}
export class UpdateUnipayPaymentFailure implements Action {
  readonly type = PaymentActionTypes.UPDATE_UNIPAY_PAYMENT_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class VoidUnipayPayment implements Action {
  readonly type = PaymentActionTypes.VOID_UNIPAY_PAYMENT;
  constructor(public payload: UniPayRequest) {}
}
export class VoidUnipayPaymentSuccess implements Action {
  readonly type = PaymentActionTypes.VOID_UNIPAY_PAYMENT_SUCCESS;
  constructor(public payload: UnipaySuccessDetails) {}
}
export class VoidUnipayPaymentFailure implements Action {
  readonly type = PaymentActionTypes.VOID_UNIPAY_PAYMENT_FAILURE;
  constructor(public payload: UnipayErrorDetails) {}
}

export class GetQCGCBalance implements Action {
  readonly type = PaymentActionTypes.GET_QCGC_BALANCE;
  constructor(public payload: QCGCGetBalancePayload) {}
}
export class GetQCGCBalanceSuccess implements Action {
  readonly type = PaymentActionTypes.GET_QCGC_BALANCE_SUCCESS;
  constructor(public payload: QCGCCardDetails) {}
}
export class GetQCGCBalanceFailure implements Action {
  readonly type = PaymentActionTypes.GET_QCGC_BALANCE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetQCGC implements Action {
  readonly type = PaymentActionTypes.RESET_QCGC;
}

export class ResetFailedGV implements Action {
  readonly type = PaymentActionTypes.RESET_FAILED_GV;
}

export class ResetCreditNoteList implements Action {
  readonly type = PaymentActionTypes.RESET_CREDIT_NOTE_LIST;
}

export class ResetInvokedCreditNote implements Action {
  readonly type = PaymentActionTypes.RESET_INVOKED_CREDIT_NOTE;
}
export class ResetGHSeVoucher implements Action {
  readonly type = PaymentActionTypes.RESET_GHS_eVOUCHER;
}
export class ResetPayment implements Action {
  readonly type = PaymentActionTypes.RESET_PAYMENT;
}

export class ResetEncirclePaymentAdded implements Action {
  readonly type = PaymentActionTypes.RESET_ENCIRCLE_PAYMENT_ADDED;
}

export class UnipayHostConfiguration implements Action {
  readonly type = PaymentActionTypes.LOAD_UNIPAY_HOST_CONFIGURATION;
}

export class UnipayHostConfigurationSuccess implements Action {
  readonly type = PaymentActionTypes.LOAD_UNIPAY_HOST_CONFIGURATION_SUCCESS;

  constructor(public payload: string[]) {}
}
export class UnipayHostConfigurationFailure implements Action {
  readonly type = PaymentActionTypes.LOAD_UNIPAY_HOST_CONFIGURATION_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadRSOList implements Action {
  readonly type = PaymentActionTypes.LOAD_RSO_LIST;
}

export class LoadRSOListSuccess implements Action {
  readonly type = PaymentActionTypes.LOAD_RSO_LIST_SUCCESS;
  constructor(public payload: StoreUser[]) {}
}

export class LoadRSOListFailure implements Action {
  readonly type = PaymentActionTypes.LOAD_RSO_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCMRequestPaymentDetails implements Action {
  readonly type = PaymentActionTypes.LOAD_CM_REQUEST_PAYMENT_DETAILS;
  constructor(public payload: CmRequestDetailsPayload) {}
}
export class LoadCMRequestPaymentDetailsSuccess implements Action {
  readonly type = PaymentActionTypes.LOAD_CM_REQUEST_PAYMENT_DETAILS_SUCCESS;
  constructor(public payload: PaymentDetails[]) {}
}
export class LoadCMRequestPaymentDetailsFailure implements Action {
  readonly type = PaymentActionTypes.LOAD_CM_REQUEST_PAYMENT_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class AddBankLoanPayment implements Action {
  readonly type = PaymentActionTypes.ADD_BANK_LOAN_PAYMENT;
  constructor(public payload: PaymentPayload) {}
}
export class AddBankLoanPaymentSuccess implements Action {
  readonly type = PaymentActionTypes.ADD_BANK_LOAN_PAYMENT_SUCCESS;
  constructor(public payload: PaymentDetails) {}
}
export class AddBankLoanPaymentFailure implements Action {
  readonly type = PaymentActionTypes.ADD_BANK_LOAN_PAYMENT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class AddGHSeVoucherPayment implements Action {
  readonly type = PaymentActionTypes.ADD_GHS_eVOUCHER_PAYMENT;
  constructor(public payload: PaymentPayload) {}
}
export class AddGHSeVoucherPaymentSuccess implements Action {
  readonly type = PaymentActionTypes.ADD_GHS_eVOUCHER_PAYMENT_SUCCESS;
  constructor(public payload: PaymentDetails) {}
}

export class AddGHSeVoucherPaymentFailure implements Action {
  readonly type = PaymentActionTypes.ADD_GHS_eVOUCHER_PAYMENT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class GetGHSeVoucherBalance implements Action {
  readonly type = PaymentActionTypes.GET_GHS_eVOUCHER_BALANCE;
  constructor(public payload: QCGCGetBalancePayload) {}
}
export class GetGHSeVoucherBalanceSuccess implements Action {
  readonly type = PaymentActionTypes.GET_GHS_eVOUCHER_BALANCE_SUCCESS;
  constructor(public payload: GHSeVoucherDetails) {}
}
export class GetGHSeVoucherBalanceFailure implements Action {
  readonly type = PaymentActionTypes.GET_GHS_eVOUCHER_BALANCE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class GetCreditNoteList implements Action {
  readonly type = PaymentActionTypes.GET_CREDIT_NOTE_LIST;
  constructor(public payload: CNListRequestPayload) {}
}
export class GetCreditNoteListSuccess implements Action {
  readonly type = PaymentActionTypes.GET_CREDIT_NOTE_LIST_SUCCESS;
  constructor(public payload: CNListResponse) {}
}
export class GetCreditNoteListFailure implements Action {
  readonly type = PaymentActionTypes.GET_CREDIT_NOTE_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class GetThirdPartyCNList implements Action {
  readonly type = PaymentActionTypes.GET_THIRD_PARTY_CN_LIST;
  constructor(public payload: ThirdPartyCNRequestPayload) {}
}
export class GetThirdPartyCNListSuccess implements Action {
  readonly type = PaymentActionTypes.GET_THIRD_PARTY_CN_LIST_SUCCESS;
  constructor(public payload: CNListResponse) {}
}
export class GetThirdPartyCNListFailure implements Action {
  readonly type = PaymentActionTypes.GET_THIRD_PARTY_CN_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class GetInvokedCreditNote implements Action {
  readonly type = PaymentActionTypes.GET_INVOKED_CREDIT_NOTE;
  constructor(public payload: InvokeCNRequestPayload) {}
}
export class GetInvokedCreditNoteSuccess implements Action {
  readonly type = PaymentActionTypes.GET_INVOKED_CREDIT_NOTE_SUCCESS;
  constructor(public payload: CNListResponse) {}
}
export class GetInvokedCreditNoteFailure implements Action {
  readonly type = PaymentActionTypes.GET_INVOKED_CREDIT_NOTE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class RemoveGV implements Action {
  readonly type = PaymentActionTypes.REMOVE_GV;
  constructor(public payload: string) {}
}
export class GetGHSAccountDetails implements Action {
  readonly type = PaymentActionTypes.GET_GHS_ACCOUNT_DETAILS;
  constructor(public payload: string) {}
}
export class GetGHSAccountDetailsSuccess implements Action {
  readonly type = PaymentActionTypes.GET_GHS_ACCOUNT_DETAILS_SUCCESS;
  constructor(public payload: GHSAccountDetails) {}
}
export class GetGHSAccountDetailsFailure implements Action {
  readonly type = PaymentActionTypes.GET_GHS_ACCOUNT_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class GetGHSAttachments implements Action {
  readonly type = PaymentActionTypes.GET_GHS_ATTACHMENTS;
  constructor(public payload: GHSAttachmentsPayload) {}
}
export class GetGHSAttachmentsSuccess implements Action {
  readonly type = PaymentActionTypes.GET_GHS_ATTACHMENTS_SUCCESS;
  constructor(public payload: GHSAttachments[]) {}
}
export class GetGHSAttachmentsFailure implements Action {
  readonly type = PaymentActionTypes.GET_GHS_ATTACHMENTS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class AddGHSAccountPayment implements Action {
  readonly type = PaymentActionTypes.ADD_GHS_ACCOUNT_PAYMENT;
  constructor(public payload: PaymentPayload) {}
}
export class AddGHSAccountPaymentSuccess implements Action {
  readonly type = PaymentActionTypes.ADD_GHS_ACCOUNT_PAYMENT_SUCCESS;
  constructor(public payload: PaymentDetails) {}
}

export class AddGHSAccountPaymentFailure implements Action {
  readonly type = PaymentActionTypes.ADD_GHS_ACCOUNT_PAYMENT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class GenerateOtpForCn implements Action {
  readonly type = PaymentActionTypes.GENERATE_OTP_FOR_CN;
  constructor(public payload: GenerateOtpPayload) {}
}

export class GenerateOtpForCnSuccess implements Action {
  readonly type = PaymentActionTypes.GENERATE_OTP_FOR_CN_SUCCESS;
}

export class GenerateOtpForCnFailure implements Action {
  readonly type = PaymentActionTypes.GENERATE_OTP_FOR_CN_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class GenerateOtpForEmpLoan implements Action {
  readonly type = PaymentActionTypes.GENERATE_OTP_FOR_EMP_LOAN;
  constructor(public payload: GenerateOtpPayload) {}
}

export class GenerateOtpForEmpLoanSuccess implements Action {
  readonly type = PaymentActionTypes.GENERATE_OTP_FOR_EMP_LOAN_SUCCESS;
}

export class GenerateOtpForEmpLoanFailure implements Action {
  readonly type = PaymentActionTypes.GENERATE_OTP_FOR_EMP_LOAN_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class GenerateOtpForDigiGold implements Action {
  readonly type = PaymentActionTypes.GENERATE_OTP_FOR_DIGI;
  constructor(public payload: GenerateOtpDigiGoldPayload) {}
}

export class GenerateOtpForDigiGoldSuccess implements Action {
  readonly type = PaymentActionTypes.GENERATE_OTP_FOR_DIGI_SUCCESS;
  constructor(public payload: any) {}
}

export class GenerateOtpForDigiGoldFailure implements Action {
  readonly type = PaymentActionTypes.GENERATE_OTP_FOR_DIGI_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class GetCreditNoteDetail implements Action {
  readonly type = PaymentActionTypes.GET_CREDIT_NOTE_DETAIL;
  constructor(public payload: string) {}
}

export class GetCreditNoteDetailSuccess implements Action {
  readonly type = PaymentActionTypes.GET_CREDIT_NOTE_DETAIL_SUCCESS;
  constructor(public payload: CreditNoteDetail) {}
}

export class GetCreditNoteDetailFailure implements Action {
  readonly type = PaymentActionTypes.GET_CREDIT_NOTE_DETAIL_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class GetDiscountIdsInCreditNote implements Action {
  readonly type = PaymentActionTypes.GET_DISCOUNT_IDS_IN_CREDIT_NOTE;
  constructor(public payload: string) {}
}

export class GetDiscountIdsInCreditNoteSuccess implements Action {
  readonly type = PaymentActionTypes.GET_DISCOUNT_IDS_IN_CREDIT_NOTE_SUCCESS;
  constructor(public payload: string[]) {}
}

export class GetDiscountIdsInCreditNoteFailure implements Action {
  readonly type = PaymentActionTypes.GET_DISCOUNT_IDS_IN_CREDIT_NOTE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SetCreditNoteTobeDeleted implements Action {
  readonly type = PaymentActionTypes.SET_SELECTED_CREDIT_NOTE_TO_BE_DELETED;
  constructor(readonly payload: PaymentDetails) {}
}

export class SetSelectedCreditNotePaymentToBeAdded implements Action {
  readonly type = PaymentActionTypes.SET_SELECTED_CREDIT_NOTE_TO_BE_ADDED;
  constructor(readonly payload: CreditNotePayment) {}
}

export class ResetCreditNotePaymentField implements Action {
  readonly type = PaymentActionTypes.RESET_CREDIT_NOTE_PAYMENT_FIELD;
  constructor(readonly payload: boolean) {}
}
export class GetDigiBalance implements Action {
  readonly type = PaymentActionTypes.GET_DIGI_BALANCE;
  constructor(public payload: DigiGetBalancePayload) {}
}
export class GetDigiBalanceSuccess implements Action {
  readonly type = PaymentActionTypes.GET_DIGI_BALANCE_SUCCESS;
  constructor(public payload: DigiGoldDetails) {}
}
export class GetDigiBalanceFailure implements Action {
  readonly type = PaymentActionTypes.GET_DIGI_BALANCE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class GetDigiPrice implements Action {
  readonly type = PaymentActionTypes.GET_DIGI_PRICE;
  constructor(public payload: DigiGetBalancePayload) {}
}
export class GetDigiPriceSuccess implements Action {
  readonly type = PaymentActionTypes.GET_DIGI_PRICE_SUCCESS;
  constructor(public payload: DigiPriceDetails) {}
}
export class GetDigiPriceFailure implements Action {
  readonly type = PaymentActionTypes.GET_DIGI_PRICE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class GetEmpLoanDetails implements Action {
  readonly type = PaymentActionTypes.GET_EMP_LOAN_DETAILS;
  constructor(public payload: LoadEmployeeDetailsPayload) {}
}
export class GetEmpLoanDetailsSuccess implements Action {
  readonly type = PaymentActionTypes.GET_EMP_LOAN_DETAILS_SUCCESS;
  constructor(public payload: EmployeeLoanConfigList) {}
}
export class GetEmpLoanDetailsFailure implements Action {
  readonly type = PaymentActionTypes.GET_EMP_LOAN_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class GetCashBackOfferBankDetails implements Action {
  readonly type = PaymentActionTypes.GET_CASH_BACK_OFFER_BANK_DETAILS;
}

export class GetCashBackOfferBankDetailsSuccess implements Action {
  readonly type = PaymentActionTypes.GET_CASH_BACK_OFFER_BANK_DETAILS_SUCCESS;
  constructor(public payload: CashBackBankDetail[]) {}
}

export class GetCashBackOfferBankDetailsFailure implements Action {
  readonly type = PaymentActionTypes.GET_CASH_BACK_OFFER_BANK_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class GetCashBackOfferConfigDetails implements Action {
  readonly type = PaymentActionTypes.GET_CASH_BACK_OFFER_CONFIG_DETAILS;
  constructor(public payload: string) {}
}

export class GetCashBackOfferConfigDetailsSuccess implements Action {
  readonly type = PaymentActionTypes.GET_CASH_BACK_OFFER_CONFIG_DETAILS_SUCCESS;
  constructor(public payload: CashBackConfigDetail) {}
}

export class GetCashBackOfferConfigDetailsFailure implements Action {
  readonly type = PaymentActionTypes.GET_CASH_BACK_OFFER_CONFIG_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ValidateCashBackOfferCard implements Action {
  readonly type = PaymentActionTypes.VALIDATE_CASH_BACK_OFFER_CARD;
  constructor(public payload: ValidateCashBackPayload) {}
}

export class ValidateCashBackOfferCardSuccess implements Action {
  readonly type = PaymentActionTypes.VALIDATE_CASH_BACK_OFFER_CARD_SUCCESS;
  constructor(public payload: any) {}
}

export class ValidateCashBackOfferCardFailure implements Action {
  readonly type = PaymentActionTypes.VALIDATE_CASH_BACK_OFFER_CARD_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetIsGRFCNAdded implements Action {
  readonly type = PaymentActionTypes.RESET_IS_GRF_CN_ADDED;
}

export class ResetDeletedPayment implements Action {
  readonly type = PaymentActionTypes.RESET_DELETED_PAYMENT;
}

export class ResetCashBackPayment implements Action {
  readonly type = PaymentActionTypes.RESET_CASH_BACK_OFFER_PAYMENT;
}

export class FileUpload implements Action {
  readonly type = PaymentActionTypes.FILE_UPLOAD;
  constructor(public payload: FileUploadDownloadPayload) {}
}

export class FileUploadSuccess implements Action {
  readonly type = PaymentActionTypes.FILE_UPLOAD_SUCCESS;
  constructor(public payload: boolean) {}
}

export class FileUploadFailure implements Action {
  readonly type = PaymentActionTypes.FILE_UPLOAD_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class FileUploadList implements Action {
  readonly type = PaymentActionTypes.FILE_UPLOAD_LIST;
  constructor(public payload: FileUploadDownloadPayload) {}
}

export class FileUploadListSuccess implements Action {
  readonly type = PaymentActionTypes.FILE_UPLOAD_LIST_SUCCESS;
  constructor(public payload: FileUploadLists[]) {}
}

export class FileUploadListFailure implements Action {
  readonly type = PaymentActionTypes.FILE_UPLOAD_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class FileDownloadUrl implements Action {
  readonly type = PaymentActionTypes.FILE_DOWNLOAD_URL;
  constructor(public payload: { id: string; locationCode: string }) {}
}

export class FileDownloadUrlSuccess implements Action {
  readonly type = PaymentActionTypes.FILE_DOWNLOAD_URL_SUCCESS;
  constructor(public payload: string) {}
}

export class FileDownloadUrlFailure implements Action {
  readonly type = PaymentActionTypes.FILE_DOWNLOAD_URL_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetUploadedFileData implements Action {
  readonly type = PaymentActionTypes.RESET_UPLOADED_FILE_DATA;
}

export class UpdatePaymentStatusForVoidUnipay implements Action {
  readonly type = PaymentActionTypes.UPDATE_PAYMENT_STATUS_FOR_VOID_UNIPAY;
  constructor(public payload: UpdatePaymentDetailsForVoidUnipayPayload) {}
}

export class UpdatePaymentStatusForVoidUnipaySuccess implements Action {
  readonly type =
    PaymentActionTypes.UPDATE_PAYMENT_STATUS_FOR_VOID_UNIPAY_SUCCESS;
  constructor(
    public payload: {
      res: boolean;
      callCancelBillWithReturn: boolean;
    }
  ) {}
}

export class UpdatePaymentStatusForVoidUnipayFailure implements Action {
  readonly type =
    PaymentActionTypes.UPDATE_PAYMENT_STATUS_FOR_VOID_UNIPAY_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateCNStatusForVoidUnipay implements Action {
  readonly type = PaymentActionTypes.UPDATE_CN_STATUS_FOR_VOID_UNIPAY;
  constructor(public payload: string) {}
}

export class UpdateCNStatusForVoidUnipaySuccess implements Action {
  readonly type = PaymentActionTypes.UPDATE_CN_STATUS_FOR_VOID_UNIPAY_SUCCESS;
  constructor(public payload: boolean) {}
}

export class UpdateCNStatusForVoidUnipayFailure implements Action {
  readonly type = PaymentActionTypes.UPDATE_CN_STATUS_FOR_VOID_UNIPAY_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetPaymentStatus implements Action {
  readonly type = PaymentActionTypes.RESET_PAYMENT_STATUS;
}

export class ResetCNStatus implements Action {
  readonly type = PaymentActionTypes.RESET_CN_STATUS;
}

export type PaymentActions =
  | LoadEncireclePoints
  | LoadEncireclePointsSuccess
  | LoadEncireclePointsFailure
  | UpdateUnipayPayment
  | UpdateUnipayPaymentSuccess
  | UpdateUnipayPaymentFailure
  | LoadAllowedPayments
  | LoadAllowedPaymentsSuccess
  | LoadAllowedPaymentsFailure
  | LoadPaymentDetails
  | LoadPaymentDetailsSuccess
  | LoadPaymentDetailsFailure
  | DeletePayment
  | DeletePaymentSuccess
  | DeletePaymentFailure
  | ClearPaymentDetails
  | ResetTrasactionID
  | AddCashPayment
  | AddCashPaymentSuccess
  | AddCashPaymentFailure
  | AddCardPayment
  | AddCardPaymentSuccess
  | AddCardPaymentFailure
  | AddChequeDDPayment
  | AddChequeDDPaymentSuccess
  | AddChequeDDPaymentFailure
  | AddEncirclePointsPayment
  | AddEncirclePointsPaymentSuccess
  | AddEncirclePointsPaymentFailure
  | AddWalletPayment
  | AddWalletPaymentSuccess
  | AddWalletPaymentFailure
  | AddAirpayPayment
  | RemoveGV
  | AddAirpayPaymentSuccess
  | AddAirpayPaymentFailure
  | AddRtgsPayment
  | AddRtgsPaymentSuccess
  | AddRtgsPaymentFailure
  | AddUPIPayment
  | AddUPIPaymentSuccess
  | AddUPIPaymentFailure
  | AddUnipayPayment
  | AddUnipayPaymentSuccess
  | ResetCashPaymentAmount
  | AddUnipayPaymentFailure
  | LoadCreditNoteDetails
  | LoadCreditNoteDetailsSuccess
  | LoadCreditNoteDetailsFailure
  | StartUnipayPayment
  | StartUnipayPaymentSuccess
  | StartUnipayPaymentFailure
  | GetDigiPrice
  | GetDigiPriceSuccess
  | GetDigiPriceFailure
  | LoadCardPayerBanks
  | LoadCardPayerBanksSuccess
  | LoadCardPayerBanksFailure
  | LoadDDPayerBanks
  | LoadDDPayerBanksSuccess
  | LoadDDPayerBanksFailure
  | LoadChequePayerBanks
  | GetDigiBalance
  | GetDigiBalanceSuccess
  | GetDigiBalanceFailure
  | LoadChequePayerBanksSuccess
  | LoadChequePayerBanksFailure
  | LoadPayeeBanks
  | LoadPayeeBanksSuccess
  | LoadPayeeBanksFailure
  | VoidUnipayPayment
  | VoidUnipayPaymentSuccess
  | VoidUnipayPaymentFailure
  | GetQCGCBalance
  | GetQCGCBalanceSuccess
  | GetQCGCBalanceFailure
  | AddQCGCPayment
  | AddQCGCPaymentSuccess
  | AddQCGCPaymentFailure
  | AddROPayment
  | AddROPaymentSuccess
  | AddROPaymentFailure
  | ValidatePayment
  | ValidatePaymentSuccess
  | ValidatePaymentFailure
  | AddManualPayment
  | AddManualPaymentSuccess
  | AddManualPaymentFailure
  | ResetQCGC
  | ResetPayment
  | EditCashPayment
  | EditCashPaymentSuccess
  | EditCashPaymentFailure
  | LoadPaymentRequestStatus
  | LoadPaymentRequestStatusSuccess
  | LoadPaymentRequestStatusFailure
  | AddGVPayment
  | AddGVPaymentSuccess
  | AddGVPaymentFailure
  | LoadMaxCashLimit
  | LoadMaxCashLimitSuccess
  | LoadMaxCashLimitFailure
  | UnipayHostConfiguration
  | UnipayHostConfigurationSuccess
  | UnipayHostConfigurationFailure
  | SendPaymentRequest
  | SendPaymentRequestSuccess
  | SendPaymentRequestFailure
  | StartAirpayIntPayment
  | StartAirpayIntPaymentSuccess
  | StartAirpayIntPaymentFailure
  | UpdateIntPayment
  | UpdateIntPaymentSuccess
  | UpdateIntPaymentFailure
  | ValidateIntPayment
  | ValidateIntPaymentSuccess
  | ValidateIntPaymentFailure
  | LoadOpenAirpayPaymentDetails
  | LoadOpenAirpayPaymentDetailsSuccess
  | LoadOpenAirpayPaymentDetailsFailure
  | UpdateAirpayIntPaymentStatus
  | StartRazorpayPayment
  | StartRazorpayPaymentSuccess
  | StartRazorpayPaymentFailure
  | UpdateRazorpayPayment
  | UpdateRazorpayPaymentSuccess
  | UpdateRazorpayPaymentFailure
  | UpdateRazorpayPaymentStatus
  | ValidateRazorpayPayment
  | ValidateRazorpayPaymentSuccess
  | ValidateRazorpayPaymentFailure
  | ConfirmPayment
  | ConfirmPaymentSuccess
  | ConfirmPaymentFailure
  | LoadRSOList
  | LoadRSOListSuccess
  | LoadRSOListFailure
  | LoadROPaymentRequestStatus
  | LoadROPaymentRequestStatusSuccess
  | LoadROPaymentRequestStatusFailure
  | LoadCMRequestPaymentDetails
  | LoadCMRequestPaymentDetailsSuccess
  | LoadCMRequestPaymentDetailsFailure
  | AddBankLoanPayment
  | AddBankLoanPaymentSuccess
  | AddBankLoanPaymentFailure
  | AddGHSeVoucherPayment
  | AddGHSeVoucherPaymentSuccess
  | AddGHSeVoucherPaymentFailure
  | GetGHSeVoucherBalance
  | GetGHSeVoucherBalanceSuccess
  | GetGHSeVoucherBalanceFailure
  | ResetGHSeVoucher
  | GetGVBalance
  | GetGVBalanceSuccess
  | GetGVBalanceFailure
  | GetCreditNoteList
  | GetCreditNoteListSuccess
  | GetCreditNoteListFailure
  | ResetCreditNoteList
  | ResetEncirclePaymentAdded
  | ResetFailedGV
  | AddCreditNotePayment
  | AddCreditNotePaymentSuccess
  | AddCreditNotePaymentFailure
  | GetInvokedCreditNote
  | GetInvokedCreditNoteSuccess
  | GetInvokedCreditNoteFailure
  | ResetInvokedCreditNote
  | GetThirdPartyCNList
  | GetThirdPartyCNListSuccess
  | GetThirdPartyCNListFailure
  | GenerateOtpForCn
  | GenerateOtpForCnSuccess
  | GenerateOtpForCnFailure
  | GenerateOtpForDigiGold
  | GenerateOtpForDigiGoldFailure
  | GenerateOtpForDigiGoldSuccess
  | LoadCashLimitCap
  | LoadCashLimitCapSuccess
  | LoadCashLimitCapFailure
  | GetGHSAccountDetails
  | GetGHSAccountDetailsSuccess
  | GetGHSAccountDetailsFailure
  | GetGHSAttachments
  | GetGHSAttachmentsSuccess
  | GetGHSAttachmentsFailure
  | AddGHSAccountPayment
  | AddGHSAccountPaymentSuccess
  | AddDigiPayment
  | AddDigiPaymentSuccess
  | AddDigiPaymentFailure
  | AddGHSAccountPaymentFailure
  | GetCreditNoteDetail
  | GetCreditNoteDetailSuccess
  | GetCreditNoteDetailFailure
  | GetDiscountIdsInCreditNote
  | GetDiscountIdsInCreditNoteSuccess
  | GetDiscountIdsInCreditNoteFailure
  | SetCreditNoteTobeDeleted
  | SetSelectedCreditNotePaymentToBeAdded
  | ResetCreditNotePaymentField
  | ResetIsGRFCNAdded
  | GetEmpLoanDetails
  | GetEmpLoanDetailsSuccess
  | GetEmpLoanDetailsFailure
  | AddEmployeeLoanPayment
  | AddEmployeeLoanPaymentSuccess
  | AddEmployeeLoanPaymentFailure
  | GenerateOtpForEmpLoan
  | GenerateOtpForEmpLoanSuccess
  | GenerateOtpForEmpLoanFailure
  | ResetDeletedPayment
  | GetCashBackOfferBankDetails
  | GetCashBackOfferBankDetailsSuccess
  | GetCashBackOfferBankDetailsFailure
  | GetCashBackOfferConfigDetails
  | GetCashBackOfferConfigDetailsSuccess
  | GetCashBackOfferConfigDetailsFailure
  | ValidateCashBackOfferCard
  | ValidateCashBackOfferCardSuccess
  | ValidateCashBackOfferCardFailure
  | ResetCashBackPayment
  | FileUpload
  | FileUploadSuccess
  | FileUploadFailure
  | FileUploadList
  | FileUploadListSuccess
  | FileUploadListFailure
  | FileDownloadUrl
  | FileDownloadUrlSuccess
  | FileDownloadUrlFailure
  | ResetUploadedFileData
  | UpdatePaymentStatusForVoidUnipay
  | UpdatePaymentStatusForVoidUnipaySuccess
  | UpdatePaymentStatusForVoidUnipayFailure
  | UpdateCNStatusForVoidUnipay
  | UpdateCNStatusForVoidUnipaySuccess
  | UpdateCNStatusForVoidUnipayFailure
  | ResetPaymentStatus
  | ResetCNStatus;
