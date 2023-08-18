

export interface LoadTransactionTypeMasterListingPayload {
  pageIndex: number;
  pageSize: number;
}


export interface LoadTransactionTypeMasterListingSuccessPayload {
  transactionTypeMasterListing: TransactionTypeMasterDetails[];
  totalElements: number;
}

export interface TransactionTypeMasterDetails {
  code: string;
  value: string;
  isActive: boolean
}