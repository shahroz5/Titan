import { Moment } from 'moment';

export interface CfaDetails {
  cfaLocationCode: string;
  remarks: string;
}

export interface CFAMaster {
  CFACode: string;
  CFAName: string;
}
export interface InvoiceItems {
  inventoryId: number;
  // measuredQuantity: number;
  // measuredWeight: number;
}
export interface StockReturnItemUpdate {
  measuredQuantity: number;
  status: string;
  inventoryId: string;
  measuredWeight: number;
}
export interface ConfirmCFAItems {
  cfaLocationCode?: string;
  destinationLocationCode?: string;
  remarks: string;
  carrierDetails: {
    type: string;
    data: {};
  };
}
export interface CFAItemUpdate {
  quantity: number;
  weight: number;
}
export interface CFAItemToUpdate {
  itemId: number;
  newUpdate: CFAItemUpdate;
  actualDetails: CFAItemUpdate;
}
export interface StockReturnItem {
  id: number;
  itemCode: string;
  lotNumber: string;
  mfgDate: Moment;
  productCategory: string;
  productGroup: string;
  binCode: string;
  binGroupCode: string;
  stdValue: number;
  stdWeight: number;
  currencyCode: string;
  weightUnit: string;
  status: string;
  imageURL: string;
  thumbnailImageURL: string;
  itemDetails: any;
  availableQuantity: number;
  availableWeight: number;
  availableValue: number;
  measuredQuantity: number;
  measuredWeight: number;
  measuredValue: number;
  orderType: string;
  inventoryId: string;
  productCategoryDesc: string;
  productGroupDesc: string;
  remarks?: string;
  isStudded?: boolean;
  taxDetails: any;
  isLoadingImage: boolean;
  isLoadingThumbnailImage: boolean;
  finalValue?: number;
  preTaxValue?: number;
  pricePerUnit?: number;
  totalTax?: number;
  itemLevelDiscount?: number;
  ishallmarking?: boolean;
  value?: number;
}
export interface CFAddress {
  locationCode: string;
  brandCode: string;
  townCode: number;
  stateCode: number;
  regionCode: string;
  locationTypeCode: string;
  isActive: boolean;
  address: string;
  phoneNo: string;
  description: string;
}
//[TODO: Take Filter related model from filter dialog model]
export interface FilterData {
  productGroups: StockReturnFilterOption[];
  productCategory: StockReturnFilterOption[];
}
// export interface FilterOption {
//   id: number;
//   description: string;
// }

/**
 * The interface for Action payload
 */
export interface UpdateCartItemPayload {
  inventoryId: number;
  quantity: number;
  weight: number;
}
export interface UpdateSeletedItemPayload {
  requestId: number;
  itemId: number;
  newUpdate: CFAItemUpdate;
  actualUpdate: CFAItemUpdate;
}
export interface ConfirmStockReturnPayload {
  id: number;
  confirmIssue: ConfirmCFAItems;
}

export interface CreateRequestPayload {
  invoiceId: number;
}
export interface CreateIssueItemsPayload {
  id: number;
  invoiceItems?: InvoiceItems[];
  stockItems?: InvoiceItems[];
}
export interface SearchItemPayload {
  id: number;
  variantCode: string;
  lotNumber: string;
}
export interface LoadStockReturnItemsPayload {
  id: number;
  pageSize?: number;
  pageIndex?: number;
  sortBy?: string;
  sortOrder?: string;
  itemId?: string;
  lotNumber?: string;
  filter?: { key: string; value: any[] }[];
}
export interface LoadStockReturnItemsPayloadCfa {
  id: number;
  itemCode?: string;
  lotNumber?: string;
  transferType: string;
  storeType: string;
  status: string;
  pageIndex?: number;
  pageSize?: number;
  sort?: Map<string, string>;
  filter?: { key: string; value: any[] }[];
}
export interface SearchItemPayloadSuccess {
  items: StockReturnItem[];
  count: number;
}
export interface LoadItemsSuccessPayload {
  items: StockReturnItem[];
  count: number;
}

export interface LoadItemsSuccessCfaPayload {
  id: number;
  itemCode: string;
  lotNumber: string;
  mfgDate: Moment;
  productCategory: string;
  productGroup: string;
  binCode: string;
  binGroupCode: string;
  stdValue: number;
  stdWeight: number;
  currencyCode: string;
  weightUnit: string;
  status: string;
  imageURL: string;
  thumbnailImageURL: string;
  itemDetails: {};
  availableQuantity: number;
  availableWeight: number;
  availableValue: number;
  measuredQuantity: number;
  measuredWeight: number;
  measuredValue: number;
  orderType: string;
  inventoryId: string;
  productCategoryDesc: string;
  productGroupDesc: string;
  isStudded: boolean;
  // for l3
  remarks?: string;
  totalElements: number;
  isLoadingImage: boolean;
  isLoadingThumbnailImage: boolean;
}
export interface RemoveSelectedItemsPayload {
  requestId: number;
  itemIds: number[];
}
export interface SelectedProductSearchPayload {
  requestId: number;
  itemId: number;
}

export interface StockReturnFilterOption {
  id: string;
  description: string;
}
export interface LoadStockIssueInvoiceHistory {
  actionType: string;
  dateRangeType: string;
  destDocNo: number;
  destFiscalYear: string;
  endDate: any;
  locationCode: string;
  srcDocNo: number;
  srcFiscalYear: string;
  startDate: any;
  statuses: [];
}
export interface LoadStockIssueInvoiceHistoryPayload {
  loadStockIssueInvoiceHistory: LoadStockIssueInvoiceHistory;
  pageIndex: number;
  pageSize: number;
  invoiceType: string;
}
export interface RequestInvoice {
  id: number;
  srcLocationCode: string;
  destLocationCode: string;
  status: string;
  weightUnit: string;
  currencyCode: string;
  srcLocationDescription: string;
  destLocationDescription: string;
  srcDocNo: string;
  srcFiscalYear: string;
  srcDocDate: Moment;
  destDocNo: string;
  destDocDate: Moment;
  orderType: string;
  totalAvailableQuantity: number;
  totalMeasuredQuantity: number;
  totalAvailableValue: number;
  totalMeasuredValue: number;
  totalAvailableWeight: number;
  totalMeasuredWeight: number;
  invoiceType: string;
  remarks: string;
  courierDetails?: StockReturnCourierDetails;
  totalDiscount?: number;
}
export interface StockReturnCourierDetails {
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
export interface StockIssueInvoiceHistorySuccess {
  requestInvoice: RequestInvoice[];
  totalElements: number;
}
export interface HistoryAdvancedFilterPayload {
  docFromDate: number;
  docToDate: number;
  fiscalYear: string;
  invoiceNumber: string;
}
