import { Moment } from 'moment';
import {
  PaymentModeEnum,
  PaymentGroupEnum,
  PaymentStatusEnum
} from './payment.enum';

import { TransactionTypeEnum, SubTransactionTypeEnum } from './cash-memo.enum';
import { WorkflowTypeEnum } from '../manual-cm-request/cm-request.enum';
import { GiftCardTxnEnum } from '../gift-cards/gift-cards.enum';

export type AllowedPayments = Map<PaymentModeEnum, PaymentGroupEnum>;

export interface AllowedPaymentsResponse {
  allowedPayments: AllowedPayments;
  wallets: string[];
  subBankLoans: string[];
  customerSpecificPayments: PaymentModeEnum[];
  customerSpecificWalletPayments: string[];
  customerSpecificBankLoanPayments: string[];
  paymentFieldNames?: string[];
}

export interface PaymentConfig {
  payerBanks: string[];
  cardType: string[];
  isBankMandatory: boolean;
  isCardTypeMandatory: boolean;
}

export interface PaymentPayload {
  transactionType: TransactionTypeEnum;
  subTransactionType: SubTransactionTypeEnum;
  transactionId: string;
  paymentDetails: PaymentType;
  PaymentFailureMsg?: string;
  isTcsPayment?: boolean;
}

export interface EditCashDetails {
  paymentId: string;
  paymentGroup: PaymentGroupEnum;
  details: CashPaymentPayload;
}

export interface EditCashPaymentPayload {
  transactionType: TransactionTypeEnum;
  subTransactionType: SubTransactionTypeEnum;
  paymentDetails: EditCashDetails;
  paymentMode?: PaymentModeEnum;
}

export interface DeletePaymentPayload {
  transactionType: TransactionTypeEnum;
  subTransactionType: SubTransactionTypeEnum;
  paymentId: string;
  showPopup?: boolean;
}

export interface PaymentRequest {
  customerId: number;
  paymentCode: string;
  amount: number;
  requestedReason: string;
  approvedBy: string;
  referenceId: string;
  id: string;
  status: string;
  utilizedAmount: number;
  locationCode: string;
  requestedBy: string;
  requestedDate: Moment;
  approvedDate: Moment;
  approvedReason: string;
  otherDetails: {
    type: string;
    data: {
      customerName: string;
      customerTitle: string;
      customerMobileNumber: string;
      referenceId: string;
      approvedTime?: any;
    };
  };
}

// export interface PaymentDetails {
//   amount: number;
//   id: string;
//   paymentCode: PaymentModeEnum;
//   paymentGroup: PaymentGroupEnum;
//   instrumentDate: Moment;
//   instrumentNo: string;
//   instrumentType: string;
//   // Line item number : use it for sort
//   lineItemNo: number;
//   otherDetails: {
//     data: any;
//     type: string;
//   };
//   payeeBankName: string;
//   payerBankBranch: string;
//   payerBankName: string;
//   reference1: string;
//   reference2: string;
//   reference3: string;
//   remarks: string;
//   status: string;
//   bankName: string;
// }

export interface PaymentDetails {
  amount?: number;
  id?: string;
  paymentCode: PaymentModeEnum;
  paymentGroup?: PaymentGroupEnum;
  instrumentDate?: Moment;
  instrumentNo?: string;
  instrumentType?: string;
  // Line item number : use it for sort
  lineItemNo?: number;
  otherDetails?: {
    data: any;
    type: string;
  };
  creditNoteId?: string;
  bankName?: string;
  bankBranch?: string;
  reference1?: string;
  reference2?: string;
  reference3?: string;
  remarks?: string;
  status: string;
  isDeletable?: boolean;
  isEditable?: boolean;
  cashCollected?: number;
  discount?: number;
  isTcsPayment?: boolean;
  refundAmount?: number;
  hostName?: string;
  paymentDate?: Moment;
  isVoid?: boolean;
  showPopup?: boolean;
}

