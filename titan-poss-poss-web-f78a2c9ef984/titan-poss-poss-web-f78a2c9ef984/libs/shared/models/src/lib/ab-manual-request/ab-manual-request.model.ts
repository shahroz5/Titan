import { Moment } from 'moment';
import {
  CashMemoTaxDetails,
  InventoryWeightDetails,
  PriceDetails
} from '../cash-memo/cash-memo.model';
import { AppliedFiltersPayload } from '../manual-cm-request/cm-request.model';

export interface AbManualRequestListPayload {
  approvalStatus: string;
  appliedFilters: AppliedFiltersPayload;
  pageIndex: number;
  pageSize: number;
  workflowType: string;
}

export interface AbManualRequestDetailsPayload {
  processId: string;
  taskId?: string;
  taskName?: string;
  workFlowType: string;
}

export interface AbManualApprovalRequestPayload {
  isApprove: boolean;
  requestBody: any;
  processId: string;
  taskId: string;
  taskName: string;
}

export interface AbManualRequestList {
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
  approvalStatus?: number;
}

export interface AbManualRequestDetails {
  approvalLevel: number;
  approvalStatus: string;
  approvedData: {};
  docNo: number;
  headerData: {};
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

export interface AbManualItemDetails {
  itemCode: string;
  lotNumber: string;
  binCode: string;
  inventoryId: string;
  finalValue: number;
  remarks: string;
  totalDiscount: number;
  totalQuantity: number;
  totalTax: number;
  totalValue: number;
  totalWeight: number;
  unitValue: number;
  unitWeight: number;
  employeeCode: string;
  discountDetails: {};
  focDetails: {};
  taxDetails: CashMemoTaxDetails;
  priceDetails: PriceDetails;
  inventoryWeightDetails: InventoryWeightDetails;
  isFoc: boolean;
  measuredWeightDetails: InventoryWeightDetails;
  productCategoryCode: string;
  productGroupCode: string;
  refTxnId: string;
  refTxnType: string;
  rowId: number;
  itemId?: string;
  productCategoryDescription: string;
  productGroupDescription: string;
  imageUrl: string;
}
