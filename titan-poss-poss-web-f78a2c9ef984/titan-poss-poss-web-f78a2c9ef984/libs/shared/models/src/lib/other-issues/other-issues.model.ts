import { Moment } from 'moment';
import { ProductGroup } from '@poss-web/shared/models';
export interface OtherIssueModel {
  id: number;
  srcLocationCode: string;
  destLocationCode: string;
  status: string;
  weightUnit: string;
  currencyCode: string;
  reqDocNo: number;
  reqDocDate: Moment;
  reqLocationCode: string;
  requestType: string;
  carrierDetails: CourierDetailsOtherIssue;
  destDocDate: Moment;
  destDocNo: number;
  orderType: string;
  otherDetails: OtherDetails;
  srcDocDate: Moment;
  srcDocNo: number;
  srcFiscalYear: number;
  totalAvailableQuantity: number;
  totalAvailableValue: number;
  totalAvailableWeight: number;
  totalMeasuredQuantity: number;
  totalMeasuredValue: number;
  totalMeasuredWeight: number;
  remarks?: string;
}
export class OtherIssuedataModel {
  issueData: OtherIssueModel[] = [];
  totalElements: number;
}
export interface OtherIssuesItem {
  id: number;
  itemCode: string;
  lotNumber: string;
  productCategory: string;
  productCategoryId: string;
  productGroup: string;
  productGroupId: string;
  binCode: string;
  binGroupCode: string;
  orderType: string;
  itemValue: number;
  itemWeight: number;
  totalQuantity: number;
  totalValue: number;
  totalWeight: number;
  currencyCode: string;
  weightUnit: string;
  mfgDate: Moment;
  status: string;
  imageURL: string;
  itemDetails: {};
  approvedQuantity: number;
  issuedQuantity: number;
  requestedQuantity: number;
  isUpdating: boolean;
  isUpdatingSuccess: boolean;
  totalElements?: number;
  inventoryId?: number;
  measuredWeight: number;
  measuredValue: number;
  measuredQuantity: number;
  availableQuantity: number;
  availableValue: number;
  availableWeight: number;
  stdWeight: number;
  stdValue: number;
  isStudded: boolean;
  taxDetails: any;
  isHallmarked?:boolean;
}
export interface OtherIssuesHistoryItem {
  id: number;
  itemCode: string;
  lotNumber: string;
  productCategory: string;
  productCategoryDesc: string;
  productGroup: string;
  productGroupDesc: string;
  binCode: string;
  binGroupCode: string;
  orderType: string;
  itemValue: number;
  itemWeight: number;
  totalQuantity: number;
  totalValue: number;
  totalWeight: number;
  currencyCode: string;
  weightUnit: string;
  mfgDate: Moment;
  status: string;
  imageURL: string;
  itemDetails: {};
  approvedQuantity: number;
  issuedQuantity: number;
  requestedQuantity: number;
  isUpdating: boolean;
  isUpdatingSuccess: boolean;
  totalElements?: number;
  inventoryId?: number;
  measuredWeight: number;
  measuredValue: number;
  measuredQuantity: number;
  availableQuantity: number;
  availableValue: number;
  availableWeight: number;
  stdWeight: number;
  stdValue: number;
  isStudded: boolean;
  isHallmarked?:boolean;
}
export interface OtherIssuesCreateStockResponse {
  id: number;
  reqDocNo: number;
  srcLocationCode: string;
  destLocationCode: string;
  totalQuantity: number;
  status: string;
  reqDocDate: Moment;
}
export interface AdjustmentItemUpdate {
  quantity: number;
  weight: number;
}
export interface AdjustmentItemToUpdate {
  id: number;
  newUpdate: AdjustmentItemUpdate;
  actualDetails: AdjustmentItemUpdate;
}
export interface PSVItemUpdate {
  quantity: number;
  weight: number;
}
export interface PSVItemToUpdate {
  id: number;
  newUpdate: PSVItemUpdate;
  actualDetails: PSVItemUpdate;
}
export interface RequestOtherIssueStockTransferNote {
  currencyUnit: string;
  destLocationCode: string;
  id: number;
  reqDocDate: Moment;
  reqDocNo: number;
  reqLocationCode: string;
  requestType: string;
  srcLocationCode: string;
  status: string;
  totalQuantity: number;
  totalValue: number;
  totalWeight: number;
  weightUnit: string;
  carrierDetails?: CourierDetailsOtherIssue;
  otherDetails?: OtherDetails;
  totalAvailableValue: number;
  totalAvailableWeight: number;
  totalAvailableQuantity: number;
}
export interface CourierDetailsOtherIssue {
  type: string;
  data?: {
    address1: string;
    address2: string;
    city: string;
    town: string;
    pinCode: string;
    employeeName: string;
    employeeId: string;
    Designation: string;
    contactNo: number;
    emailId: string;
  };
}
export interface OtherDetails {
  type: string;
  data?: {
    approvalCode: string;
    approvedBy: string;
  };
}
export const sortFilterData = [
  {
    id: 0,
    sortByColumnName: 'Available Weight',
    sortAscOrder: false
  },
  {
    id: 1,
    sortByColumnName: 'Available Quantity',
    sortAscOrder: false
  }
];
export interface OtherIssuesFilterOption {
  id: string;
  description: string;
}
export interface LoadOtherIssuesSTNCountPayload {
  pendingOtherIssuesSTNCount: number;
  countData: OtherIssueTransferType[];
}
export interface AdjustmentSearchItemPayloadSuccess {
  items: OtherIssuesItem[];
  count: number;
}

