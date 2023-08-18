export interface CnApprovalListRequest {
  approvalStatus: string;
  filterOptions?: {
    dateRangeType?: string;
    docNo?: number;
    endDate?: any;
    filterParams?: any;
    fiscalYear?: number;
    startDate?: any;
    locationCode?: string;
  };
  pageIndex?: number;
  pageSize?: number;
  sort?: string[];
  length?: number;
  workflowType: string;
}

export enum cnApprovalsEnum {
  ALL = 'ALL',
  CREDIT_NOTE_CANCELLATION = 'CREDIT_NOTE_CANCELLATION',
  CREDIT_NOTE_GOLD_RATE_REMOVE = 'CREDIT_NOTE_GOLD_RATE_REMOVE',
  CREDIT_NOTE_ACTIVATE = 'CREDIT_NOTE_ACTIVATE',
  PENDING = 'PENDING'
}
export interface CnApprovalListResponse {
  locationCode: string;
  cnNumber: string;
  fiscalYear: string;
  cnType: string;
  cnDate: any;
  customerName: string;
  customerMobileNumber: string;
  amount: string;
  requestedBy: string;
  requestedType: string;
  suspendedDate: string;
  requestorRemarks: number;
  remarks: string;
  processId: string;
  taskId: string;
  taskName: string;
  totalElements: number;
}
export interface CnRequestApprovalRowData {
  locationCode: string;
  cnNumber: string;
  fiscalYear: string;
  cnType: string;
  cnDate: string;
  customerName: string;
  customerMobileNumber: string;
  amount: string;
  requestedBy: string;
  requestedType: string;
  suspendedDate: string;
  requestorRemarks: number;
  remarks: string;
  processId: string;
  taskId: string;
  taskName: string;
}
export interface SaveCnApproval {
  bulkApproverRequestObjectDto?: {
    approvedData?: {
      data: {};
      type: string;
    };
    approverRemarks: string;
    approved: boolean;
    processId: string;
    taskId: string;
    taskName: string;
  }[];
}

export interface CountResponse {
  count: number;
  taskStatus: string;
  workflowType: string;
}
