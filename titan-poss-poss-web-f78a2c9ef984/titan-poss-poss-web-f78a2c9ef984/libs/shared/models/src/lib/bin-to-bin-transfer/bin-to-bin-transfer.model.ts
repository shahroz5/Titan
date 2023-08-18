import { Moment } from 'moment';

export interface BinToBinTransferItem {
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
  productCategory: string;
  productGroup: string;
  productCategoryDesc: string;
  productGroupDesc: string;
  availableQuantity: number;
  isBinToBinAllowed?: boolean;
  transferQuantity?: number;
  availableValue: number;
  availableWeight: number;
  weightUnit: string;
  binCode: string;
  binGroupCode: string;
  isSelected: boolean;
  isDisabled: boolean;
  destinationBinGroupCode: string;
  destinationBinCode: string;
  destBinCode?: string;
  status?: string;
  measuredWeight?: number;
  measuredQuantity?: number;
  isStudded: boolean;
  isLoadingImage: boolean;
  isLoadingThumbnailImage: boolean;
  defectTypeDesc?: string;
  defectCodeDesc?: string;
  fileId?: number;
}

export interface BinToBinTransferConfirmTransferItemsRequest {
  request: {
    binItems: {
      binCode: string;
      inventoryId: string;
      binGroupCode: string;
    }[];
  };
  remove: boolean;
  fileId?: number;
}

export interface BinToBinFileUploadItemsBulkTransferRequest {
  fileId: number;
  destinationBinGroup: string;
  destinationBincode: string;
}

export interface BinToBinTransferLoadFileUploadItemsRequest {
  fileId: number;
  pageSize: number;
  pageIndex: number;
}
export interface BinToBinTransferConfirmTransferAllItemsRequest {
  type: string;
  value: string;
  destinationBinCode: string;
  destinationBinGroupCode: string;
}
export interface BinToBinTransferConfirmTransferResponse {
  transferId: number;
}

export interface BinToBinTransferItemListGroup {
  id: string;
  name: string;
  description: string;
  products: number;
  totalValue: number;
  totalWeight: number;
  currencyCode: string;
  weightUnit: string;
}

export interface BinToBinTransferLoadItemGroupsPayload {
  type: string;
  pageIndex?: number;
  pageSize?: number;
  value?: string;
}

export interface BinToBinTransferLoadItemListGroupResponse {
  count: number;
  itemListGroups: BinToBinTransferItemListGroup[];
}

export interface BinToBinTransferLoadItemsPayload {
  itemCode?: string;
  lotNumber?: string;
  type?: string;
  value?: string;
  pageIndex?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: string;
  filter?: { key: string; value: any[] }[];
  id?: number;
  storeTypes?: string;
}

export interface BinToBinTransferLoadItemsResponse {
  count: number;
  totalValue?: number;
  totalQuantity?: number;
  binToBinAllowedtotalQuantity?: number;
  binToBinAllowedtotalItems?: number;
  binToBinAllowedtotalValue?: number;
  items: BinToBinTransferItem[];
  notInStock?: string[];
  invalidItems?: string[];
}

export interface BinToBinTransferLoadHistoryItemsResponse {
  count: number;
  items: BinToBinTransferHistoryItemHeader[];
}

export interface BinToBinTransferLoadHistoryItemsPayload {
  historyItemsData: {
    binCodes?: string[];
    binGroupCode?: string;
    itemCode?: string;
    lotNumber?: string;
    productCategories?: string[];
    productGroups?: string[];
  };
  value?: string;
  pageIndex?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: string;
  id?: string;
}

export interface BinToBinTransferChangeSelectionPayload {
  select: boolean;
  disable: boolean;
  idList: string[];
  resetBin: boolean;
}

export interface BinToBinTransferUpdateDestinationBinPayload {
  destinationBinGroupCode: string;
  destinationBinCode: string;
  idList: string[];
}

export interface BinToBinTransferHistoryItemHeader {
  id: string;
  transactionType: string;
  locationCode: string;
  srcDocNo: number;
  srcFiscalYear: number;
  srcDocDate: Moment;
  destDocNo: number;
  destDocDate: string;
  totalAvailableQuantity: number;
  totalMeasuredQuantity: number;
  locationCodeDescription: string;
  totalAvailableValue: number;
  totalMeasuredValue: number;
  totalAvailableWeight: number;
  totalMeasuredWeight: number;
  carrierDetails: {};
  weightUnit: string;
  currencyCode: string;
  status: string;
  destFiscalYear: number;
  remarks: string;
  otherDetails: {};
}

export interface LoadBinToBinTransferHistoryPayload {
  historyData: {
    actionType: string;
    dateRangeType: string;
    endDate?: any;
    issueDocNo?: number;
    issueFiscalYear?: number;
    receiveDocNo?: number;
    receiveFiscalYear?: number;
    startDate?: any;
    statuses: string[];
  };
  page: number;
  size: number;
  transactionType: string;
}

export interface LoadSelectedBinToBinHeaderInfoPayload {
  id: number;
}

export interface AdvancedFilterData {
  startDate: any;
  endDate: any;
  fiscalYear: number;
}

