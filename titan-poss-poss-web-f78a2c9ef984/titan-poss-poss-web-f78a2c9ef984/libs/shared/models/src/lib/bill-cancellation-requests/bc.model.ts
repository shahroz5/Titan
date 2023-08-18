import { Moment } from 'moment';

export interface CmBillList {
  currencyCode: string;
  customerName: string;
  refDocDate: Moment;
  refDocNo: number;
  refTxnId: string;
  refTxnTime: Moment;
  subTxnType: string;
  totalValue: number;
  txnType: string;
  totalElements: number;
}

export interface BillCancelPayload {
  cancelType?: string;
  employeeCode: string;
  reasonForCancellation: string;
  refTxnId: string;
  remarks: string;
}

export interface CmBillListPayload {
  txnType: string;
  subTxnType: string;
  sort: string;
  customerName?: string;
  refDocNo?: number;
  pageIndex?: number;
  pageSize?: number;
}

export interface CancelResponse {
  cndocNos: any;
  docNo: number;
  id: string;
  tcsCnDocNos?: any;
  tcsCnAmount?: number;
  cnId?: any;
}

export interface ConfirmResponse {
  docNo: number;
  id: string;
  requestNo: string;
}

export interface bcHistoryDetails {
  customerName: string;
  createdDate: Moment;
  createdBy: string;
  docNo: number;
  docDate: Moment;
  fiscalYear: number;
  netAmount: number;
  cancelReason: string;
  cancellationType: string;
  page?: number;
  size?: number;
  cmId?: number;
  subTxnType?: string;
}

export interface bcHistoryRequestPayload {
  docNo?: number;
  fiscalYear?: number;
  fromDocDate?: any;
  fromNetAmount?: number;
  refDocNo?: number;
  toDocDate?: string;
  toNetAmount?: number;
}

export interface bcHistoryResponse {
  bcHistoryDetails: bcHistoryDetails[];
  totalElements: number;
}