export interface CashPaymentPayload {
  amount: number;
}
export interface CardPaymentPayload {
  amount: number;
  instrumentDate: string;
  instrumentType: string;
  bankName: string;
  reference1: string;
}

export interface UniPayPaymentPayload {
  amount: number;
}

export interface EnteredGHSDetails {
  accountNumber: string;
  passbookNumber: string;
  otp: string;
  imageUrl: string;
}
export interface EncirclePointsPaymentPayload {
  amount: number;
  instrumentDate: string;
  instrumentNo: string;
}

export interface DDPaymentPayload {
  bankName: string;
  // payerBankBranch: string;
  instrumentNo: string;
  instrumentDate: Moment;
  amount: number;
}

export interface ChequePaymentPayload {
  bankName: string;
  // payerBankBranch: string;
  instrumentNo: string;
  instrumentDate: Moment;
  amount: number;
}

export interface WalletPaymentPayload {
  amount: number;
  instrumentType: string;
  instrumentDate: Moment;
  instrumentNo: string;
  reference1: string;
  reference2: string;
  reference3: string;
}

export interface CashBackPaymentPayload {
  amount: number;
  instrumentNo: string;
  bankName: string;
  reference1: string;
  reference2: string;
}
export interface BankLoanPaymentPayload {
  instrumentNo?: string;
  instrumentType?: string;
  instrumentDate: Moment;
  amount: number;
  reference1: string;
  reference2: string;
  reference3: string;
}
export interface AirpayPaymentPayload {
  amount: number;
  instrumentDate: Moment;
  reference1: string;
  reference2: string;
  reference3: string;
  otherDetails: {
    data: {
      isOnline: boolean;
    };
    type: string;
  };
}

export interface ROPaymentPayload {
  amount: number;
  instrumentDate: string;
  bankName: string;
  reference1: string;
  reference2: string;
  remarks: string;
}

export interface CreditNotePaymentPayload {
  amount: number;
  reference3: string;
  instrumentNo: string;
  instrumentType: string;
  instrumentDate: string;
  reference1?: string;
}

export interface EmployeeLoanPaymentPayload {
  amount: number;
  instrumentNo: string;
  instrumentType: string;
  instrumentDate: string;
  reference1: string;
  reference2: string;
}
export interface ManualPaymentPayload {
  amount: number;
  approvedBy?: string;
  customerId: string;
  paymentCode: string;
  requestedReason?: string;
  instrumentDate: string;
  reference1?: string;
  reference2?: string;
  reference3?: string;
}

export interface IntegratedPaymentRequestPayload {
  amount: number;
  customerId: string;
  paymentCode: string;
  requestedReason?: string;
  instrumentDate?: Moment;
}
export interface RtgsPaymentPayload {
  amount: number;
  reference1: string;
  reference2: string;
  reference3: string;
  instrumentDate: Moment;
}
export interface IntegratedPaymentPayload {
  amount: number;
  instrumentDate: Moment;
  otherDetails: {
    data: {
      paymentRequestId: string;
    };
    type: string;
  };
}
export interface RazorpayPaymentPayload {
  amount: number;
  instrumentDate: Moment;
  reference1: string;
  reference2: string;
  reference3: string;
  otherDetails: {
    data: {
      isOnline: boolean;
    };
    type: string;
  };
}

export interface DigiGoldPaymentPayload {
  amount: number;
  instrumentDate: string;
  reference1: string;
  otherDetails: PaymemtDigiGoldOtherDetails;
}

export interface DigiGoldCombinedPaymentPayload {
  tanshiq: DigiGoldTanshiqPayment;
  nonTanshiq: DigiGoldNonTanshiqPayment;
}

export interface CNListRequestPayload {
  customerId: number;
  isPageable: boolean;
  locationCode: string;
  isFrozenRateCnRequired?: boolean;
  status?: string;
}

export interface ThirdPartyCNRequestPayload {
  customerIds: string[];
  isPageable: boolean;
  locationCode?: string;
}

