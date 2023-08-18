import { SEARCH_BY_ENUM } from '../customer/customer.enum';

export interface LoadPaymentRequestPayload {
  page: number;
  paymentCode: string;
  payload: PaymentRequestSearchDto;
  size: number;
  sort?: string[];
}
export interface PaymentRequestSearchDto {
  customerId: number;
  dateRangeType: string;
  endDate: any;
  fiscalYear: number;
  isWorkFlowApproval?: boolean;
  referenceId: string;
  startDate: any;
  status: string[];
}
export interface PaymentRequestDetails {
  amount: number;
  approvedBy: string;
  approvedDate: number;
  approvedReason: string;
  customerId: number;
  id: string;
  locationCode: string;
  otherDetails: {
    data: any;
    type: string;
  };
  paymentCode: string;
  referenceId: string;
  requestedBy: string;
  requestedDate: number;
  requestedReason: string;
  status: string;
  utilizedAmount: number;
  customerName: string;
  customerMobileNo: string;
  customerTitle: string;
  ulpId: string;
  isVerifying: boolean;
  // currencyCode?: string;
  // docDate?: any;
  // fiscalYear?: any;
}

export interface SearchCustomerPayload {
  searchFieldValue: string;
  searchType: SEARCH_BY_ENUM;
}

export interface CustomerPayload {
  currentTier: string;
  custTaxNo: string;
  customerDetails: {
    data: {};
    type: string;
  };
  customerId: number;
  customerName: string;
  customerType: string;
  instiTaxNo: string;
  isMemberBlocked: boolean;
  isPulseCustomer: boolean;
  mobileNumber: string;
  passportId: string;
  title: string;
  ulpId: string;
}
export interface GenerateCnPayload {
  id: string;
  untilizedAmount?: number;
}
