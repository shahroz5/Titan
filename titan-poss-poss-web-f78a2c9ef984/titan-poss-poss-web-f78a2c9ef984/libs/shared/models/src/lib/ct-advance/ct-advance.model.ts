export interface InitiateAdvanceResponse {
  docNo: number;
  id: string;
  status: string;
  subTxnType: string;
  txnType: string;
}

export interface ViewAdvanceTransactionDetailsResponse {
  customerId: number;
  docDate: string;
  docNo: number;
  employeeCode: string;
  finalValue: number;
  fiscalYear: number;
  frozenRateDetails: {};
  id: string;
  remarks: string;
  status: string;
  txnTime: string;
}

export interface UpdateAdvanceRequestPayload {
  customerId: number;
  paidValue: number;
  remarks: string;
  weightAgreed?: number;
}

export interface UpdateAdvanceTransactionResponse {
  cndocNos: number[];
  docNo: number;
  id: string;
}

export interface PartialUpdateAdvanceRequestPayload {
  customerId?: number;
  employeeCode?: string;
  metalType?: string;
  totalValue?: number;
  isPaymentForEGHS?: boolean;
}

export interface AdvanceHistoryItem {
  cnDocNo: number;
  createdBy: string;
  createdDate: string;
  customerName: string;
  docDate: string;
  docNo: number;
  eghsPayment: {
    type: string;
    data: {
      isPaymentForEGHS: boolean;
    };
  };
  fiscalYear: number;
  frozenGoldWeight: string;
  netAmount: number;
  id: string;
}

export interface AdvanceHistoryItemsRequestPayload {
  docNo?: number;
  fiscalYear?: number;
  fromDocDate?: number;
  fromNetAmount?: number;
  refDocNo?: number;
  toDocDate?: number;
  toNetAmount?: number;
}

export interface AdvanceHistoryResponse {
  results: AdvanceHistoryItem[];
  totalElements: number;
}

export interface HistorySearchParamDetails {
  fiscalYear?: number;
  docNo?: number;
  cnDocNo?: number;
  startDate?: string;
  endDate?: string;
  fromValue?: number;
  toValue?: number;
  searchField?: string;
  searchType?: string;
  status?: string;
  mobileNumber?: string;
  tepType?: string;
  subTxnType?: string;
}

export interface bcHistoryRequestParams {
  docNo?: number;
  fiscalYear?: number;
  fromDocDate?: any;
  fromNetAmount?: number;
  refDocNo?: number;
  toDocDate?: string;
  toNetAmount?: number;
}