export interface InvokeCNRequestPayload {
  cnNumber: number;
  fiscalYear: number;
  locationCode: string;
}

export interface CNListResponsePayload {
  amount: number;
  creditNoteType: string;
  customerName: string;
  fiscalYear: string;
  id: string;
  mobileNumber: string;
  status: string;
  locationCode: string;
  linkedTxnType: string;
  linkedTxnId: string;
  docNo: number;
  priority: number;
  docDate?: Moment;
  isAdded?: boolean;
  totalDiscount?: any;
  eghsDetails?: any;
  cashCollected?: number;
  frozenRateDetails?: any;
  rivaahGhsDiscountDetails?: GhsAccountDiscount;
}

export interface CNListResponse {
  cnList: CNListResponsePayload[];
  totalElements: number;
}

export interface UpdateAirpayDetails {
  paymentId: string;
  details: CashPaymentPayload;
}
export interface ResendPaymentLinkPayload {
  transactionType: TransactionTypeEnum;
  subTransactionType: SubTransactionTypeEnum;
  paymentDetails: UpdateAirpayDetails;
  status: PaymentStatusEnum;
}
export interface PaymentBase {
  readonly mode: PaymentModeEnum;
  group: PaymentGroupEnum;
  payload: any;
}
export interface UPIPaymentPayload {
  amount: number;
  reference1: string;
  reference2: string;
  reference3: string;
  instrumentDate: Moment;
}
export class CashPayment implements PaymentBase {
  readonly mode = PaymentModeEnum.CASH;
  constructor(
    public group: PaymentGroupEnum,
    public payload: CashPaymentPayload
  ) {}
}

export class CardPayment implements PaymentBase {
  readonly mode = PaymentModeEnum.CARD;
  constructor(
    public group: PaymentGroupEnum,
    public payload: CardPaymentPayload
  ) {}
}

export class UniPayPayment implements PaymentBase {
  readonly mode = PaymentModeEnum.UNIPAY;
  constructor(
    public group: PaymentGroupEnum,
    public payload: UniPayPaymentPayload
  ) {}
}
export class EncirclePointsPayment implements PaymentBase {
  readonly mode = PaymentModeEnum.ENCIRCLE;
  constructor(
    public group: PaymentGroupEnum,
    public payload: EncirclePointsPaymentPayload
  ) {}
}

export class DDPayment implements PaymentBase {
  readonly mode = PaymentModeEnum.DD;
  constructor(
    public group: PaymentGroupEnum,
    public payload: DDPaymentPayload
  ) {}
}

export class ChequePayment implements PaymentBase {
  readonly mode = PaymentModeEnum.CHEQUE;
  constructor(
    public group: PaymentGroupEnum,
    public payload: ChequePaymentPayload
  ) {}
}

export class QCGC implements PaymentBase {
  readonly mode = PaymentModeEnum.QCGC;
  constructor(
    public group: PaymentGroupEnum,
    public payload: QCGCPaymentPayload
  ) {}
}

export class GiftVoucher implements PaymentBase {
  readonly mode = PaymentModeEnum.GIFT_VOUCHER;
  constructor(
    public group: PaymentGroupEnum,
    public payload: GVPaymentPayload
  ) {}
}
export class GHSeVoucher implements PaymentBase {
  readonly mode = PaymentModeEnum.GHS_EVOUCHER;
  constructor(
    public group: PaymentGroupEnum,
    public payload: GHSeVoucherPaymentPayload
  ) {}
}
export class GHSAccount implements PaymentBase {
  readonly mode = PaymentModeEnum.GHS_ACCOUNT;
  constructor(
    public group: PaymentGroupEnum,
    public payload: GHSAccountPaymentPayload
  ) {}
}
export class WalletPayment implements PaymentBase {
  readonly mode = PaymentModeEnum.WALLET;
  constructor(
    public group: PaymentGroupEnum,
    public payload: WalletPaymentPayload
  ) {}
}

