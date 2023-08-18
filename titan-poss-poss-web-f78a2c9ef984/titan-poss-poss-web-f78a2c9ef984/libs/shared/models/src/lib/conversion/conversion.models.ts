import { Moment } from 'moment';
import { ProductPriceDetails } from '../cash-memo/cash-memo.model';
// ConvertableItem

export interface ConversionItem {
  autoApproved: boolean;
  binCode: string;
  childItems: ConversionItem[];
  complexityCode: string;
  currencyCode: string;
  imageURL: string;
  thumbnailImageURL: string;
  inventoryId: string;
  itemCode: string;
  itemDescription: string;
  lotNumber: string;
  productCategory: string;
  productCategoryDesc: string;
  productGroup: string;
  productGroupDesc: string;
  productType: string;
  stdValue: number;
  stdWeight: number;
  stoneValue: number;
  weightUnit: string;
  isStudded: boolean;
  isLoadingImage: boolean;
  isLoadingThumbnailImage: boolean;
  studded?: boolean;
  priceDetails?: ProductPriceDetails;
}
export interface ConversionInventoryItem {
  availableQuantity: number;
  availableValue: number;
  availableWeight: number;
  binCode: string;
  binGroupCode: string;
  currencyCode: string;
  id: string;
  imageURL: string;
  thumbnailImageURL: string;
  itemCode: string;
  itemDetails: any;
  lotNumber: string;
  mfgDate: Moment;
  productCategory: string;
  productCategoryDesc: string;
  productGroup: string;
  productGroupDesc: string;
  status: string;
  stdValue: number;
  stdWeight: number;
  weightUnit: string;
  isStudded: boolean;
  studded?: boolean;
  isLoadingImage: boolean;
  isLoadingThumbnailImage: boolean;
}
export interface ConversionRequests {
  id: number;
  srcDocNo: number;
  status: string;
  createdDate: Moment;
  totalQuantity: number;
  totalWeight: number;
  totalValue: number;
  otherDetails?: ConversionRequestItems[];
  approvalRemarks?: string;
}
export interface ConversionRequestsResponse {
  conversionRequestsList: ConversionRequests[];
  count: number;
}
export interface ConversionRequestItems {
  binCode: string;
  imageURL: string;
  thumbnailImageURL: string;
  inventoryId: string;
  itemCode: string;
  itemDetails: {
    complexityCode: string;
    itemCode: string;
    itemType: string;
    netWeight: string;
    remarks: string;
    sold: string;
    stonePrice: string;
    isHallmarking?: any;
  };
  lotNumber: string;
  mfgDate: Moment;
  productCategory: string;
  productCategoryDesc: string;
  productGroup: string;
  productGroupDesc: string;
  stdValue: number;
  stdWeight: number;
  weightUnit: string;
  isStudded: boolean;
  studded?: boolean;
  isLoadingImage: boolean;
  isLoadingThumbnailImage: boolean;
  priceDetails?: ProductPriceDetails;
}

export interface ConversionRequestResponse {
  currencyCode: string;
  destDocDate: Moment;
  destDocNo: number;
  destLocationCode: string;
  id: number;
  orderType: string;
  reqDocDate: Moment;
  reqDocNo: number;
  requestType: string;
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
  weightUnit: string;
}

export interface ConversionResponse {
  // courierDetails: {};
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
  totalQuantity: number;
  totalValue: number;
  totalWeight: number;
  weightUnit: string;
}

export interface LoadConversionRequestsPayload {
  pageIndex: number;
  pageSize: number;
}
export interface ConversionLoadItemsPayload {
  itemCode: string;
  lotNumber: string;
  itemWeight: any;
  binCode: string;
}
export interface ConversionItemPayload {
  binCode: string;
  inventoryId: string;
  itemCode: string;
  lotNumber: string;
  measuredWeight: number;
  makingCharges?: number;
  makingChargesPct?: number;
  final_value?: number;
}
export interface ConversionSplitItemPayload {
  issueItems: ConversionItemPayload[];
  receiveItems: ConversionItemPayload[];
  rsoName: string;
  requestId?: number;
}

