import { Moment } from 'moment';

export interface BankDepositRequest {
  fromDate: any;
  toDate: any;
}

export interface BankDepositResponse {
  results: BankDepositResult[];
  totalElements: number;
}

export interface BankDepositPaginatedList {
  vendorList: BankDepositResult[];
  count: number;
}

export interface BankDepositPaymentModeWiseResponse {
  cashPayment: number;
  cardPayment: number;
  ddPayment: number;
  transactionId?: any;
}

export interface BankDepositResult {
  date: Moment;
  deposits: BankDepositPaymentModeWiseResponse[];
}

export interface BankDepositTotal {
  totalLable: string;
  deposits: BankDepositPaymentModeWiseResponse[];
}

export interface BankDepositData {
  paymentCode: string;
  deposit: number;
}

export interface DepositDatePayload {
  depositDate: any;
  paymentCode: string;
}

export interface DepositDateResponse {
  transacionIdDetails: TransactionIds[];
  paymentCode?: string;
}

export interface TransactionIds {
  transactionIds?: string[];
}