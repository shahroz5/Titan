import { Moment } from 'moment';
import { CustomErrors } from '../error.model';
import { StockIssueAPIRequestTypesEnum } from './stock-issue.enum';
//new
export interface StockRequestNote {
  carrierDetails: {};
  currencyCode: string;
  destDocDate: Moment;
  destDocNo: number;
  destLocationCode: string;
  destLocationDescription: string;
  destLocationName?: string;
  destLocationAddress?: string;
  id: number;
  orderType: string;
  otherDetails: {};
  reqDocDate?: Moment;
  reqDocNo?: number;
  reqLocationCode?: string;
  requestType?: string;
  srcDocDate: Moment;
  srcDocNo: number;
  srcFiscalYear: number;
  srcLocationCode: string;
  srcLocationDescription: string;
  srcLocationName?: string;
  srcLocationAddress?: string;
  status: string;
  totalAvailableQuantity: number;
  totalAvailableValue: number;
  totalAvailableWeight: number;
  totalMeasuredQuantity: number;
  totalMeasuredValue: number;
  totalMeasuredWeight: number;
  weightUnit: string;
  courierReceivedDate?: any;
  reasonForDelay?: string;
  remarks?: string;
  transferType?: string;
  cancelledDate?: Moment;
  cancelledRemarks?: string;
}

/**
 *Model for request Invoice
 */

// export interface RequestInvoice {
//   id: number;
//   srcLocationCode: string;
//   destLocationCode: string;
//   status: string;
//   weightUnit: string;
//   currencyCode: string;
//   srcLocationDescription: string;
//   destLocationDescription: string;
//   srcDocNo: string;
//   srcFiscalYear: string;
//   srcDocDate: Moment;
//   destDocNo: string;
//   destDocDate: Moment;
//   orderType: string;
//   totalAvailableQuantity: number;
//   totalMeasuredQuantity: number;
//   totalAvailableValue: number;
//   totalMeasuredValue: number;
//   totalAvailableWeight: number;
//   totalMeasuredWeight: number;
//   invoiceType: string;
//   remarks: string;
// }
// export interface StockIssueInvoiceHistorySuccess {
//   requestInvoice: RequestInvoice[];
//   totalElements: number;
// }
/**
 * Model for request STN count
 */
export interface RequestStockTransferNoteCount {
  stncount: number;
  stntype: string;
}
//TODO DELETE
export interface SelectedItemsIds {
  id: number;
}
/*
Model for Issue Item Details */
export interface IssueItem {
  approvedQuantity: number;
  // availableQuantity: number;
  binCode: string;
  binGroupCode: string;
  currencyCode: string;
  id: number;
  imageURL: string;
  thumbnailImageURL: string;
  inventoryId?: number;
  issuedQuantity: number;
  itemCode: string;
  itemDetails: {};
  stdValue: 0;
  stdWeight: number;
  lotNumber: string;
  measuredWeight: number;
  mfgDate: Moment;
  orderType: string;
  productCategory: string;
  productGroup: string;
  requestedQuantity: number;
  selectedQuantity: number;
  status: string;
  availableQuantity: number;
  availableValue: number;
  availableWeight: number;
  weightUnit: string;
  isUpdating: boolean;
  isUpdatingSuccess: boolean;
  totalElements?: number;
  isLoadingImage: boolean;
  isLoadingThumbnailImage: boolean;
}
export interface IssueInventoryItem {
  availableQuantity: number;
  availableValue: number;
  availableWeight: number;
  binCode: string;
  binGroupCode: string;
  currencyCode: string;
  finalValue: string;
  id: string;
  imageURL: string;
  thumbnailImageURL: string;
  inventoryId: string;
  itemCode: string;
  itemDetails: any;
  lotNumber: string;
  measuredQuantity: number;
  measuredValue: number;
  measuredWeight: number;
  mfgDate: Moment;
  orderType: string;
  productCategory: string;
  productCategoryDesc: string;
  productGroup: string;
  productGroupDesc: string;
  status: string;
  stdValue: number;
  stdWeight: number;
  weightUnit: string;
  isUpdating: boolean;
  isUpdatingSuccess: boolean;
  isValidating: boolean;
  isValidatingSuccess: boolean;
  isValidatingError: boolean;
  isStudded: boolean;
  refDocType?: string;
  refDocNumber?: number;
  refDocDate?: Moment;
  taxDetails: any;
  totalTax: string;
  discount: string;
  isLoadingImage: boolean;
  isLoadingThumbnailImage: boolean;
  karatage: number;
  preTaxValue?: number;
  pricePerUnit?: number;
}
export interface CourierDetails {
  courierCompany: string;
  courierDocketNumber: string;
  courierLockNumber: string;
  courierRoadPermitNumber: string;
}

