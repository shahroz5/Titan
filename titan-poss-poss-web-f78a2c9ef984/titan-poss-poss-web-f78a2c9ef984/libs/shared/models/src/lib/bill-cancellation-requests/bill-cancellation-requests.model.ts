import { Moment } from 'moment';

export interface BillCancellationRequests {
  results: BillCancellation[];
  count: number;
}
export interface BillCancellation {
  approvedBy: string;
  invoiceNo: number;
  approvedDate: Moment;
  approverRemarks: string;
  docDate: Moment;
  docNo: number;
  fiscalYear: number;
  headerData: any;
  customerName: string;
  totalAmount: number;
  locationCode: string;
  processId: string;
  requestedBy: string;
  requestedDate: any;
  requestorRemarks: string;
  taskId: string;
  taskName: string;
  workflowType: string;
}

export interface BillCancelStatus {
  approvalLevel: number;
  approvalStatus: string;
  approvedBy: string;
  approvedDate: Moment;
  approverRemarks: string;
  docNo: number;
  fiscalYear: number;
  headerData: any;
  processId: string;
  requestedBy: string;
  requestedDate: Moment;
  requestorRemarks: string;
  workflowType: string;
}
export interface BillCancelStatusList {
  response: any;
  pageNumber: number;
  pageSize: number;
  results: BillCancelStatus[];
  totalElements: number;
  totalPages: number;
}
