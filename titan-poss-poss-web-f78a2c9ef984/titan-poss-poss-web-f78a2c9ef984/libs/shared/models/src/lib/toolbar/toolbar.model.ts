export interface TransactionListPayload {
  pageIndex?: number;
  pageSize?: number;
  searchValue?: any;
  status?: string;
  txnType?: string;
  subTxnType?: string;
  fiscalYear?: number;
  customerName?: string;
}

export interface TransactionListCountPayload {
  status: string;
  txnType: string;
  subTxnType: string;
}

export interface DataEvent {
  searchData: any;
  pageIndex: number;
  type: string;
}

export interface ToolbarConfig {
  txnType?: string;
  subTxnType?: string;
  loadMetalPrices: boolean;
  loadHoldPopup: boolean;
  loadOpenOrdersPopup: boolean;
}