export class CashBackPayment implements PaymentBase {
  readonly mode = PaymentModeEnum.CASH_BACK;
  constructor(
    public group: PaymentGroupEnum,
    public payload: CashBackPaymentPayload
  ) {}
}

export class RtgsPayment implements PaymentBase {
  readonly mode = PaymentModeEnum.RTGS;
  constructor(
    public group: PaymentGroupEnum,
    public payload: RtgsPaymentPayload
  ) {}
}

export class ROPayment implements PaymentBase {
  readonly mode = PaymentModeEnum.RO_PAYMENT;
  constructor(
    public group: PaymentGroupEnum,
    public payload: ROPaymentPayload
  ) {}
}

export class ROManualPayment implements PaymentBase {
  readonly mode = PaymentModeEnum.RO_PAYMENT;
  constructor(
    public group: PaymentGroupEnum,
    public payload: ManualPaymentPayload
  ) {}
}

export class AirpayManualPayment implements PaymentBase {
  readonly mode = PaymentModeEnum.AIRPAY;
  constructor(
    public group: PaymentGroupEnum,
    public payload: ManualPaymentPayload
  ) {}
}

export class RazorPayManualPayment implements PaymentBase {
  readonly mode = PaymentModeEnum.RAZOR_PAY;
  constructor(
    public group: PaymentGroupEnum,
    public payload: ManualPaymentPayload
  ) {}
}

export class AirpayIntegratedPayment implements PaymentBase {
  readonly mode = PaymentModeEnum.AIRPAY;
  constructor(
    public group: PaymentGroupEnum,
    public payload: IntegratedPaymentPayload
  ) {}
}

export class RazorPayIntegratedPayment implements PaymentBase {
  readonly mode = PaymentModeEnum.RAZOR_PAY;
  constructor(
    public group: PaymentGroupEnum,
    public payload: IntegratedPaymentPayload
  ) {}
}

export class AirpayPayment implements PaymentBase {
  readonly mode = PaymentModeEnum.AIRPAY;
  constructor(
    public group: PaymentGroupEnum,
    public payload: AirpayPaymentPayload
  ) {}
}
export class RazorPayPayment implements PaymentBase {
  readonly mode = PaymentModeEnum.RAZOR_PAY;
  constructor(
    public group: PaymentGroupEnum,
    public payload: RazorpayPaymentPayload
  ) {}
}

export class DigiGoldTanshiqPayment implements PaymentBase {
  readonly mode = PaymentModeEnum.DIGI_GOLD_TANISHQ;
  constructor(
    public group: PaymentGroupEnum,
    public payload: DigiGoldPaymentPayload
  ) {}
}

export class DigiGoldNonTanshiqPayment implements PaymentBase {
  readonly mode = PaymentModeEnum.DIGI_GOLD_NON_TANISHQ;
  constructor(
    public group: PaymentGroupEnum,
    public payload: DigiGoldPaymentPayload
  ) {}
}

export class BankLoanPayment implements PaymentBase {
  readonly mode = PaymentModeEnum.BANK_LOAN;
  constructor(
    public group: PaymentGroupEnum,
    public payload: BankLoanPaymentPayload
  ) {}
}

export class CreditNotePayment implements PaymentBase {
  readonly mode = PaymentModeEnum.CREDIT_NOTE;
  constructor(
    public group: PaymentGroupEnum,
    public payload: CreditNotePaymentPayload
  ) {}
}

export class EmployeeLoanPayment implements PaymentBase {
  readonly mode = PaymentModeEnum.EMPLOYEE_LOAN;
  constructor(
    public group: PaymentGroupEnum,
    public payload: EmployeeLoanPaymentPayload
  ) {}
}

export class UPIPayment implements PaymentBase {
  readonly mode = PaymentModeEnum.UPI;
  constructor(
    public group: PaymentGroupEnum,
    public payload: UPIPaymentPayload
  ) {}
}

