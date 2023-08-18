import { FormGroup } from '@angular/forms';

export interface GrnRequestApprovalListRequest {
  approvalStatus: string;
  filterOptions?: {
    dateRangeType?: string;
    docNo?: number;
    endDate?: any;
    filterParams?: any;
    fiscalYear?: number;
    startDate?: any;
  };
  pageIndex?: number;
  pageSize?: number;
  length?: number;
  workflowType: string;
}

export enum grnRequestEnum {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PENDING = 'PENDING',
  LIST = 'list',
  HISTORY = 'history',
  CUSTOM = 'CUSTOM',
  WORK_FLOW_TYPE = 'GOODS_RETURN',
  MFG_DEFECT = 'MFG_DEFECT',
  REGULAR = 'REGULAR_GRN',
  ALL = 'ALL',
  SRC_LOCATION_CODE = 'SOURCE LOCATION CODE',
  DESC_LOCATION_CODE = 'DESTINATION LOCATION CODE',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED'
}
export interface GrnRequestApprovalListResponse {
  srcBoutiqueCode: string;
  destBoutiqueCode: string;
  variantCode?: string;
  lotNumber?: string;
  fiscalYear: string;
  cmDocNumber: string;
  isCmGoldRate: boolean;
  grnComments: string;
  grnReasons: string;
  approvedBy: string;
  approvalCode: string;
  approvalMailDated: any;
  requestedDate?: any;
  returnedQty: number;
  itemWeight: string;
  pricePerUnit: number;
  grnTotalPrice: number;
  grnNumber: string;
  processId: string;
  taskId: string;
  taskName: string;
  remarks: string;
  cancelType: string;
  totalElements: number;
  id?: string;
  refId?: string;
}
export interface GrnRequestApprovalRowData {
  srcBoutiqueCode: string;
  destBoutiqueCode: string;
  variantCode: string;
  lotNumber: string;
  fiscalYear: string;
  cmDocNumber: string;
  formGroup?: FormGroup;
  withCmGoldRate?: boolean;
  currentGoldRate?: boolean;
  rowKey: number;
  grnComments: string;
  grnReasons: string;
  approvedBy: string;
  approvalCode: string;
  approvalMailDated: string;
  requestedDate?: string;
  returnedQty: number;
  itemWeight?: string;
  pricePerUnit?: number;
  grnTotalPrice: number;
  processId: string;
  taskId: string;
  taskName: string;
  remarks: string;
  cancelType: string;
  id?: string;
  refId?: string;
}
export interface SaveGrnRequestApproval {
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
