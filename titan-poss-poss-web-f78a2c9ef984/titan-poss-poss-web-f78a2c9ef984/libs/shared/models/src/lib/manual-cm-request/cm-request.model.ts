import { Moment } from 'moment';
import { CashMemoItemDetails } from '../cash-memo/cash-memo.model';
import { PaymentDetails } from '../cash-memo/payment.model';

export interface CmRequestListPayload {
  approvalStatus: string;
  appliedFilters: AppliedFiltersPayload;
  pageIndex: number;
  pageSize: number;
  workflowType: string;
  userType: boolean;
}
export interface grfRequestListPayload {
  approvalStatus: string;
  appliedFilters: AppliedFiltersPayload;
  pageIndex: number;
  pageSize: number;
  workflowType: string;
}

export interface CmRequestDetailsPayload {
  processId: string;
  taskId?: string;
  taskName?: string;
  workFlowType: string;
  userType?: boolean;
}

export interface GRFRequestDetailsPayload {
  processId: string;
  taskId?: string;
  taskName?: string;
  workFlowType: string;
}

export interface CmApprovalRequestPayload {
  isApprove: boolean;
  requestBody: any;
  processId: string;
  taskId: string;
  taskName: string;
}

export interface AppliedFiltersPayload {
  dateRangeType?: string;
  docNo?: number;
  endDate?: number;
  filterParams?: any;
  fiscalYear?: number;
  startDate?: number;
}

export interface CmRequestList {
  approvedBy: string;
  approvedDate: Moment;
  approverRemarks: string;
  docDate: Moment;
  docNo: number;
  fiscalYear: number;
  headerData: {};
  locationCode?: string;
  processId: string;
  requestedBy: string;
  requestedDate: Moment;
  requestorRemarks: string;
  taskId?: string;
  taskName?: string;
  workflowType: string;
  totalElements?: number;
  approvalLevel?: number;
  approvalStatus?: string;
}

export interface GRFRequestList {
  approvedBy: string;
  approvedDate: Moment;
  approverRemarks: string;
  docDate: Moment;
  docNo: number;
  fiscalYear: number;
  headerData: {};
  locationCode?: string;
  processId: string;
  requestedBy: string;
  requestedDate: Moment;
  requestorRemarks: string;
  taskId?: string;
  taskName?: string;
  workflowType: string;
  totalElements?: number;
  approvalLevel?: number;
  approvalStatus?: string;
}

export interface CmRequestDetails {
  approvalLevel: number;
  approvalStatus: string;
  approvedData: {
    data: {
      discountList: [];
      itemList: CashMemoItemDetails[];
      paymentList: PaymentDetails[];
    };
  };
  docNo: number;
  headerData: any;
  locationCode: string;
  processId: string;
  requestorRemarks: string;
  requestorUserName: string;
  taskId?: string;
  taskName?: string;
  workflowType?: string;
  approvedDate?: Moment;
  approvedby?: string;
  approverRemarks?: string;
  fiscalYear?: number;
}

export interface ApprovalRequest {
  approverRemarks: string;
  approverRoleCode: string;
  approverUserName: string;
  level: number;
  processId: string;
  requestorUserName: string;
  taskId: string;
  taskStatus: string;
  totalApproverLevels: number;
}
