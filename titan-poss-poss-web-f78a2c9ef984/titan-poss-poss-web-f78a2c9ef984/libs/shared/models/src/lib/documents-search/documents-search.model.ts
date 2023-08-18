export interface InvoiceListResponse {
  pageNumber: number;
  pageSize: number;
  results: {
    customerId: number;
    docDate: string;
    docNo: number;
    documentId: string;
    documentName: string;
    fiscalYear: number;
    locationCode: string;
    status: string;
    subTxnType: string;
    transactionId: string;
    txnType: string;
  }[];
  totalElements: number;
  totalPages: number;
}

export interface InvoiceListPayload {
  docNo?: number;
  fiscalYear?: number;
  fromDocDate?: string;
  locationCode?: string;
  toDocDate?: string;
}

export interface InvoiceResult {
  customerId: number;
  docDate: string;
  docNo: number;
  documentId: string;
  documentName: string;
  fiscalYear: number;
  locationCode: string;
  status: string;
  subTxnType: string;
  transactionId: string;
  txnType: string;
}
