import { CustomErrors } from '@poss-web/shared/models';
import { Moment } from 'moment';
/***
 *The information about the count of the StockTransferNote
 */
export interface StockReceiveCount {
  count: number;
  type: string;
}

export interface StockReceiveCourierDetails {
  type: string;
  data: {
    companyName: string;
    docketNumber: string;
    lockNumber: string;
    roadPermitNumber: string;
    employeeId: string;
    employeeMobileNumber: string;
    employeeName: string;
  };
}

export interface StockReceiveStock {
  id: number;
  currencyCode: string;
  courierDetails: StockReceiveCourierDetails;
  courierReceivedDate: Moment;
  orderType: string;
  srcDocNo: number;
  srcDocDate: Moment;
  srcFiscalYear: number;
  srcLocationCode: string;
  status: string;
  destDocDate: Moment;
  destDocNo: number;
  destLocationCode: string;
  totalAvailableWeight: number;
  totalAvailableQuantity: number;
  totalAvailableValue: number;
  totalMeasuredQuantity: number;
  totalMeasuredValue: number;
  totalMeasuredWeight: number;
  type: string;
  weightUnit: string;
  srcLocationDescription: string;
  destLocationDescription: string;
  reasonForDelay?: string;
  remarks?: string;
  totalDiscount?: string;
  invoiceType?: string;
  totalValue?: number;
}

/**
 *The information about the StockTransferNote products
 */

export interface StockReceiveItem {
  id: string;
  currencyCode: string;
  imageURL: string;
  thumbnailImageURL: string;
  itemCode: string;
  itemDetails: any;
  stdValue: number;
  stdWeight: number;
  lotNumber: string;
  mfgDate: Moment;
  orderType: string;
  productCategory: string;
  productCategoryDesc: string;
  productGroup: string;
  productGroupDesc: string;
  status: string;
  availableQuantity: number;
  availableValue: number;
  availableWeight: number;
  weightUnit: string;
  measuredQuantity: number;
  measuredWeight: number;
  binCode: string;
  binGroupCode: string;
  remarks: string;
  isUpdating: boolean;
  isUpdatingSuccess: boolean;
  isValidating: boolean;
  isValidatingSuccess: boolean;
  isValidatingError: boolean;
  isStudded: boolean;
  taxDetails?: any;
  isLoadingImage: boolean;
  isLoadingThumbnailImage: boolean;
  itemLevelDiscount: number;
  value?: number;
  finalValue?: number;
  pricePerUnit?: number;
  preTaxValue?: number;
  totalTax?: number;
}
export interface StockReceiveItemUpdate {
  binCode: string;
  binGroupCode: string;
  measuredWeight: number;
  remarks: string;
  itemDetails: any;
}

export interface StockReceiveItemToUpdate {
  id: string;
  newUpdate: StockReceiveItemUpdate;
  actualDetails: StockReceiveItemUpdate;
}

export interface StockReceiveItemValidate {
  itemId: string;
  productGroupCode: string;
  availableWeight: number;
  measuredWeight: number;
  measuredQuantity: number;
  availableQuantity: number;
  itemLevelDiscount: number;
}

/**
 * The details of confirmed StockTransferNote
 */
export interface StockReceiveConfirmReceive {
  courierReceivedDate?: string;
  // * for l1/l2
  reasonForDelay?: string;
  // * for l3
  receivedDate?: string;
  remarks: string;
}

/**
 * The interface for Action payload
 */
export interface StockReceiveLoadPendingPayload {
  pageIndex: number;
  pageSize: number;
}

export interface StockReceiveSearchPendingPayload {
  srcDocnumber: string;
  type: string;
}

export interface StockReceiveLoadItemsPayload {
  storeType: string;
  type: string;
  id: number;
  status: string;
  itemCode: string;
  lotNumber: string;
  pageIndex: number;
  pageSize: number;
  sortBy: string;
  sortOrder: string;
  filter: { key: string; value: any[] }[];
  isSearchReset?: boolean;
  isHistory?: boolean;
  historyType?: string;
}

export interface StockReceiveLoadItemsTotalCountPayload {
  storeType: string;
  type: string;
  id: number;
}
export interface StockReceiveLoadItemsTotalCountSuccessResponse {
  nonVerifiedItemsTotalCount: number;
  verifiedItemsTotalCount: number;
}
export interface StockReceiveTotalMeasuredWeightPayload {
  storeType: string;
  type: string;
  id: number;
}
export interface StockReceiveTotalMeasuredWeight {
  totalMeasuredWeight: number;
}
export interface StockReceiveUpdateItemPayload {
  type: string;
  storeType: string;
  id: number;
  itemId: string;
  newUpdate: StockReceiveItemUpdate;
  actualDetails: StockReceiveItemUpdate;
  loadItemsPayload?: StockReceiveLoadItemsPayload;
  loadTemsCountPayload?: StockReceiveLoadItemsTotalCountPayload;
}

export interface StockReceiveUpdateItemFailurePayload {
  itemId: string;
  actualDetails: StockReceiveItemUpdate;
  error: CustomErrors;
}

export interface StockReceiveUpdateAllItemsPayload {
  type: string;
  storeType: string;
  id: number;
  data: {
    binCode?: string;
    id?: string[];
    status?: string;
  };
}

export interface StockReceiveConfirmStockReceivePayload {
  type: string;
  storeType: string;
  id: number;
  confirmReceive: StockReceiveConfirmReceive;
}
export interface StockReceiveHistory {
  dateRangeType: string;
  destDocNo: number;
  destFiscalYear: number;
  endDate: number;
  locationCode: string;
  srcDocNo: number;
  srcFiscalYear: number;
  startDate: number;
  statuses: [];
  actionType: string;
  invoiceType?: string;
}

export interface StockReceiveHistoryPayload {
  data: StockReceiveHistory;
  pageIndex: number;
  pageSize: number;
  transferType: string;
}

export interface StockReceiveHistoryItem {
  binCodes: any;
  binGroupCode: string;
  itemCode: string;
  lotNumber: string;
  productCategories: any;
  productGroups: any;
  statuses: any;
}
export interface StockReceiveHistoryItemsPayload {
  StockReceiveHistoryItem: StockReceiveHistoryItem;
  pageIndex: number;
  pageSize: number;
  id: string;
  isL1L2Store: boolean;
  isL3Store: boolean;
  sort: string[];
  sortOrder: string;
  historyAPIType: string;
}
export interface AdvanceFilterPayload {
  docFromDate: number;
  docToDate: number;
  stnNumber: number;
  sourceLocationCode: string;
  fiscalYear: string;
  docNumber: string;
}