export interface IssueConfirmResponse {
  courierDetails: any;
  courierReceivedDate: Moment;
  currencyCode: string;
  destDocDate: Moment;
  destDocNo: number;
  destLocationCode: string;
  id: number;
  orderType: string;
  srcDocDate: Moment;
  srcDocNo: number;
  srcFiscalYear: number;
  srcLocationCode: string;
  status: string;
  totalAvailableQuantity: number;
  totalAvailableValue: number;
  totalAvailableWeight: number;
  totalMeasuredQuantity: number;
  totalMeasuredValue: number;
  totalMeasuredWeight: number;
  transferType: number;
  weightUnit: string;
}
export interface IssueItemToUpdate {
  id: string;
  newUpdate: IssueItemUpdate;
  actualDetails: IssueItemUpdate;
  //TODO : to be checked with jobit
  courierDetails?: null;
}
export interface IssueItemUpdate {
  measuredQuantity: number;
  status: string;
  inventoryId: string;
  measuredWeight: number;
}

export interface ItemToleranceValidate {
  itemId: string;
  productGroupCode: string;
  availableWeight: number;
  measuredWeight: number;
  measuredQuantity: number;
  availableQuantity: number;
}

// export interface LoadIssueInvoicePayload {
//   pendingIssueBTQ_CFA_InvoiceCount: number;
// }

export interface LoadIssueSTNCountsPayload {
  pendingIssueBTQ_BTQ_STNCount: number;
  pendingIssueBTQ_FAC_STNCount: number;
  pendingIssueBTQ_MER_STNCount: number;
}

export interface LoadPendingIssuePayload {
  requestType: string;
  pageIndex: number;
  pageSize: number;
}
// export interface LoadPendingCFAIssuePayload {
//   type: string;
//   pageIndex: number;
//   pageSize: number;
// }
export interface LoadSelectedPayload {
  id: number;
  requestType: string;
}

export interface SearchPendingPayload {
  reqDocNo: number;
  requestType: string;
}
export interface SearchPendingInvoicePayload {
  reqDocNo: number;
  status: string;
  type: string;
}
//////////////////////////////////////
export interface LoadIssueItemPayload {
  id: number;
  itemCode?: string;
  lotNumber?: string;
  requestType: string;
  storeType: string;
  status: string;
  pageIndex?: number;
  pageSize?: number;
  sort?: Map<string, string>;
  filter?: { key: string; value: any[] }[];
}
export interface SearchIssueItemsPayload {
  id: number;
  itemCode?: string;
  lotNumber?: string;
  requestType: string;
  storeType: string;
  status: string;
  pageIndex?: number;
  pageSize?: number;
  sort?: Map<string, string>;
  filter?: Map<string, string>;
}
export interface LoadIssueItemsTotalCountPayload {
  id: number;
  requestType: string;
  storeType: string;
}
export interface LoadSearchIssueItemsTotalCountPayload {
  type: string;
  id: number;
  itemCode?: string;
  lotNumber?: string;
  requestType: string;
  storeType: string;
  status: string;
  sort?: Map<string, string>;
  filter?: Map<string, string>;
}
export interface LoadIssueItemsTotalCountSuccessPayload {
  approvedItemsTotalCount: number;
  selectedItemsTotalCount: number;
  // searchedItemsCount: number;
  historyItemsTotalCount: number;
}
export interface LoadIssueSearchedItemsCountPayload {
  searchedItemsCount: number;
}

export interface FormStatusPayload {
  status: boolean;
}

export interface ConfirmIssuePayload {
  requestType: string;
  id: number;
  data: {
    carrierDetails: {
      data: any;
      type: any;
    };
    remarks: string;
  };
}

