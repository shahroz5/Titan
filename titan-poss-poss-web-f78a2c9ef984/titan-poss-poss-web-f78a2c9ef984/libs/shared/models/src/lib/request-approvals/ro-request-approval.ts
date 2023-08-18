export interface RoRequestApprovalListRequest {
  approvalStatus: string;
  filterOptions?: {
    dateRangeType?: string;
    docNo?: number;
    endDate?: any;
    filterParams?: any;
    fiscalYear: number;
    startDate?: any;
  };
  pageIndex?: number;
  pageSize?: number;
  length?: number;
  workflowType: string;
}

export interface BoutiqueRoRequestApprovalListRequest {
  pageIndex?: number;
  pageSize?: number;
  paymentCode?: string;
  status?: string;
  sort?: string;
}

export interface BoutiqueRoRequestApprovalListResponse {
  requestList: BoutiqueRoRequestApprovalList[];
  totalElements: number;
}
export interface BoutiqueRoRequestApprovalList {
  amount?: number;
  approvedBy?: string;
  approvedDate?: any;
  id?: string;
  reqNo?: string;
  requestedBy?: string;
  fiscalYear?: string;
  requestedDate?: any;
  requestTime?: any;
  cashierName?: string;
  customerName?: string;
  customerMobileNumber?: number;
  requestorReason?: string;
  status?: string;
  remarks: string;
}
export enum roRequestEnum {
  approved = 'APPROVED',
  rejected = 'REJECTED',
  pending = 'PENDING',
  list = 'list',
  history = 'history',
  custom = 'CUSTOM',
  workflowType = 'APPROVE_RO_PAYMENT',
  historyType = 'Approved',
  all = 'ALL',
  closed = 'CLOSED'
}
export interface RoRequestApprovalListResponse {
  approvedBy: string;
  approvedDate: any;
  remarks: string;
  docDate: any;
  reqNo: number;
  fiscalYear: any;
  amount: number;
  customerName: string;
  customerTitle: string;
  customerMobileNumber: number;
  cashierId: string;
  customerId: string;
  locationCode: string;
  processId: string;
  cashierName: string;
  requestedDate: any;
  requestorReason: string;
  taskId: string;
  taskName: string;
  workflowType: string;
  requestTime: string;
  totalElements: number;
  approvalStatus: string;
}

export interface SaveRoRequestApproval {
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
export interface RoRequestApprovalCountRequest {
  approvalStatus: string;
  workflowType: string;
}
