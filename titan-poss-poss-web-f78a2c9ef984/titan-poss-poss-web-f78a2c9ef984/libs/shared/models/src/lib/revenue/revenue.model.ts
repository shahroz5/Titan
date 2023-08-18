import { Moment } from 'moment';

export interface RevenueRequest {
  fromDate: any;
  toDate: any;
}

export interface RevenueResponse {
  revenues: RevenueResult[];
  totalRevenues: number;
}

export interface PaginatePayload {
  pageIndex: number;
  pageSize: number;
}

export interface RevenuePaginatedList {
  vendorList: RevenueResult[];
  count: number;
}

export interface RevenuePaymentModeWiseResponse {
  cashPayment: number;
  cardPayment: number;
  chequePayment: number;
  ddPayment: number;
  airpayPayment: number;
  rtgsPayment: number;
  walletPayment: number;
  employeeLoanPayment: number;
  salaryAdvancePayment: number;
  roPayment: number;
  razorPayPayment:number;
  upiPayment: number;
}

export interface RevenueResult {
  date: Moment;
  revenues: RevenuePaymentModeWiseResponse[];
}

export interface RevenueTotal {
  totalLable: string;
  revenues: RevenuePaymentModeWiseResponse[];
}

export interface RevenueData {
  paymentCode: string;
  payments: number;
  returns: number;
  revenues: number;
}

export interface TodayRevenueResult {
  revenueType: string;
  revenues: RevenuePaymentModeWiseResponse[];
}

export interface TodayRevenueResponse {
  results: TodayRevenueResult[];
}

export interface GHSRevenuePayload {
  businessDate?: any, 
  locationCode?: string
}

export interface ServiceRevenuePayload {
  businessDate?: any, 
  locationCode?: string
}