import {
  CustomErrors,
  PaymentModeEnum,
  UniPayResponse,
  QCGCCardDetails,
  PaymentGroupEnum,
  PaymentConfig,
  OtherDetailsForUnipay,
  PaymentDetails,
  StoreUser,
  PaymentRequest,
  UnipayTransactionDetails,
  GHSeVoucherDetails,
  CNListResponse,
  CNListResponsePayload,
  PaymentPayload,
  GHSAccountDetails,
  GHSAttachments,
  CreditNoteDetail,
  CreditNotePayment,
  DigiPriceDetails,
  DigiGoldDetails,
  CashLimitDetails,
  MaxCashAmountDetails,
  EmployeeLoanConfigList,
  CashBackBankDetail,
  CashBackConfigDetail,
  FileUploadLists,
  UnipayErrorDetails,
  UnipaySuccessDetails
} from '@poss-web/shared/models';
import {
  PaymentDetailsEntity,
  GVStatusUpdateEntity,
  IntegratedPaymentRequestDetailsEntity
} from './payment.entity';

export class PaymentState {
  error: CustomErrors;
  isLoading: boolean;
  isUnipayLoading: boolean;
  isChequeDDPaymentSuccess: boolean;

  allowedPayments: Map<PaymentModeEnum, PaymentGroupEnum>;
  wallets: string[];
  customerSpecificPayments: PaymentModeEnum[];
  customerSpecificWalletPayments: string[];
  currentConfirmedPayment: PaymentDetails;
  customerSpecificBankLoanPayments: string[];
  rsoList: StoreUser[];

  encirclePoints: number;
  maxCashLimit: number;
  maxCashLimitDetails: CashLimitDetails;
  cashAmountMaxCap: MaxCashAmountDetails;
  payeeBanks: string[];
  paymentDetails: PaymentDetailsEntity;
  QCGCDetails: QCGCCardDetails;
  digiDetails: DigiGoldDetails;
  digiPrice: DigiPriceDetails;
  GHSeVoucherDetails: GHSeVoucherDetails;
  loadMaxCashLimit: {
    load: boolean;
  };
  chequePayerBanks: string[];
  ddPayerBanks: string[];
  isEncirclePaymentAdded: boolean;
  cardConfig: PaymentConfig;
  subBankLoans: string[];
  paymentFieldNames: string[];
  isPaymentDeleted: boolean;
  paymentRequests: IntegratedPaymentRequestDetailsEntity;
  // Unipay
  unipayPaymentDetails: OtherDetailsForUnipay | string;
  unipayVoidPaymentDetails: UnipaySuccessDetails | UnipayErrorDetails;
  unipayTransactionDetails: UnipayTransactionDetails;
  enableUnipay: string[];
  failedGV: PaymentPayload[];
  recentDeletedPayment: PaymentDetails;
  newDigiGoldPayment: PaymentDetails;

  roPaymentStatus: { isSuccess: boolean; transactionId: string };
  roPaymentRequest: PaymentRequest;
  //Airpay int
  airpaySendLinkResponse: PaymentDetailsEntity;
  airpayOpenPaymentsDetails: PaymentDetailsEntity;
  //razorpay
  razorpaySendLinkResponse: PaymentDetailsEntity;
  creditNoteList: CNListResponse;
  cnDetails: CNListResponsePayload[];
  invokedCN: CNListResponse;
  GVDetails: GVStatusUpdateEntity;
  thirdPartyCnList: CNListResponse;
  isCnOtpGenerated: boolean;
  isEmpLoanOtpGenerated: boolean;
  isDigiOtpGenerated: boolean;
  GHSAccountDetails: GHSAccountDetails;
  ghsAttachments: GHSAttachments[];
  isAddGhsSuccess: boolean;
  ghsResponse: any;
  creditNoteDetails: CreditNoteDetail;
  discountIdsInCreditNote: string[];
  selectedCreditNotePaymentToBeDeleted: PaymentDetails;
  selectedCreditNotePaymentToBeAdded: CreditNotePayment;
  creditNotePaymentAdded: boolean;
  creditNotePaymentAddedRes: PaymentDetails;
  isGRFCNAdded: boolean;
  empLoanDetails: EmployeeLoanConfigList;
  // Cashback offer
  cashBackBankDetails: CashBackBankDetail[];
  cashBackConfigDetails: CashBackConfigDetail;
  isCashBackCardValidated: any;
  uploadFileResponse: boolean;
  uploadFileListResponse: FileUploadLists[];
  downloadFileUrl: string;
  updatePaymentStatusForVoidUnipayRes: {
    res: boolean;
    callCancelBillWithReturn: boolean;
  };
  errorWhileUpdatingPaymentStatusForVoidUnipay: boolean;
  updateCNStatusForVoidUnipayRes: boolean;
  errorWhileUpdatingCNStatusForVoidUnipay: boolean;
  isValidateRazorPay: boolean;
  isResendLinkRazorPay: boolean;
}
