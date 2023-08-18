import { Moment } from 'moment';
import { ItemSummary } from '../master/item.model';
import { CustomErrors } from '../error.model';

export interface OtherReceiptsModel {
  id: number;
  currencyCode: string;
  carrierDetails: OtherReceiptCourierDetails;
  otherDetails: OtherReceiptOtherDetails;
  orderType: string;
  srcDocNo: number;
  srcDocDate: Moment;
  srcFiscalYear: number;
  destDocDate: Moment;
  destDocNo: number;
  weightUnit: string;
  locationCode: string;
  status: string;
  totalAvailableQuantity: number;
  totalAvailableValue: number;
  totalAvailableWeight: number;
  totalMeasuredQuantity: number;
  totalMeasuredValue: number;
  totalMeasuredWeight: number;
  transactionType: string;
  remarks?: string;
}

export interface PrintOtherReceivePayload {
  id: number;
  requestType: string;
}

export class OtherReceiptsDataModel {
  receiptsData: OtherReceiptsModel[] = [];
  totalElements: number;
}
export interface OtherReceiptCourierDetails {
  type: string;
  data: {
    courierCompany: string;
    docketNumber: string;
    employeeName: string;
    employeeCode: string;
    Designation: string;
    contactNo: number;
    emailId: string;
  };
}

export interface OtherReceiptOtherDetails {
  type: string;
  data: {
    approvalCode: string;
    approvedBy: string;
  };
}

export interface ConfirmAdjustementItem {
  binCode: string;
  binGroupCode: string;
  itemCode: string;
  measuredWeight: number;
  value: number;
  quantity: number;
  isHallmarked?:boolean;
}
export interface AdjustmentItem {
  id: string;
  itemCode: string;
  productCategory: string;
  productGroup: string;
  productCategoryId: string;
  productGroupId: string;
  measuredQuantity: number;
  measuredWeight: number;
  binCode: string;
  binGroupCode: string;
  stdValue: number;
  destDocNo: number;
  imageURL: string;
  thumbnailImageURL: string;
  isStudded?: boolean;
  taxDetails: any;
  isLoadingImage: boolean;
  isLoadingThumbnailImage: boolean;
  isHallmarked?:boolean;
}

export interface OtherReceiptItem {
  id: string;
  currencyCode: string;
  imageURL: string;
  thumbnailImageURL: string;
  itemCode: string;
  itemDetails: OtherReceiptItemDetail;
  itemValue: number;
  lotNumber: string;
  mfgDate: Moment;
  orderType: string;
  productCategory: string;
  productCategoryDesc: string;
  productGroup: string;
  productGroupDesc: string;
  status: string;
  totalQuantity: number;
  totalValue: number;
  totalWeight: number;
  weightUnit: string;
  measuredQuantity: number;
  measuredWeight: number;
  binCode: string;
  binGroupCode: string;
  remarks: string;
  stdValue: number;
  stdWeight: number;
  availableQuantity: number;
  availableWeight: number;
  availableValue: number;
  measuredValue: number;
  isUpdating: boolean;
  isUpdatingSuccess: boolean;
  isValidating: boolean;
  isValidatingSuccess: boolean;
  isValidatingError: boolean;
  isStudded: boolean;
  taxDetails: any;
  isLoadingImage: boolean;
  isLoadingThumbnailImage: boolean;
  isHallmarked?:boolean;
}
export class OtherReceiptItemDetail {
  otherStoneWt: number;
  actualGoldWeight: number;
}
export interface OtherReceiptItemUpdate {
  binCode: string;
  binGroupCode: string;
  measuredWeight: number;
  remarks: string;
  itemDetails: Object;
}
export interface ConfirmOtherReceive {
  courierReceivedDate?: string;
  // * for l1/l2
  reasonForDelay?: string;
  // * for l3
  receivedDate?: string;
  remarks: string;
}
export interface OtherReceiptItemToUpdate {
  id: string;
  newUpdate: OtherReceiptItemUpdate;
  actualDetails: OtherReceiptItemUpdate;
}
export interface OtherReceiptFilterOption {
  id: string;
  description: string;
}
export interface LoadOtherReceiptsSTNCountPayload {
  pendingOtherReceiptsSTNCount: number;
  countData: OtherReceiptTransferType[];
}
export interface OtherReceiptLoadDropDownPayload {
  dropDownValue: OtherReceiptTransferType[];
}
export interface AdjustmentSearchSuccessPayload {
  item: ItemSummary;
}

