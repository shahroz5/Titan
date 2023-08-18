export interface BankDetailsPayload {
  bankName: string;
  cashbackName: string;
  cardNoLength: string;
  cmRemarks: string;
  endDate: any;
  excludeCashback: boolean;
  digitsTobeValidated: string;
  fromFirst: boolean;
  id?: string;
  isActive: boolean;
  maxUsageCount: string;
  mobileFlag: boolean;
  offerRemarks: string;
  startDate: any;
  isCashAmount: boolean;
}

export interface SaveBankDetailsPayload {
  cashbackName: string;
  bankName: string;
  startDate: any;
  endDate: any;
  firstCardDigits?: string;
  maxUsageCount: string;
  mobileFlag: boolean;
  cmRemarks: string;
  offerRemarks: string;
  cardNoLength: string;
  excludeCashback: boolean;
  isActive: boolean;
  lastCardDigits?: string;
}
export interface UpdateBankDetailsPayload {
  id: string;
  data: any;
}
export enum params {
  new = 'new',
  set = "set",
  append = "append"
}

export interface CashbackOffer {
  id: string;
  cashBackName: string;
  cardBankName: string;
  isActive: boolean;
}

export interface CashbackOfferList {
  cashbackOfferList: CashbackOffer[];
  totalElements: number;
}
export interface LoadCashbackOfferListPayload {
  pageIndex: number;
  pageSize: number;
  length: number;
}

export interface PayerBankList {
  id: string;
  name: string;
}

export interface OfferDetails {
  discountAmt: string;
  discountPercent: number;
  isActive?: true;
  maxDiscountPercent: number;
  maxInvoiceAmt: number;
  maxSwipeAmt: number;
  minInvoiceAmt: number;
  minSwipeAmt: number;
  isCashbackAmount: boolean;
  excludeCashback?: boolean;
  mode?: string;
  lastRowData?: OfferDetails;
  nextRowData?: OfferDetails;
  isUpdated?: boolean;
  isSaved?: boolean;
  id?: string;
  rowId?: number;
}

export interface UpdateOffer {
  discountAmt: number;
  discountPercent: number;
  id: string;
  maxDiscountAmt: number;
}

export interface OfferDetailResponse {
  data: {
    addOffers?: any[];
    isCashbackAmount?: boolean;
    updateOffers?: any;
    removeOffers?: any;
  };
  id: string;
}

export interface SaveProductGroupPayload {
  id: string;
  data: {
    addProductGroups: { productGroupCode: string }[];
    removeProductGroups: string[];
  };
}

export enum offerDetailsEnum {
  amount = 'amount',
  percentage = 'percentage',
  new = 'new',
  edit = 'edit'
}

export interface UploadFile {
  id: string;
  reqfile: FormData;
}
export interface CardDetails {
  id: string;
  cardNo: string;
  isActive: boolean;
  newlyAdded: boolean;
}
export interface CardDetailsResponse {
  cardDetails: CardDetails[];
  totalElements: number;
}
export interface UpdateCardDetails {
  id: string;
  updateCards: any;
}

export interface CardDetailsUploadResponse {
  fileProcessId: string;
  hasError: boolean;
  message: string;
  records: CardDetailsUploadCount;
}
export interface CardDetailsUploadCount {
  errorLogId: string;
  failureCount: number;
  successCount: number;
  totalCount: number;
}