export interface OtherIssueSearchPendingPayload {
  srcDocnumber: number;
  type: string;
}

export interface OtherIssueLoadListItemsPayload {
  type: string;
  pageIndex: number;
  pageSize: number;
}

export interface LoadDropDownPayload {
  dropDownValue: OtherIssueTransferType[];
}
export interface OtherIssueLoadSelectedPayload {
  reqDocNo: number;
  type: string;
}
export interface CreateOtherIssueStockRequestItemsPayload {
  id: number;
  data: any;
  requestType: string;
}
export interface RemoveOtherIssueStockRequestItemsPayload {
  id: number;
  data: any;
  requestType: string;
}
export interface OtherIssueLoadIssueItemsTotalCountSuccessPayload {
  nonVerifiedOtherIssueItemsTotalCount: number;
  verifiedOtherIssueItemsTotalCount: number;
}
export interface LoadOtherIssuesItemPayload {
  id: number;
  pageIndex: number;
  pageSize: number;
  type: string;
  status: string;
  itemCode?: string;
  lotNumber?: string;
  sort?: Map<string, string>;
  filter?: { key: string; value: any[] }[];
}
export interface SearchOthreIssueItemsPayload {
  id: number;
  itemCode: string;
  status: string;
  type: string;
  lotNumber: string;
}
export interface OtherIssuesCreateStockResponsePayload {
  reqtype: string;
}
export interface LoadAllOtherIssuePayload {
  id: number;
  pageIndex: number;
  pageSize: number;
  reqtype: string;
  itemCode?: string;
  lotNumber?: string;
  sort?: Map<string, string>;
  filter?: { key: string; value: any[] }[];
}
export interface LoadOtherIssueCreateItemsTotalCountSuccessPayload {
  allOtherIssueCreateItemsTotalCount: number;
  selectedOtherIssueCreateItemsTotalCount: number;
}
export interface LoadOtherIssueCreateItemsTotalCountPayload {
  reqtype: string;
  id: number;
}
export interface UpdateStockRequestItemPayload {
  id: number;
  itemid: number;
  reqType: string;
  value: {
    inventoryId: number;
    measuredWeight: number;
    quantity: number;
    status: string;
  };
}
export interface CreateOtherStockIssueItemsPayload {
  id: number;
  data: any;
  transferType: string;
}
export interface UpdateStockRequestPayload {
  id: number;
  reqType: string;
  approvalDetails: {
    data: {};
    type: string;
  };
  carrierDetails: {
    type: string;
    data: {};
  };
  remarks: string;
  status: string;
}
export interface ConfirmOtherStockIssuePayload {
  id: number;
  transferType: string;
  carrierDetails: {
    type: string;
    data: any;
  };
  remarks: string;
  destinationLocationCode: string;
}
export interface AdjustmentSearchItemPayload {
  variantCode: string;
  lotNumber: string;
  rowNumber?: number;
  productGroups?: ProductGroup[];
  binType?:string;
}

