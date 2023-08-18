import { Moment } from 'moment';

export interface CreateStockIssueResponse {
  id: number;
  srcLocationCode: string;
  destLocationCode: string;
  status: string;
  weightUnit: string;
  currencyCode: string;
  srcDocNo: number;
  srcFiscalYear: number;
  srcDocDate: Moment;
  destDocNo: number;
  destDocDate: Moment;
  orderType: string;
  totalAvailableQuantity: number;
  totalMeasuredQuantity: number;
  totalAvailableValue: number;
  totalMeasuredValue: number;
  totalAvailableWeight: number;
  totalMeasuredWeight: number;
  // for l1/l2
  transferType?: string;
  // for l3
  invoiceType?: string;
  // for l1/l2
  courierReceivedDate?: Moment;
  courierDetails?: {};
  // for l3
  issuedRemarks?: string;
}

export interface StockIssueItem {
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
  isStudded: boolean;
  refDocDate: Moment;
  refDocNumber: number;
  refDocType: string;
  // for l3
  remarks?: string;
  totalElements: number;
  taxDetails: any;
  ishallmarking?: any;
  isLoadingImage: boolean;
  finalValue?: number;
  karat?: number;
  isLoadingThumbnailImage: boolean;
  preTaxValue?: number;
  pricePerUnit?: number;
  totalTax?: number;
  itemLevelDiscount?: number;
}

export interface ItemSelection {
  isSelected: boolean;
  item: StockIssueItem;
}

export interface TransferType {
  binCode: string;
  transferType: string;
}

export interface Form {
  value: string;
  viewValue: string;
}

export interface ItemSelectionAll {
  selectCheckbox: boolean;
  enableCheckbox: boolean;
}

export interface CreateStockIssuePayload {
  transferType: string;
  storeType: string;
  id?: number;
}

export interface UpdateStockIssuePayload {
  id: number;
  transferType: string;
  storeType: string;
  remarks: string;
  carrierDetails?: {
    type: string;
    data: {};
  };
  destinationLocationCode?: string;
  cfaLocationCode?: string;
}

export interface CreateStockIssueItemsPayload {
  id: number;
  transferType: string;
  storeType: string;
  itemIds: any[];
}

export interface LoadStockIssueItemsPayload {
  id: number;
  itemCode?: string;
  lotNumber?: string;
  transferType: string;
  storeType: string;
  status: string;
  cfaLocationCode?: string;
  pageIndex?: number;
  pageSize?: number;
  sort?: Map<string, string>;
  filter?: Map<string, string>;
}

export interface LoadStockIssueItemsPayloadCfa {
  id: number;
  itemCode?: string;
  lotNumber?: string;
  transferType: string;
  storeType: string;
  sortType: string;
  status: string;
  pageIndex?: number;
  pageSize?: number;
  sortBy?: any;
  filter?: Map<string, string>;
}

export interface LoadStockIssueItemsCountPayload {
  id: number;
  transferType: string;
  storeType: string;
  status: string;
  cfaLocationCode?: string;
}