export type PaymentType =
  | GiftVoucher
  | CashPayment
  | CardPayment
  | EncirclePointsPayment
  | DDPayment
  | ChequePayment
  | UniPayPayment
  | QCGC
  | WalletPayment
  | AirpayPayment
  | RazorPayPayment
  | ROPayment
  | ROManualPayment
  | AirpayManualPayment
  | RazorPayManualPayment
  | RtgsPayment
  | AirpayIntegratedPayment
  | RazorPayIntegratedPayment
  | BankLoanPayment
  | GHSeVoucher
  | CreditNotePayment
  | EmployeeLoanPayment
  | DigiGoldTanshiqPayment
  | DigiGoldNonTanshiqPayment
  | GHSAccount
  | CashBackPayment
  | UPIPayment;

export interface LoadPaymentDetailsPayload {
  transactionId: string;
  transactionType?: TransactionTypeEnum;
  subTransactionType?: SubTransactionTypeEnum;
}

export interface LoadMaxCashLimitPayload {
  transactionType: TransactionTypeEnum;
  subTransactionType: SubTransactionTypeEnum;
  customerId: string;
  transactionId: string;
  paymentCode: PaymentModeEnum;
  paymentGroup: PaymentGroupEnum;
}

export interface UniPayResponse {
  Request_Input: string;
  ResponseCode: number;
  ResponseMessage: string;
  ApprovalCode: string;
  RRN_No: string;
  Amount: string;
  Card_Num: string;
  Card_Type: string;
  CardHolder_Name: string;
  Acquirer_Bank: string;
  Txn_Date: string;
  Txn_Type: string;
  BankInvoice_Num: string;
  Batch_Number: string;
  Terminal_Id: string;
  Merchant_Id: string;
  utid: string;
  errorMsg?: string;
  errorCode?: string;
  paymentId?: string;
}

export interface digiData {
  mobileNo: string;
  sellingPrice: number;
  tanishqGoldrams?: number;
  nonTanishqGoldGrams?: number;
  totalGrams: number;
}
export interface UnipayTransactionDetails {
  id: string;
  amount: number;
}
export interface UpdateUnipayPaylaod {
  status: PaymentStatusEnum;
  transactionId: string;
  transactionType: TransactionTypeEnum;
  subTransactionType: SubTransactionTypeEnum;
  updateUnipayPlayload: UniPaymentDetails;
}

export class UniPayRequest {
  transactionType?: TransactionTypeEnum;
  subTransactionType?: SubTransactionTypeEnum;
  txnType: number;
  txnMode: number;
  txnId: string;
  txnAmount?: number;
  date: string;
  BankInvoiceNumber?: number;
  unipayDetails?: UnipayDetails;
}

export class PaymemtUpdateOtherDetails {
  type: PaymentModeEnum;
  data: UniPayResponse | any;
}

export class PaymemtDigiGoldOtherDetails {
  type: PaymentModeEnum;

  data: digiData;
}

export class OtherDetailsForUnipay {
  url: string;
  request: any;
  response: any;
  requestTime?: string;
  responseTime?: string;
  totalTime?: number;
  httpStatus: number;
  transactionStatus: boolean;
  cardNumber: string;
  referenceNumber: string;
}
export class UniPaymentDetails {
  instrumentDate?: Moment;
  instrumentNo?: number;
  instrumentType?: string;
  lineItemNo?: number;
  otherDetails?: PaymemtUpdateOtherDetails;
  payeeBankName?: string;
  payerBankBranch?: string;
  payerBankName?: string;
  reference1?: any;
  reference2?: string;
  reference3?: string;
  remarks?: string;
  status?: string;
}

export interface QCGCPaymentPayload {
  amount: number;
  instrumentNo: string;
  reference1: string;
  reference2: string;
  bankName: string;
  otherDetails: any;
  instrumentType: string;
  remarks?: string;
  instrumentDate: string;
}

export interface GVPaymentPayload {
  instrumentNo?: string;
  amount?: number;
  instrumentDate: string;
  instrumentType: string;
}

