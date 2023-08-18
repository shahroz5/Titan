import { Moment } from 'moment';
import { SelectDropDownOption } from '../select-dropdown.model';

export interface CreditNoteSearch {
  cnNumber: string;
  mobileNumber: string;
  fiscalYear: string;
  startDate?: string;
  endDate?: string;
  isUnipayCN?: boolean;
  pageIndex?: number;
  pageSize?: number;
}
export interface CreditNoteSearchResult {
  amount: number;
  creditNoteType: string;
  customerName: string;
  docDate: Moment;
  docNo: number;
  fiscalYear: number;
  id: string;
  linkedTxnId: string;
  linkedTxnType: string;
  locationCode: string;
  mobileNumber: string;
  status: string;
  customerId: string;
  frozenRateDetails: any;
  isCancleAllowed?: boolean;
  accountNumber: string;
  isUnipay: boolean;
}
export interface CreditNoteDetails {
  id: string;
  docNo: number;
  fiscalYear: number;
  customerName: string;
  customerId: number;
  locationCode: string;
  destLocationCode?: string;
  creditNoteType: string;
  docDate: Moment;
  cancelDate: Moment;
  amount: number;
  status: string;
  linkedTxnType: string;
  mobileNumber: string;
  linkedTxnId: string;
  refDocNo: number;
  refDocNos?: string;
  refDocType: string;
  workflowStatus: string;
  frozenRateDetails: {};
  maxGhsAmount?: string;
  isAutoApproved?: boolean;
  isRefundDetailsApplicable?: boolean;
  cnRefundDetails?: CNRefundDetails;
  cancelRemarks?: string;
  approverRemarks?: string;
  approverBy?: string;
  accountNumber?: string;
  isPaymentForEGHS?: boolean;
  paymentDetails?: {};
  isUnipay: boolean;
  originalDocDate: Moment;
}
export interface SentRequestPayload {
  creditNoteType: string;
  id: string;
  payload?: any;
}
export interface SentRequestResponse {
  docNo: number;
  fiscalYear: number;
  cnType: string;
  amount: string;
  custName: string;
  reqDate: Moment;
  status: string;
  id: string;
  processId: string;
  requestorRemarks: string;
  frozenRateDetails: any;
  approvalStatus: string;
  createdDate: Moment;
  custId: string;
  cnNumber: string;
  remarks?: string;
  approverRemarks?: string;
  //processId:string
}
export interface LoadRequestsPayload {
  workFlowType: string;
  pageIndex: number;
  pageSize: number;
  payload?: any;
}
export interface ConfirmRequestTypePayload {
  payload: {};
  workFlowType: string;
  id: string;
}
export interface ConfirmRequest {
  amount: number;
  creditNoteType: string;
  customerId: number;
  customerName: string;
  docDate: Moment;
  docNo: number;
  fiscalYear: number;
  frozenRateDetails: any;
  id: string;
  linkedTxnId: string;
  linkedTxnType: string;
  locationCode: string;
  mobileNumber: string;
  refDocNo: number;
  refDocType: string;
  status: string;
  workflowStatus: string;
}
export interface TransferEghsPayload {
  id: string;
  payload: {
    accountNumber: number;
    fiscalYear: number;
    locationCode: string;
    remarks: string;
    transferAmount: number;
  };
}
export interface TransferedCNS {
  creditNoteType: string;
  amount: number;
  ghsDiscount: number;
  docNo: number;
  fiscalYear: number;
  customerName: string;
  customerId: number;
  mobileNumber: string;
  ulpId: string;
  status: string;
  ghsDocNo: string;
}
export interface TransferToEghs {
  balanceAmtCnDocNo: number;
  amount: number;
  cashCollected: number;
  docNo: number;
  id: string;
}
export interface CancelCnRequestPayload {
  paymentDetails: {
    data: CnRefundPaymentData;
    type: string;
  };
  id: string;
  creditNoteWorkFlowType: string;
  remarks: string;
}
export interface CnRefundPaymentData {
  paymentCode: string;
  paymentGroup: string;
  refundAmount: number;
  instrumentType?: string;
  otherDetails: {};
}

export interface CnRefundAmountDetails {
  amount: number;
  deductionPercentage: string;
  fullAdvCNPaymentMode: string;
  netRefundAmount: number;
  refundPaymentMode?: string;
  acquiredBank?: string;
  allowedRefundPaymentModes: SelectDropDownOption[];
  refundDeductionAmount: number;
  totalTax: number;
  utilisedAmount: number;
}
export interface CNRefundDetails {
  netRefundAmount: number;
  refundPaymentType?: string;
  refundPaymentMode: string;
  bankDetails: BankDetails;
}

export interface BankDetails {
  accountHoldersName?: string;
  accountNumber?: number;
  bankName?: string;
  branch?: string;
  ifscCode?: string;
  approvalCode?: string;
  tidNumber?: number;
  tanishqTransactionId?: number;
  airpayTransactionId?: number;
  razorpayTransactionId?: number;
  micrCode?: string;
  chequeNumber?: string;
}