export interface UpdateItemPayload {
  requestType: string;
  storeType: string;
  id: number;
  itemId: any;
  newUpdate: IssueItemUpdate;
  actualDetails: IssueItemUpdate;
}
export interface UpdateAllItemPayload {
  requestType: string;
  storeType: string;
  id: number;
  itemId: any;
  status: string;
}
export interface UpdateItemFailurePayload {
  itemId: number;
  actualDetails: IssueItemUpdate;
  error: CustomErrors;
}
export interface CheckStatusPayload {
  id: number;
  status: boolean;
}
// REQUEST COUNT
export interface LoadIssueSTNCountsPayload {
  pendingIssueBTQ_BTQ_STNCount: number;
  pendingIssueBTQ_FAC_STNCount: number;
  pendingIssueBTQ_MER_STNCount: number;
}
export interface LoadIssueInvoicePayload {
  pendingIssueBTQ_CFA_InvoiceCount: number;
}
export interface CourierDetailsPayload {
  courierNames: string[];
}

export interface MeasuredWeightAndValuePayload {
  currencyCode: string;
  totalMeasuredQuantity: number;
  totalMeasuredValue: number;
  totalMeasuredWeight: number;
  weightUnit: string;
}
export interface LoadIssueHistoryPayload {
  actionType: string;
  dateRangeType: string;
  destDocNo: number;
  destFiscalYear: number;
  endDate: any;
  locationCode: string;
  srcDocNo: number;
  srcFiscalYear: number;
  startDate: any;
  statuses: string[];
}
export interface LoadHistoryRequestPayload {
  payload: LoadIssueHistoryPayload;
  pageSize: number;
  pageIndex: number;
  sort: string[];
  transferType: string;
  isLegacy?: boolean;
}
export interface StockIssueSelectedHistoryPayload {
  actionType: string;
  id: number;
  type: string;
  isL1L2Store: boolean;
  isL3Store: boolean;
}

export interface StockissueHistoryItemsRequestPayload {
  binCodes: string[];
  binGroupCode: string;
  itemCode: string;
  lotNumber: string;
  productCategories: string[];
  productGroups: string[];
  statuses: string[];
}
export interface LoadStockIssueHistoryItemsPayload {
  payload: StockissueHistoryItemsRequestPayload;
  actionType: string;
  id: number;
  page: number;
  size: number;
  sort: string[];
  transferType: string;
  isL1L2Store: boolean;
  isL3Store: boolean;
}
export interface IssueAdvanceFilterPayload {
  docFromDate: number;
  docToDate: number;
  locationCode: string;
  fiscalYear: string;
  docNo: string;
}

export interface LoadSelectedHeaderInfoPayload {
  id: number;
  page: number;
  size: number;
  sort: string[];
}

export const STOCK_ISSUE_SORT_DATA = [
  {
    id: 0,
    sortByColumnName: 'Requested Weight',
    sortAscOrder: false
  },
  {
    id: 1,
    sortByColumnName: 'Approved Quantity',
    sortAscOrder: false
  }
];

export interface LoadCancelIssuesPayload {
  transferType: StockIssueAPIRequestTypesEnum;
  id?: number;
  payload?: {};
}

export interface LoadCancelIssuesSTNPayload {
  requestType: string;
  pageIndex?: number;
  pageSize?: number;
  srcDocNo?: number;
}

export interface LoadCancelIssuetemsPayload {
  id: number;
  page: number;
  size: number;
  sort: string[];
  transferType: string;
  binCodes: string[];
  binGroupCode: string;
  itemCode: string;
  lotNumber: string;
  productCategories: string[];
  productGroups: string[];
}

export interface RegenerateFilePayload {
  invoiceType: string;
  id: number;
  payload?: {};
}

export interface RegenerateFileResponse {
  id: number;
  srcLocationCode: string;
  destLocationCode: string;
  status: string;
  weightUnit: string;
  currencyCode: string;
  srcLocationDescription: string;
  destLocationDescription: string;
  srcDocNo: number;
  srcFiscalYear: number;
  srcDocDate: Moment;
  destDocNo: number;
  destDocDate: Moment;
  orderType: string;
  reqDocNo: number;
  reqDocDate: Moment;
  cancelledRemarks: string;
  cancelledDate: Moment;
  remarks: string;
  totalAvailableQuantity: number;
  totalMeasuredQuantity: number;
  totalAvailableValue: number;
  totalMeasuredValue: number;
  totalAvailableWeight: number;
  totalMeasuredWeight: number;
  invoiceType: string;
  issuedRemarks: string;
}
