// export interface SelectedRSOName {
//    name: string;
//    id: number;
// }

export interface CardBalanceDetails {
  cardNo: string;
  bin: string;
  balance: number;
  expiryDate: string;
}

// export interface ScannedGcDetail {
//    cardNo: string;
//    bin: string;
//    amount: number;
//    tax: number;
//    finalPrice: number;
// }

export interface AmountSpecification {
  minAmount: number;
  maxAmount: number;
}

export interface ProductGroupDetail {
  productGroupCode: string[];
  paymentCategoryName: string;
  redemptionType: string;
}

export interface CpgGroupDescription {
  cpgGroupDescription: string;
}

export interface CreatedGiftCardCashMemoDetails {
  id: string;
  status: string;
  docNo: string;
  subTxnType: string;
  txnType: string;
  manualBillDetails: any;
}

export interface GetCreatedGiftCardCmDetails {
  id: string;
  status: string;
  docNo: string;
}

export interface GetPartiallyUpdatedGcCmResponse {
  customerId: number;
  paidValue: number;
  id: string;
  status: string;
  docNo: number;
  docDate: number;
  employeeCode: string;
  txnType: string;
  subTxnType: string;
}

export interface GetUpdatedGcCashMemoResponse {
  customerId: number;
  docDate: string;
  docNo: number;
  employeeCode: string;
  finalValue: number;
  id: string;
  paidValue: number;
  remarks: string;
  status: string;
  subTxnType: string;
  totalDiscount: number;
  totalQuantity: number;
  totalTax: number;
  totalValue: number;
  txnType: string;
}

export interface GetAddedGiftCardItemResponse
  extends GetDeletedGiftCardItemResponse {
  giftDetailsDto: {
    itemId: string;
    instrumentNo: string;
    vendorCode: string;
    binCode: string;
    giftType: string;
    rowId: number;
    totalValue: number;
    finalValue: number;
    totalTax: number;
  };
}

export interface GetDeletedGiftCardItemResponse {
  customerId: number;
  totalQuantity: number;
  totalWeight: number;
  totalValue: number;
  totalTax: number;
  finalValue: number;
  totalDiscount: number;
  paidValue: number;
  id: string;
  status: string;
  docNo: number;
  docDate: number;
  employeeCode: string;
  txnType: string;
  subTxnType: string;
}

export interface GetGiftCardItemResponse {
  binCode: string;
  finalValue: number;
  giftType: string;
  instrumentNo: string;
  itemId: string;
  rowId: number;
  totalTax: number;
  totalValue: number;
  vendorCode: string;
}

export interface AddGiftCardItemPayload {
  finalValue: number;
  instrumentNo: string;
  rowId: number;
  totalTax: number;
  totalValue: number;
}

export interface PartiallyUpdateGiftDetailsPayload {
  finalValue: number;
  totalTax: number;
  totalValue: number;
}

export interface GcCashMemoDetailsRequest {
  customerId: number;
  finalValue: number;
  remarks: string;
  totalDiscount: number;
  totalQuantity: number;
  totalTax: number;
  totalValue: number;
  paidValue: number;
  totalWeight: number;
}

export interface GiftCardItem {
  cardNo: string;
  bin: string;
  amount: number;
  tax: number;
  finalPrice: number;
  itemId: string;
}

export interface PartiallyUpdateGcCmPayload {
  customerId?: number;
  employeeCode?: string;
}

export interface CancellableCashMemoData {
  customerName: string;
  refDocDate: string;
  refDocNo: number;
  refTxnId: string;
  refTxnTime: string;
  subTxnType: string;
}

export interface CashMemoMinimalDetail {
  customerId: number;
  itemIdList: string[];
  id: string;
  docNo: number;
  totalQuantity: number;
  totalTax: number;
  confirmedTime: number;
  totalValue: number;
  employeeCode?: string;
  docDate?: number;
  status?: string;
  remarks?: string;
  panCardNumber?: string;
  oldPanCardNumber?: string;
}

export interface GcCashMemoCancelRequestBody {
  cancelType: string;
  reasonForCancellation: string;
  refTxnId: string;
  remarks: string;
  employeeCode: string;
}

export interface GcCashMemoCancelResponse {
  cndocNos: number[];
  docNo: number;
  id: string;
}

export interface GiftCardsHistoryRequestPayload {
  filterOptions: {
    docNo?: number;
    fiscalYear?: number;
    fromDocDate?: any;
    toDocDate?: any;
    searchType?: string;
    searchField?: string;
  };
  sort: string;
  page?: number;
  size?: number;
  txnType?: string;
  subTxnType?: string;
}
export interface GiftCardsHistoryListItems {
  docNo: number;
  fiscalYear: number;
  docDate: any;
  createdDate: any;
  customerName: string;
  totalQuantity: number;
  netAmount: number;
  status: string;
  id: string;
}

export interface GiftCardsHistoryListItemsResponse {
  giftCardsHistoryListItems: GiftCardsHistoryListItems[];
  totalElements: number;
}

export interface RsoNameObject {
  value: string;
  description: string;
}
