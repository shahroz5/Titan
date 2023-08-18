import { Moment } from 'moment';

export interface RequestList {
  id: number;
  reqDocNo: number;
  srcLocationCode: string;
  destLocationCode: string;
  totalRequestedQuantity: number;
  acceptedQuantity: number;
  approvedQuantity: number;
  status: string;
  reqDocDate: Moment;
  requestType: string;
  requestRemarks: string;
  totalElements: number;
  createdDate?: Moment;
}

export interface Request {
  items: RequestItem[];
  remarks: string;
  srcLocationCode: string;
}

export interface RequestItem {
  itemCode: string;
  quantity: number;
}

export interface BoutiqueList {
  locationCode: string;
  address: string;
  contactNo: string;
  phoneNo: string;
  description: string;
}

export interface ItemList {
  id: string;
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
  requestedQuantity: number;
  requestedWeight: number;
  acceptedQuantity: number;
  approvedQuantity: number;
  availableQuantity: number;
  inventoryId: string;
  totalAcceptedQuantity: number;
  productCategoryDesc: string;
  productGroupDesc: string;
  //history
  measuredValue?: number;
  measuredQuantity?: number;
  isStudded: boolean;
  isLoadingImage: boolean;
  isLoadingThumbnailImage: boolean;
  taxDetails: any;
}

export interface IsSelectedData {
  itemId: string;
  isSelected: boolean;
  itemCode: string;
  quantity: number;
}

export interface IsSelectedItemCode {
  isSelected: boolean;
  itemId: string;
}

export interface IsSelectedItem {
  itemId: string;
  itemCode: string;
}

export interface LoadRequestListPayload {
  requestGroup: string;
  searchValue: number;
  pageIndex: number;
  pageSize: number;
}

export interface LoadRequestListCountPayload {
  requestGroup: string;
  searchValue: number;
}

export interface LoadBoutiqueListPayload {
  item: RequestItem[];
  regionType: string;
  pageIndex?: number;
  pageSize?: number;
}

export interface LoadRequestPayload {
  id: number;
  requestGroup: string;
}
export interface LoadItemListPayload {
  id: number;
  requestGroup: string;
}
export interface UpdateItemListPayload {
  id: number;
  itemId: string;
  requestGroup: string;
  data: {
    quantity: number;
    status: string;
  };
}
export interface UpdateItemListStatusPayload {
  type: string;
  id: number;
  requestGroup: string;
  itemIds: string[];
  remarks: string;
}

export interface LoadIBTHistoryPayload {
  historyData: {
    actionType: string;
    dateRangeType: string;
    dateType: string;
    endDate?: number;
    locationCode?: string;
    reqDocNo?: number;
    reqFiscalYear?: number;
    startDate?: number;
    statuses: string[];
  };
  page: number;
  size: number;
  requestType: string;
}

export interface LoadIBTHistoryItemsPayload {
  historyItemsData: {
    binCodes?: string[];
    binGroupCode?: string;
    itemCode?: string;
    lotNumber?: string;
    productCategories?: string[];
    productGroups?: string[];
  };
  requestType?: string;
  value?: number;
  actionType?: string;
  page: number;
  size: number;
}
export interface IBThistoryHeaderPayload {
  id: string;
  srcLocationCode: string;
  destLocationCode: string;
  status: string;
  dateType: string;
  weightUnit: string;
  currencyCode: string;
  srcLocationDescription: string;
  destLocationDescription: string;
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
  reqDocDate: Moment;
  reqDocNo: number;
  reqLocationCode: string;
  requestType: string;
  otherDetails: {};
  carrierDetails: {};
  remarks: string;
}

export interface LoadIBTHistoryItemsResponse {
  count: number;
  items: IBThistoryHeaderPayload[];
}

export interface LoadSelectedHistoryHeaderInfoPayload {
  id: number;
  actionType: string;
}

export interface HistoryFilterData {
  startDate: number;
  endDate: number;
  reqFiscalYear: number;
  locationCode: string;
  statuses: string[];
  dateType: string;
}