export interface GHSeVoucherPaymentPayload {
  amount: number;
  instrumentNo: string;
  reference1: string;
  instrumentType?: string;
  bankName: string;
  remarks: string;
  instrumentDate: string;
}

export interface GHSAccountPaymentPayload {
  amount: number;
  instrumentNo: string;
  instrumentType: string;
  instrumentDate?: string;
  reference1: string;
  reference2: string;
  isWithoutOtp: boolean;
}
export interface QCGCGetBalancePayload {
  cardType: GiftCardTxnEnum;
  cardNumber: string;
  otpRequired?: boolean;
}

export interface DigiGetBalancePayload {
  mobileNo: string;
  transactionId?: string;
  vendorCode?: string;
}

export interface CashLimitDetails {
  amountDue: number;
  eligibleAmount: number;
  pmlaEligibleAmount: number;
  totalAmount: number;
  amountCheck?: boolean;
}

export interface MaxCashAmountDetails {
  cashAmountMaxCap: number;
  pmlaCashAmountMaxCap: number;
}

export interface QCGCCardDetails {
  amount: string;
  cardNumber: string;
  cardType: string;
  cardName: string;
  cardExpiryDate: string;
  responseCode: number;
  responseMessage: string;
  transactionId: number;
  productGroup?: string[];
  paymentCategoryName?: string;
  partialRedemption?: boolean;
}

export interface CashBackBankDetail {
  description: string;
  cardNoLength: string;
  cashbackName: string;
  cmRemarks: string;
  endDate: Moment;
  excludeCashback: boolean;
  firstCardDigits: number;
  value: string;
  isActive: boolean;
  isCashbackAmount: boolean;
  lastCardDigits: number;
  maxUsageCount: number;
  mobileFlag: boolean;
  offerRemarks: string;
  startDate: Moment;
}

export interface CashBackConfigDetail {
  maxCashbackOfferAmt: number;
  minCashBackOfferAmt: number;
  maxSwipeAmt: number;
  minSwipeAmt: number;
  offerEndDate: Moment;
  offerStartDate: Moment;
  minInvoiceAmnt: number;
}

export interface DigiGoldDetails {
  mobileNo: string;
  nonTanishqGoldBalanceInGrams: number;
  referenceId: string;
  tanishqGoldBalanceInGrams: number;
}

export interface DigiPriceDetails {
  mobileNo: string;
  sellingPrice: number;
}

export interface GHSeVoucherDetails {
  firstName: string;
  phone: string;
  cardNumber: string;
  cardBalance: string;
  cardStatus: string;
  cardProgramGroupName: string;
  cardExpiryDate: string;
  responseCode: number;
  responseMessage: string;
  productGroup?: string[];
  paymentCategoryName?: string;
  partialRedemption?: boolean;
}
export interface GHSAccountDetails {
  id: string;
  customerId: number;
  accountCustomerId: number;
  passbookNo: string;
  enrolledLocationCode: string;
  scheme: string;
  discount: number;
  totalGhsAdvance: number;
  noOfInstallmentPaid: number;
  goldRate: number;
  accumulatedGoldWeight: number;
  enrolledDate: Moment;
  maturityDate: Moment;
  fiscalYear: number;
  isRedeemable: true;
  maturityLocationCode: string;
  minUtilizationPct: number;
  isProofsAvailable: true;
  schemeCode: string;
  // accountNo: number;
  // address: string[];
  balance: number;
  // currentTier: string;

  // emailId: string;
  // isMemberBlocked: true;
  // isPulseCustomer: true;

  mobileNo: string;

  // status: string;
  // ulpId: string;
  discountMcPct: number;
  discountUcpPct: number;
}
export interface GHSAttachmentsPayload {
  accountNumber: string;
  customerId: string;
}
export interface GHSAttachments {
  docName: string;
  docUrl: string;
}
export interface ValidatePaymentPayload {
  transactionType: TransactionTypeEnum;
  subTransactionType: SubTransactionTypeEnum;
  paymentId: string;
  inputValue?: string;
}