export interface OtherReceiptSearchPendingPayload {
  srcDocnumber: number;
  type: string;
}

export interface OtherReceiptLoadListItemsPayload {
  type: string;
  pageIndex: number;
  pageSize: number;
}

export interface OtherReceiptLoadSelectedPayload {
  reqDocNo: number;
  type: string;
}

export interface OtherReceiptLoadItemsPayload {
  id: number;
  pageIndex: number;
  pageSize: number;
  sortBy: string;
  property: string;
  transactionType: string;
  itemCode?: string;
  lotNumber?: string;
  sort?: Map<string, string>;
  filter?: { key: string; value: any[] }[];
}
export interface OtherReceiptAdjustmentSearchPayload {
  variantCode: string;
  lotNumber: string;
}
export interface OtherReceiptConfirmAdjustmentItemsPayload {
  items: ConfirmAdjustementItem[];
  remarks: string;
  type: string;
}
export interface OtherReceiptUpdateAdjustementItemPayload {
  itemId: string;
  items: ConfirmAdjustementItem;
}
export interface OtherReceiptSearchCartItemAdjustmentPayload {
  searchValue: string;
}
export interface OtherReceiptStockPayLoad {
  id: string;
  transactionType: string;
}
export interface OtherReceiptLoadItemsTotalCountPayload {
  transactionType: string;
  id: number;
}
export interface OtherReceiptLoadItemsTotalCountPayloadInfo {
  filter: { key: string; value: any[] }[];
  itemCode: string;
  lotNumber: string;
}
export interface OtherReceiptLoadItemsTotalCountSuccessPayload {
  nonVerifiedItemsTotalCount: number;
  verifiedItemsTotalCount: number;
}
export interface OtherReceiptUpdateItemPayload {
  id: number;
  itemId: string;
  newUpdate: OtherReceiptItemUpdate;
  actualDetails: OtherReceiptItemUpdate;
  transactionType: string;
}

export interface OtherReceiptUpdateItemFailurePayload {
  itemId: string;
  actualDetails: OtherReceiptItemUpdate;
  error: CustomErrors;
}

export interface OtherReceiptUpdateAllItemsPayload {
  id: number;
  data: {
    binCode?: string;
    binGroupCode?: string;
    id?: string[];
    status?: string;
  };
  transactionType: string;
}

export interface ConfirmOtherReceiptPayload {
  id: number;
  confirmReceive: ConfirmOtherReceive;
  transactionType: string;
}
export interface OtherReceiptSearchItemsPayload {
  id: number;
  itemCode: string;
  lotNumber: string;
  status: string;
  transactionType: string;
}
export interface ConfirmOtherReceivePayload {
  id: number;
  confirmReceive: ConfirmOtherReceive;
  transactionType: string;
}

export interface ConfirmStockReceivePayload {
  id: number;
  confirmReceive: ConfirmOtherReceive;
  transactionType: string;
}
export interface OtherReceiptTransferType {
  type: string;
  count: number;
}
export interface OtherReceiptItemValidate {
  itemId: string;
  productGroupCode: string;
  availableWeight: number;
  measuredWeight: number;
  measuredQuantity: number;
  availableQuantity: number;
}
export const sortFilterDataOtherReceipt = [
  {
    id: 0,
    sortByColumnName: 'Item Weight',
    sortAscOrder: false
  },
  {
    id: 1,
    sortByColumnName: 'Item Quantity',
    sortAscOrder: false
  }
];
export interface OtherReceiptHistoryPayload {
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
export interface LoadOtherReceiptsHistoryPayload {
  page: number;
  size: number;
  sort?: string;
  payload: OtherReceiptHistoryPayload;
  transactionType: string;
}
export interface OtherReceiptsHistoryItemsPayload {
  binCodes: string[];
  binGroupCode: string;
  itemCode: string;
  lotNumber: string;
  productCategories: string[];
  productGroups: string[];
}
export interface LoadOtherReceiptsHistoryItemsPayload {
  id: number;
  page: number;
  size: number;
  sort: string[];
  payload: OtherReceiptsHistoryItemsPayload;
  transactionType: string;
}