//
export interface ConversionSplitReqPayload {
  otherDetails: ConversionApprovalDetailsPayload;
  items: ConversionSplitReqItemPayload[];
  remarks: string;
}
export interface ConversionApprovalDetailsPayload {
  data: any;
  type: string;
}
export interface ConversionSplitReqItemPayload {
  binCode: string;
  inventoryId: string;
  itemCode: string;
  itemDetails: ConversionSplitItemDetailsPayload;
  lotNumber: string;
  measuredWeight: number;
  quantity: number;
}
export interface ConversionSplitItemDetailsPayload {
  data: ConversionSplitItemDetailsDataPayload;
  type: string;
}
export interface ConversionSplitItemDetailsDataPayload {
  remarks: string;
  itemCode: string;
  netWeight: number;
  stonePrice: number;
  complexityCode: number;
  sold: string;
  itemType: string;
}
export interface ConversionRsoDetailsPayload {
  empName: string[];
  employeeCode: string[];
}
export interface ConversionBincodesPayload {
  binCodes: string[];
}
export interface ConfirmConversionPayload {
  id: number;
  rsoName: string;
}
export interface RequestSentHistory {
  actionType: string;
  dateRangeType: string;
  endDate: string;
  locationCode: string;
  reqDocNo: number;
  reqFiscalYear: string;
  startDate: string;
  statuses: any;
}
export interface HistoryItemsPayload {
  binCodes: any;
  binGroupCode: string;
  itemCode: string;
  lotNumber: string;
  productCategories: any;
  productGroups: any;
}
export interface ConversionHistoryItemsPayload {
  historyItemsPaylod: HistoryItemsPayload;
  pageIndex: number;
  pageSize: number;
  id: number;
  requestType: string;
  preTransactionId?: number;
  childItems?: [];
}
export interface RequestSentHistoryPayload {
  requestSentPayload: RequestSentHistory;
  pageIndex: number;
  pageSize: number;
  requestType: string;
}
export interface ConversionHistory {
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
  destDocNo: string;
  destDocDate: Moment;
  totalAvailableQuantity: number;
  totalMeasuredQuantity: number;
  totalAvailableValue: number;
  totalMeasuredValue: number;
  totalAvailableWeight: number;
  totalMeasuredWeight: number;
  reqDocDate: Moment;
  reqDocNo: number;
  reqLocationCode: string;
  requestType: string;
  remarks: string;
  prevTransaction?: number;
  rsoName: string;
  otherDetails?: any;
}
export interface ConversionHistorySuccessPayload {
  requestSentHistory: ConversionHistory[];
  count: number;
}
export interface ConversionHistoryItems {
  id: string;
  itemCode: string;
  lotNumber: string;
  mfgDate: Moment;
  productCategory: string;
  productGroup: string;
  productCategoryDesc: string;
  productGroupDesc: string;
  binCode: string;
  binGroupCode: string;
  stdValue: number;
  stdWeight: number;
  currencyCode: string;
  weightUnit: string;
  status: string;
  imageURL: string;
  thumbnailImageURL: string;
  itemDetails: {
    remarks: string;
    itemCode: string;
    netWeight: string;
    stonePrice: string;
    complexityCode: string;
    sold: string;
    itemType: string;
    isHallmarking?: any;
  };
  availableQuantity: number;
  availableWeight?: number;
  availableValue?: number;
  measuredQuantity?: number;
  measuredWeight?: number;
  measuredValue?: number;
  orderType?: string;
  inventoryId: string;
  destBinCode?: string;
  receivedWeight?: number;
  isStudded?: boolean;
  studded?: boolean;
  requestedQuantity?: number;
  requestedWeight?: number;
  isLoadingImage: boolean;
  isLoadingThumbnailImage: boolean;
}
export interface ConversionHistoryItemsSuccessPayload {
  items: ConversionHistoryItems[];
  count: number;
}
export interface ConversionHistoryAdvancedFilterPayload {
  requestFromDate: number;
  requestToDate: number;
  fiscalYear: number;
  statuses: any;
  docNo: number;
}
export interface ConvertedTransactionHistory {
  actionType: string;
  dateRangeType: string;
  endDate: number;
  issueDocNo: number;
  issueFiscalYear: number;
  receiveDocNo: number;
  receiveFiscalYear: number;
  startDate: number;
  statuses: any;
}
export interface ConvertedTransactionHistoryPayload {
  convertedTransaction: ConvertedTransactionHistory;
  pageIndex: number;
  pageSize: number;
  transactionType: string;
}
export interface ConvertedTransactionHistoryItem {
  id: number;
  transactionType: string;
  locationCode: string;
  srcDocNo: number;
  srcFiscalYear: number;
  srcDocDate: Moment;
  destDocNo: number;
  destDocDate: Moment;
  totalAvailableQuantity: number;
  totalMeasuredQuantity: number;
  locationCodeDescription: string;
  totalAvailableValue: number;
  totalMeasuredValue: number;
  totalAvailableWeight: number;
  totalMeasuredWeight: number;
  carrierDetails: any;
  weightUnit: string;
  currencyCode: string;
  status: string;
  destFiscalYear: number;
  remarks: string;
  otherDetails: {
    rsoName: string;
  };
  reqDocNo: null;
}
export interface PriceRequestPayload {
  checkInventory?: true;
  itemCode: string;
  lotNumber: string;
  measuredWeight?: number;
  measuredQuantity?: number;
  standardPrice: any;
  inventoryId?: string;
  locationCode?: string;
}

export interface PriceDetailsResponse {
  data: any;
}