export interface ValidateCashBackPayload {
  bankName: string;
  cardNumber: string;
  invoiceAmount: number;
  swipeAmount: number;
  offerId: string;
}

export interface TransactionConfig {
  transactionType?: {
    type: TransactionTypeEnum;
    subType: SubTransactionTypeEnum;
  };
  isPaymentEditable?: boolean;
  showPayment?: boolean;
  isCnViewAllowed?: boolean;
  isCnViewAllowedBC?: boolean;

  transactionID?: string;
  transactionIDPresent?: boolean;
  transactionTotalAmount?: number;
  workflowData?: {
    processID: string;
    taskID: string;
    taskName: string;
    workflowType: WorkflowTypeEnum;
  };
  loadCreditNote?: boolean;
  taxTransactionType?: TransactionTypeEnum;
  refTxnType?: TransactionTypeEnum;
  txnId?: string;
  status?: string;
  showRemainingAmount?: boolean;
}
export interface GenerateOtpPayload {
  id: string;
  otpType: string;
}
export interface LoadEmployeeDetailsPayload {
  empId: string;
  customerId: string;
}

export interface GenerateOtpDigiGoldPayload {
  mobileNo: string;
  nonTanishqGoldGrams?: string;
  referenceId: string;
  tanishqGoldGrams?: string;
  otp?: string;
  transactionId?: string;
  goldGrams?: string;
  vendorCode?: string;
}

export interface GhsAccountDiscount {
  discountId: string;
  discountCode: string;
  discountType: string;
  discountValue: number;
  discountMcPct: number;
  discountUcpPct: number;
  schemeCode: string;
  schemeType: string;
  productGroupCodesRestricted: string[];
}

export interface CreditNoteDetail {
  id: string;
  docNo: number;
  fiscalYear: number;
  customerName: string;
  customerId: number;
  locationCode: string;
  creditNoteType: string;
  docDate: number;
  amount: number;
  status: string;
  linkedTxnType: any;
  mobileNumber: string;
  linkedTxnId: any;
  workflowStatus: any;
  frozenRateDetails: any;
  utilisedAmount: number;
  cashCollected: number;
  mergedCNId: any;
  refDocNo: number;
  refDocType: string;
  balanceAmtCnDocNo: any;
  maxGhsAmount: number;
  gepConfigDetailsId?: string;
  discountDetails: {
    type: string;
    data: {
      coinOfferDiscount: {
        discountId: string;
        discountCode: string;
        discountType: string;
        discountValue: string;
      }[];
      digiGoldDiscount: {
        discountValue: number;
      };
      karatageExchangeDiscount: {
        discountId: string;
        discountCode: string;
        discountType: string;
        oneKTDiscountValue: number;
        twoKTDiscountValue: number;
      }[];
      gepPurityDiscount?: any[];
      ghsAccountDiscount?: GhsAccountDiscount;
      systemDiscountDv?: {
        discountValue: number;
        isGoldCoinAllowed: boolean;
        discountId: string;
        discountCode: string;
        discountType: string;
      };
      grnMultipleDiscount?: {
        discountValue: number;
        discountId: string;
        discountCode: string;
        discountType: string;
      };
    };
  };
}

export interface UnipayErrorDetails {
  paymentId: string;
  status: string;
  unipayDetails: UnipayDetails;
}

export interface UnipaySuccessDetails {
  res: UniPayResponse;
  status: string;
  unipayDetails: UnipayDetails;
}

export interface UnipayDetails {
  hostName: string;
  unipayId: string;
  amount: number;
}

export interface UpdatePaymentDetailsForVoidUnipayPayload {
  txnType: TransactionTypeEnum;
  subTxnType: SubTransactionTypeEnum;
  txnId: string;
  paymentIds: string[];
  callCancelBillWithReturn: boolean;
}