export interface CreateStockRequestAdjustmentPayload {
  reqType: string;
  approvalDetails: {
    data: {};
    type: string;
  };
  items: any;
  remarks: string;
}
export interface UpdateCartItemAdjustmentPayload {
  id: number;
  quantity: number;
  weight: number;
}
export interface RemoveCartItemAdjustmentPayload {
  ids: string[];
}
export interface PSVSearchItemPayload {
  variantCode: string;
  lotNumber: string;
  rowNumber?: number;
  productGroups: ProductGroup[];
  binType?: string;
}
export interface PSVSearchItemPayloadSuccess {
  items: OtherIssuesItem[];
  count: number;
}
export interface SearchCartItemAdjustmentPayload {
  searchValue: string;
}
export interface SearchCartItemPSVPayload {
  searchValue: string;
}
export interface RemoveCartItemPSVPayload {
  ids: string[];
}
export interface CreateStockRequestPSVPayload {
  reqType: string;
  approvalDetails: {
    data: {};
    type: string;
  };
  items: any;
  remarks: string;
}
export interface UpdateCartItemPSVPayload {
  id: number;
  quantity: number;
  weight: number;
}
export interface CancelOtherRequestPayload {
  id: number;
  requestType: string;
}
export interface PrintOtherIssuePayload {
  id: number;
  requestType: string;
}

export interface OtherIssueTransferType {
  type: string;
  count: number;
}
export interface ConfirmOtherStockIssueResponse {
  id: number;
  srcLocationCode: string;
  destLocationCode: string;
  status: string;
  weightUnit: string;
  currencyCode: string;
  srcLocationDescription: null;
  destLocationDescription: null;
  srcDocNo: number;
  srcFiscalYear: number;
  srcDocDate: Moment;
  destDocNo: number;
  destDocDate: number;
  orderType: number;
  totalAvailableQuantity: number;
  totalMeasuredQuantity: number;
  totalAvailableValue: number;
  totalMeasuredValue: number;
  totalAvailableWeight: number;
  totalMeasuredWeight: number;
  transferType: string;
  courierReceivedDate: Moment;
  courierDetails: {};
}

export interface HistoryItemSuccessPayload {
  items: OtherIssuesHistoryItem[];
  count: number;
}
export interface OtherIssueHistoryPayload {
  actionType: string;
  dateRangeType: string;
  endDate: any;
  issueDocNo: number;
  issueFiscalYear: number;
  receiveDocNo: number;
  receiveFiscalYear: 0;
  startDate: any;
  statuses: string[];
  transactionType: string;
}
export interface OtherIssueRequestHistoryPayload {
  actionType: string;
  dateRangeType: string;
  endDate: any;
  locationCode: string;
  reqDocNo: number;
  reqFiscalYear: number;
  requestType: string;
  startDate: any;
  statuses: string[];
}
export interface LoadOtherIssueHistoryPayload {
  type: any;
  page: number;
  size: number;
  sort?: string;
  payload: OtherIssueHistoryPayload | OtherIssueRequestHistoryPayload;
  issueType: string;
}
export interface OtherIssueHistoryItemsPayload {
  binCodes: string[];
  binGroupCode: string;
  itemCode: string;
  lotNumber: string;
  productCategories: string[];
  productGroups: string[];
}

export interface LoadOtherIssueHistoryItemsPayload {
  type: any;
  actionType: string;
  id: number;
  page: number;
  size: number;
  sort: string[];
  payload: OtherIssueHistoryItemsPayload;
  transactionType: string;
}
export interface OtherReceiptsIssuesAdvanceFilterPayload {
  docFromDate: number;
  docToDate: number;
  status: any;
  docNo: string;
  fiscalYear: string;
}
